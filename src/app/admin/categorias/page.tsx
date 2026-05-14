'use client';

import { useEffect, useState } from 'react';
import type { CategoryDto } from '@/types';

const API = '/api/v1';

const inputCls =
  'bg-white/5 border border-white/10 text-white px-3 py-2 rounded-sm text-sm outline-none focus:border-[#ff5c35] transition-colors';

interface EditState {
  name: string;
  label: string;
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loadError, setLoadError]   = useState('');

  // ── New category form ─────────────────────────────────────────────────────
  const [newName,  setNewName]  = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // ── Inline edit ───────────────────────────────────────────────────────────
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editState, setEditState]   = useState<EditState>({ name: '', label: '' });
  const [saving,    setSaving]      = useState(false);
  const [editError, setEditError]   = useState('');

  async function load() {
    try {
      const res = await fetch(`${API}/categories`);
      if (!res.ok) throw new Error();
      setCategories(await res.json());
      setLoadError('');
    } catch {
      setLoadError('No se pudo conectar al servidor.');
    }
  }

  useEffect(() => { load(); }, []);

  // ── Create ────────────────────────────────────────────────────────────────
  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    const res = await fetch(`${API}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), label: newLabel.trim() || null, active: true }),
    });
    if (res.ok) {
      setNewName('');
      setNewLabel('');
      await load();
    } else {
      const data = await res.json().catch(() => ({}));
      setCreateError(data.message ?? 'Error al crear la categoría');
    }
    setCreating(false);
  }

  // ── Edit ──────────────────────────────────────────────────────────────────
  function startEdit(cat: CategoryDto) {
    setEditingId(cat.id);
    setEditState({ name: cat.name, label: cat.label ?? '' });
    setEditError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError('');
  }

  async function handleSave(id: string) {
    setSaving(true);
    setEditError('');
    const res = await fetch(`${API}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:   editState.name.trim(),
        label:  editState.label.trim() || null,
        active: categories.find((c) => c.id === id)?.active ?? true,
      }),
    });
    if (res.ok) {
      setEditingId(null);
      await load();
    } else {
      const data = await res.json().catch(() => ({}));
      setEditError(data.message ?? 'Error al guardar');
    }
    setSaving(false);
  }

  // ── Toggle active ─────────────────────────────────────────────────────────
  async function handleToggleActive(cat: CategoryDto) {
    const next = !cat.active;
    const res = await fetch(`${API}/categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: cat.name, label: cat.label, active: next }),
    });
    if (res.ok) await load();
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-wide">Categorías</h1>
        <p className="text-white/30 text-sm mt-1">
          Gestioná las categorías de productos. El <strong className="text-white/50">Nombre</strong> es
          el identificador interno (se guarda en mayúsculas) y el <strong className="text-white/50">Label</strong> es
          lo que ven los visitantes en los filtros.
        </p>
      </div>

      {/* ── Nueva categoría ─────────────────────────────────────────────── */}
      <div className="bg-white/[0.03] border border-white/10 rounded-sm p-5 mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Nueva categoría</h2>
        <form onSubmit={handleCreate} className="flex gap-3 flex-wrap items-end">
          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
            <label className="text-xs text-white/30 uppercase tracking-widest">Nombre *</label>
            <input
              className={inputCls}
              placeholder="ej: STICKERS"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
            <label className="text-xs text-white/30 uppercase tracking-widest">Label (visible)</label>
            <input
              className={inputCls}
              placeholder="ej: Stickers"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="bg-[#ff5c35] text-white font-bold px-5 py-2 text-sm uppercase tracking-widest rounded-sm hover:bg-white hover:text-[#0d0d0d] transition-colors disabled:opacity-50"
          >
            {creating ? 'Agregando...' : '+ Agregar'}
          </button>
        </form>
        {createError && <p className="text-red-400 text-xs mt-2">{createError}</p>}
      </div>

      {/* ── Lista ───────────────────────────────────────────────────────── */}
      {loadError ? (
        <p className="text-red-400 text-sm">{loadError}</p>
      ) : (
        <div className="border border-white/10 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/30 text-xs uppercase tracking-widest">
                <th className="text-left px-4 py-3 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 font-medium">Label</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-white/20 text-xs uppercase tracking-widest">
                    Sin categorías
                  </td>
                </tr>
              )}
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  {editingId === cat.id ? (
                    <>
                      <td className="px-4 py-2.5">
                        <input
                          className={`${inputCls} w-full`}
                          value={editState.name}
                          onChange={(e) => setEditState((s) => ({ ...s, name: e.target.value }))}
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          className={`${inputCls} w-full`}
                          value={editState.label}
                          onChange={(e) => setEditState((s) => ({ ...s, label: e.target.value }))}
                          placeholder="Label visible"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        {editError && <p className="text-red-400 text-xs">{editError}</p>}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleSave(cat.id)}
                            disabled={saving}
                            className="text-xs font-bold text-[#ff5c35] hover:text-white transition-colors disabled:opacity-50"
                          >
                            {saving ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-xs text-white/30 hover:text-white transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-white font-medium">{cat.name}</td>
                      <td className="px-4 py-3 text-white/50">{cat.label ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                            cat.active
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-white/5 text-white/30'
                          }`}
                        >
                          {cat.active ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-4 justify-end">
                          <button
                            onClick={() => startEdit(cat)}
                            className="text-xs text-white/40 hover:text-white transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleActive(cat)}
                            className={`text-xs transition-colors ${
                              cat.active
                                ? 'text-white/30 hover:text-red-400'
                                : 'text-white/30 hover:text-emerald-400'
                            }`}
                          >
                            {cat.active ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
