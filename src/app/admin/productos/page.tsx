import Link from 'next/link';
import Image from 'next/image';
import type { ApiProduct } from '@/types';
import AdminDeleteButton from './AdminDeleteButton';

async function fetchProducts(): Promise<ApiProduct[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1'}/products`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}


const SECTION_LABEL: Record<string, string> = {
  SUBLIMACION: 'Sublimación',
  ZONA_GEEK: 'Zona Geek',
};

function isValidUrl(url: string | null | undefined) {
  if (!url) return false;
  return url.startsWith('/') || url.startsWith('http');
}

export default async function AdminProductos() {
  const products = await fetchProducts();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">Productos</h1>
          <p className="text-white/40 text-sm mt-1">{products.length} productos en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="bg-[#ff5c35] text-white font-bold px-5 py-2.5 text-sm uppercase tracking-widest rounded-sm hover:bg-white hover:text-[#0d0d0d] transition-colors"
        >
          + Nuevo producto
        </Link>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/10 rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-widest">Imagen</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-widest">Nombre</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-widest">Categoría</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-widest">Sección</th>
              <th className="text-right px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-widest">Precio</th>
              <th className="text-right px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-widest">Stock</th>
              <th className="text-center px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-widest">Activo</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-4 py-3">
                  <div className="relative w-12 h-12 bg-white/5 rounded-sm overflow-hidden shrink-0">
                    {isValidUrl(p.imageUrl) ? (
                      <Image src={p.imageUrl} alt={p.name} fill className="object-contain p-1" sizes="48px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">—</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-white font-medium">{p.name}</span>
                  {p.edition && (
                    <span className="ml-2 text-[#ff5c35] text-xs">Ed. {p.edition}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-white/60">{p.category.label ?? p.category.name}</td>
                <td className="px-4 py-3 text-white/60">{SECTION_LABEL[p.section] ?? p.section ?? '—'}</td>
                <td className="px-4 py-3 text-right text-[#ff5c35] font-bold">
                  ${Number(p.price).toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-3 text-right text-white/60">{p.stock}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block w-2 h-2 rounded-full ${p.active ? 'bg-emerald-400' : 'bg-red-400'}`} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 justify-end">
                    <Link
                      href={`/admin/productos/${p.id}`}
                      className="text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors"
                    >
                      Editar
                    </Link>
                    <AdminDeleteButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-16 text-white/30 text-sm">
            No hay productos. <Link href="/admin/productos/nuevo" className="text-[#ff5c35]">Crear el primero</Link>
          </div>
        )}
      </div>
    </div>
  );
}
