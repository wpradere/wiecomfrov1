'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ApiProduct, CategoryDto, ProductAttributeDto, ProductImageDto } from '@/types';

const API = '/api/v1';

const SECTIONS = [
  { value: 'SUBLIMACION', label: 'Sublimación' },
  { value: 'ZONA_GEEK',   label: 'Zona Geek' },
];

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const inputCls = 'bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-sm text-sm outline-none focus:border-[#ff5c35] transition-colors';
const selectCls = `${inputCls} cursor-pointer`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-white/40">{label}</label>
      {children}
    </div>
  );
}

function isValidUrl(url: string | null | undefined) {
  if (!url) return false;
  return url.startsWith('/') || url.startsWith('http');
}

export default function EditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const [sizeAttrs, setSizeAttrs] = useState<ProductAttributeDto[]>([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', imageUrl: '',
    categoryId: '', section: 'SUBLIMACION',
    stock: '0', edition: '', featured: false, active: true,
  });

  useEffect(() => {
    Promise.all([
      fetch(`${API}/products/${id}`).then((r) => r.json()),
      fetch(`${API}/categories`).then((r) => r.json()),
    ]).then(([p, cats]: [ApiProduct, CategoryDto[]]) => {
      setProduct(p);
      setCategories(cats.filter((c) => c.active));
      setSizeAttrs((p.attributes ?? []).filter((a) => a.name === 'talla'));
      setForm({
        name: p.name,
        description: p.description ?? '',
        price: String(p.price),
        imageUrl: p.imageUrl ?? '',
        categoryId: p.category.id,
        section: p.section ?? 'SUBLIMACION',
        stock: String(p.stock),
        edition: p.edition ?? '',
        featured: p.featured,
        active: p.active,
      });
    });
  }, [id]);

  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const showSizes = selectedCategory?.name === 'CLOTHES' && form.section === 'SUBLIMACION';

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function toggleSize(size: string) {
    const existing = sizeAttrs.find((a) => a.value === size);
    if (existing) {
      await fetch(`${API}/products/${id}/attributes/${existing.id}`, { method: 'DELETE' });
      setSizeAttrs((prev) => prev.filter((a) => a.id !== existing.id));
    } else {
      const res = await fetch(`${API}/products/${id}/attributes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'talla', value: size, sortOrder: sizeAttrs.length }),
      });
      const newAttr: ProductAttributeDto = await res.json();
      setSizeAttrs((prev) => [...prev, newAttr]);
    }
  }

  async function handleMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

  async function handleSave(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch(`${API}/products/${id}`, {
      method: 'PUT',
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
      setError(data.message ?? 'Error al guardar');
    }
    setLoading(false);
  }

  async function handleAddImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingExtra(true);
    const fd = new FormData();
    fd.append('file', file);
    const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const { url } = await uploadRes.json();
    if (!url) { setUploadingExtra(false); return; }

    const nextOrder = (product?.images?.length ?? 0);
    await fetch(`${API}/products/${id}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: url, altText: '', description: '', sortOrder: nextOrder }),
    });

    const updated = await fetch(`${API}/products/${id}`).then((r) => r.json());
    setProduct(updated);
    setUploadingExtra(false);
    e.target.value = '';
  }

  async function handleDeleteImage(imageId: string) {
    if (!confirm('¿Eliminar esta imagen?')) return;
    await fetch(`${API}/products/${id}/images/${imageId}`, { method: 'DELETE' });
    const updated = await fetch(`${API}/products/${id}`).then((r) => r.json());
    setProduct(updated);
  }

  if (!product) {
    return <div className="p-8 text-white/40 text-sm">Cargando...</div>;
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/productos" className="text-white/30 hover:text-white text-sm transition-colors">
          ← Productos
        </Link>
        <h1 className="text-2xl font-black text-white tracking-wide truncate">{product.name}</h1>
      </div>

      {/* ── Datos del producto ── */}
      <form onSubmit={handleSave} className="flex flex-col gap-5 mb-12">
        <Field label="Nombre *">
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </Field>

        <Field label="Descripción">
          <textarea className={`${inputCls} resize-none h-24`} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Precio (COP) *">
            <input type="number" min="0" step="100" className={inputCls} value={form.price} onChange={(e) => set('price', e.target.value)} required />
          </Field>
          <Field label="Stock *">
            <input type="number" min="0" className={inputCls} value={form.stock} onChange={(e) => set('stock', e.target.value)} required />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Categoría *">
            <select className={selectCls} value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} required>
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
                const active = sizeAttrs.some((a) => a.value === size);
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
            {sizeAttrs.length > 0 && (
              <p className="text-xs text-white/30 mt-1">
                Seleccionadas: {ALL_SIZES.filter((s) => sizeAttrs.some((a) => a.value === s)).join(', ')}
              </p>
            )}
          </Field>
        )}

        <Field label="Edición">
          <input className={inputCls} placeholder="ej: 01/20" value={form.edition} onChange={(e) => set('edition', e.target.value)} />
        </Field>

        <Field label="Imagen principal">
          <div className="flex flex-col gap-2">
            {isValidUrl(form.imageUrl) && (
              <div className="relative w-24 h-24 bg-white/5 rounded-sm overflow-hidden">
                <Image src={form.imageUrl} alt={form.name} fill className="object-contain p-2" sizes="96px" unoptimized={form.imageUrl.startsWith('/')} />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleMainImageUpload}
              className="text-white/50 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:bg-white/10 file:text-white file:text-xs file:cursor-pointer cursor-pointer" />
            {uploading && <p className="text-xs text-white/40">Subiendo...</p>}
            <input className={inputCls} placeholder="O pegá la URL" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
          </div>
        </Field>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="accent-[#ff5c35] w-4 h-4" />
            <span className="text-sm text-white/60">Destacado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="accent-[#ff5c35] w-4 h-4" />
            <span className="text-sm text-white/60">Activo</span>
          </label>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button type="submit" disabled={loading}
          className="bg-[#ff5c35] text-white font-bold px-6 py-3 text-sm uppercase tracking-widest rounded-sm hover:bg-white hover:text-[#0d0d0d] transition-colors disabled:opacity-50 self-start">
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      {/* ── Galería de imágenes ── */}
      <div className="border-t border-white/10 pt-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white tracking-wide">Galería de imágenes</h2>
          <label className="bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-sm cursor-pointer hover:bg-white/20 transition-colors uppercase tracking-widest">
            {uploadingExtra ? 'Subiendo...' : '+ Agregar imagen'}
            <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} disabled={uploadingExtra} />
          </label>
        </div>

        {product.images && product.images.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {product.images.map((img: ProductImageDto) => (
              <div key={img.id} className="relative group bg-white/5 rounded-sm overflow-hidden aspect-square">
                {isValidUrl(img.imageUrl) && (
                  <Image src={img.imageUrl} alt={img.altText ?? ''} fill className="object-contain p-2" sizes="200px" unoptimized={img.imageUrl.startsWith('/')} />
                )}
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-1 right-1 bg-black/60 text-white/60 hover:text-red-400 w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/30 text-sm">No hay imágenes adicionales.</p>
        )}
      </div>
    </div>
  );
}
