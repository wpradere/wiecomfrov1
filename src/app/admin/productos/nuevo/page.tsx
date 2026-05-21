'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CategoryDto } from '@/types';

const API = '/api/v1';

const SECTIONS = [
  { value: 'SUBLIMACION', label: 'Sublimación' },
  { value: 'ZONA_GEEK',   label: 'Zona Geek' },
];

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-white/40">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-sm text-sm outline-none focus:border-[#ff5c35] transition-colors';
const selectCls = `${inputCls} cursor-pointer`;

export default function NuevoProducto() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
    section: 'SUBLIMACION',
    stock: '0',
    edition: '',
    featured: false,
    active: true,
  });

  useEffect(() => {
    fetch(`${API}/categories`)
      .then((r) => r.json())
      .then((data: CategoryDto[]) => {
        const active = data.filter((c) => c.active);
        setCategories(active);
        if (active.length > 0) setForm((prev) => ({ ...prev, categoryId: active[0].id }));
      })
      .catch(() => {});
  }, []);

  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const showSizes = selectedCategory?.name === 'CLOTHES' && form.section === 'SUBLIMACION';

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) set('imageUrl', data.url);
    setUploading(false);
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        imageUrl: form.imageUrl || null,
        categoryId: form.categoryId,
        section: form.section,
        stock: parseInt(form.stock),
        edition: form.edition || null,
        featured: form.featured,
        active: form.active,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? 'Error al crear el producto');
      setLoading(false);
      return;
    }

    const product = await res.json();

    if (showSizes && selectedSizes.length > 0) {
      await Promise.all(
        selectedSizes.map((size, i) =>
          fetch(`${API}/products/${product.id}/attributes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'talla', value: size, sortOrder: i }),
          })
        )
      );
    }

    router.push(`/admin/productos/${product.id}`);
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/productos" className="text-white/30 hover:text-white text-sm transition-colors">
          ← Productos
        </Link>
        <h1 className="text-2xl font-black text-white tracking-wide">Nuevo producto</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field label="Nombre *">
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </Field>

        <Field label="Descripción">
          <textarea
            className={`${inputCls} resize-none h-24`}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Precio (COP) *">
            <input
              type="number" min="0" step="100"
              className={inputCls}
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              required
            />
          </Field>
          <Field label="Stock *">
            <input
              type="number" min="0"
              className={inputCls}
              value={form.stock}
              onChange={(e) => set('stock', e.target.value)}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Categoría *">
            <select
              className={selectCls}
              value={form.categoryId}
              onChange={(e) => set('categoryId', e.target.value)}
              required
            >
              {categories.length === 0 && <option value="">Cargando...</option>}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label ?? c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Sección *">
            <select className={selectCls} value={form.section} onChange={(e) => set('section', e.target.value)}>
              {SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
        </div>

        {showSizes && (
          <Field label="Tallas disponibles">
            <div className="flex flex-wrap gap-2 mt-1">
              {ALL_SIZES.map((size) => {
                const active = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-1.5 text-sm font-bold rounded-sm border transition-all duration-200 ${
                      active
                        ? 'bg-[#ff5c35] border-[#ff5c35] text-white'
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {selectedSizes.length > 0 && (
              <p className="text-xs text-white/30 mt-1">
                Seleccionadas: {selectedSizes.join(', ')}
              </p>
            )}
          </Field>
        )}

        <Field label="Edición (opcional)">
          <input
            className={inputCls}
            placeholder="ej: 01/20"
            value={form.edition}
            onChange={(e) => set('edition', e.target.value)}
          />
        </Field>

        <Field label="Imagen principal">
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-white/50 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:bg-white/10 file:text-white file:text-xs file:cursor-pointer cursor-pointer"
            />
            {uploading && <p className="text-xs text-white/40">Subiendo imagen...</p>}
            {form.imageUrl && (
              <p className="text-xs text-[#ff5c35] font-mono break-all">{form.imageUrl}</p>
            )}
            <input
              className={inputCls}
              placeholder="O pegá la URL manualmente"
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
            />
          </div>
        </Field>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="accent-[#ff5c35] w-4 h-4"
            />
            <span className="text-sm text-white/60">Destacado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set('active', e.target.checked)}
              className="accent-[#ff5c35] w-4 h-4"
            />
            <span className="text-sm text-white/60">Activo</span>
          </label>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || !form.categoryId}
            className="bg-[#ff5c35] text-white font-bold px-6 py-3 text-sm uppercase tracking-widest rounded-sm hover:bg-white hover:text-[#0d0d0d] transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Crear producto'}
          </button>
          <Link
            href="/admin/productos"
            className="px-6 py-3 text-sm text-white/40 hover:text-white transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
