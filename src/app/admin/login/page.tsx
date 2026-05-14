'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'password' | 'totp';

export default function AdminLogin() {
  const [step, setStep]         = useState<Step>('password');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();
  const totpRef = useRef<HTMLInputElement>(null);

  // Auto-focus TOTP input when step changes
  useEffect(() => {
    if (step === 'totp') totpRef.current?.focus();
  }, [step]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const body: Record<string, string> =
      step === 'totp' ? { password, totpCode } : { password };

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.totpRequired) {
      setStep('totp');
      setLoading(false);
      return;
    }

    if (res.ok) {
      router.push('/admin/ordenes');
      return;
    }

    setError(data.error ?? 'Error al ingresar');
    // On wrong TOTP code, clear the field but stay on step totp
    if (step === 'totp') setTotpCode('');
    setLoading(false);
  }

  function handleBack() {
    setStep('password');
    setTotpCode('');
    setError('');
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="w-full max-w-sm px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-[6px] text-white">
            WIIMY<span className="text-[#ff5c35]">.</span>ADMIN
          </h1>
          {step === 'totp' && (
            <p className="text-white/30 text-xs uppercase tracking-widest mt-3">
              Verificación en dos pasos
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {step === 'password' ? (
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-sm text-sm outline-none focus:border-[#ff5c35] transition-colors"
              autoFocus
              required
            />
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-white/40 text-xs text-center">
                Ingresá el código de 6 dígitos de tu app autenticadora
              </p>
              <input
                ref={totpRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-sm outline-none focus:border-[#ff5c35] transition-colors text-center tracking-[0.4em] text-lg"
                required
              />
            </div>
          )}

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#ff5c35] text-white font-bold py-3 text-sm uppercase tracking-widest rounded-sm hover:bg-white hover:text-[#0d0d0d] transition-colors disabled:opacity-50"
          >
            {loading ? 'Verificando...' : step === 'totp' ? 'Verificar' : 'Ingresar'}
          </button>

          {step === 'totp' && (
            <button
              type="button"
              onClick={handleBack}
              className="text-white/30 text-xs text-center hover:text-white transition-colors"
            >
              ← Volver
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
