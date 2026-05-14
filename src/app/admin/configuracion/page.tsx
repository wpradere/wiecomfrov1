'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const inputCls =
  'bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-sm text-sm outline-none focus:border-[#ff5c35] transition-colors';

// ── Password section ──────────────────────────────────────────────────────────

function PasswordSection() {
  const [form, setForm]     = useState({ current: '', next: '', confirm: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    if (form.next !== form.confirm) {
      setStatus('error');
      setMessage('Las contraseñas nuevas no coinciden');
      return;
    }
    setStatus('loading');
    const res = await fetch('/api/admin/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: form.current, newPassword: form.next }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus('success');
      setMessage('Contraseña actualizada correctamente');
      setForm({ current: '', next: '', confirm: '' });
    } else {
      setStatus('error');
      setMessage(data.error ?? 'Error al cambiar la contraseña');
    }
  }

  return (
    <div className="bg-[#111] border border-white/10 rounded-sm p-6">
      <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-5">
        Cambiar contraseña
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">
            Contraseña actual
          </label>
          <input type="password" className={inputCls} value={form.current}
            onChange={(e) => set('current', e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">
            Nueva contraseña
          </label>
          <input type="password" className={inputCls} value={form.next} minLength={6}
            onChange={(e) => set('next', e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40">
            Confirmar nueva contraseña
          </label>
          <input type="password" className={inputCls} value={form.confirm}
            onChange={(e) => set('confirm', e.target.value)} required />
        </div>
        {message && (
          <p className={`text-sm ${status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[#ff5c35] text-white font-bold py-3 text-sm uppercase tracking-widest rounded-sm hover:bg-white hover:text-[#0d0d0d] transition-colors disabled:opacity-50 mt-1"
        >
          {status === 'loading' ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </div>
  );
}

// ── 2FA section ───────────────────────────────────────────────────────────────

interface TwoFAState {
  enabled: boolean;
  qrDataUrl?: string;
  secret?: string;
}

function TwoFASection() {
  const [state, setState]     = useState<TwoFAState | null>(null);
  const [loading, setLoading] = useState(false);
  const [testCode, setTestCode] = useState('');
  const [testResult, setTestResult] = useState<'idle' | 'ok' | 'fail'>('idle');

  async function load() {
    const res = await fetch('/api/admin/2fa');
    if (res.ok) setState(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleEnable() {
    setLoading(true);
    const res = await fetch('/api/admin/2fa', { method: 'POST' });
    if (res.ok) setState(await res.json());
    setLoading(false);
  }

  async function handleDisable() {
    if (!confirm('¿Desactivar la autenticación en dos pasos?')) return;
    setLoading(true);
    await fetch('/api/admin/2fa', { method: 'DELETE' });
    setState({ enabled: false });
    setLoading(false);
  }

  async function handleTest(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch('/api/admin/2fa', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totpCode: testCode }),
    });
    const data = await res.json();
    setTestResult(data.valid ? 'ok' : 'fail');
    setTestCode('');
  }

  if (!state) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-sm p-6">
        <p className="text-white/30 text-sm">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-white/10 rounded-sm p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Autenticación en dos pasos (2FA)
          </h2>
          <p className="text-xs text-white/30 mt-1">
            Requiere un código de Google Authenticator o similar al iniciar sesión.
          </p>
        </div>
        <span
          className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm ${
            state.enabled
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-white/5 text-white/30'
          }`}
        >
          {state.enabled ? 'Activa' : 'Inactiva'}
        </span>
      </div>

      {state.enabled && state.qrDataUrl ? (
        <>
          {/* QR code */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-white/50">
              Escaneá este código QR con tu app autenticadora (Google Authenticator, Authy, etc.):
            </p>
            <div className="bg-white p-3 rounded-sm self-start">
              <Image src={state.qrDataUrl} alt="QR 2FA" width={160} height={160} unoptimized />
            </div>
            <p className="text-xs text-white/30">
              O ingresá el código manualmente:{' '}
              <span className="font-mono text-white/60 tracking-widest">{state.secret}</span>
            </p>
          </div>

          {/* Test */}
          <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
            <p className="text-xs text-white/40">
              Verificá que el código funciona antes de cerrar sesión:
            </p>
            <form onSubmit={handleTest} className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Código de 6 dígitos"
                value={testCode}
                onChange={(e) => { setTestCode(e.target.value.replace(/\D/g, '')); setTestResult('idle'); }}
                className={`${inputCls} tracking-widest flex-1`}
              />
              <button
                type="submit"
                className="bg-white/10 text-white text-xs font-bold px-4 rounded-sm hover:bg-white/20 transition-colors uppercase tracking-widest"
              >
                Verificar
              </button>
            </form>
            {testResult === 'ok'  && <p className="text-emerald-400 text-xs">✓ Código correcto — 2FA configurado correctamente</p>}
            {testResult === 'fail' && <p className="text-red-400 text-xs">✗ Código incorrecto — intentá de nuevo</p>}
          </div>

          {/* Regenerate / Disable */}
          <div className="border-t border-white/10 pt-4 flex gap-3">
            <button
              onClick={handleEnable}
              disabled={loading}
              className="text-xs text-white/30 hover:text-white transition-colors disabled:opacity-50"
            >
              Regenerar secreto
            </button>
            <span className="text-white/10">|</span>
            <button
              onClick={handleDisable}
              disabled={loading}
              className="text-xs text-white/30 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              Desactivar 2FA
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={handleEnable}
          disabled={loading}
          className="bg-[#ff5c35] text-white font-bold py-3 text-sm uppercase tracking-widest rounded-sm hover:bg-white hover:text-[#0d0d0d] transition-colors disabled:opacity-50 self-start px-6"
        >
          {loading ? 'Generando...' : 'Activar 2FA'}
        </button>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Configuracion() {
  return (
    <div className="p-8 max-w-sm flex flex-col gap-6">
      <h1 className="text-2xl font-black text-white tracking-wide">Configuración</h1>
      <PasswordSection />
      <TwoFASection />
    </div>
  );
}
