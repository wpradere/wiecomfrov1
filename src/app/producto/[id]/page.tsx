import Link from 'next/link';
import { notFound } from 'next/navigation';
import CartButton from '@/components/layout/CartButton';
import ProductGallery from './ProductGallery';
import AddToCartSection from './AddToCartSection';
import type { ApiProduct } from '@/types';
import { API_URL } from '@/lib/apiUrl';

interface Props {
  params: Promise<{ id: string }>;
}


async function fetchProduct(id: string): Promise<ApiProduct | null> {
  try {
    const res = await fetch(
      `${API_URL}/products/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) notFound();

  const inStock = product.stock > 0;

  return (
    <>
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between bg-dark text-white sticky top-0 z-50">
        <Link
          href="/"
          className="font-heading text-2xl tracking-widest hover:text-accent transition-colors"
        >
          WIIMY<span className="text-accent">.</span>STORE
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/#shop"
            className="text-white/50 text-xs uppercase tracking-widest hover:text-white transition-colors hidden sm:block"
          >
            ← Colección
          </Link>
          <CartButton />
        </div>
      </header>

      <main className="min-h-screen bg-dark text-white">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Galería de imágenes ── */}
          <ProductGallery
            mainImageUrl={product.imageUrl}
            mainAlt={product.name}
            extraImages={product.images ?? []}
          />

          {/* ── Info del producto ── */}
          <div className="flex flex-col gap-6">
            {/* Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              {product.edition && (
                <span className="text-[0.6rem] font-bold uppercase tracking-[3px] text-accent border border-accent/40 px-2.5 py-1 rounded-sm">
                  Ed. {product.edition}
                </span>
              )}
              <span className="text-[0.6rem] font-bold uppercase tracking-[3px] text-white/40 border border-white/15 px-2.5 py-1 rounded-sm">
                {product.category.label ?? product.category.name}
              </span>
              {inStock ? (
                <span className="text-[0.6rem] font-bold uppercase tracking-[3px] text-emerald-400 border border-emerald-400/30 px-2.5 py-1 rounded-sm">
                  Disponible
                </span>
              ) : (
                <span className="text-[0.6rem] font-bold uppercase tracking-[3px] text-red-400 border border-red-400/30 px-2.5 py-1 rounded-sm">
                  Sin stock
                </span>
              )}
            </div>

            {/* Name */}
            <div>
              <h1 className="font-heading text-5xl lg:text-6xl leading-none">
                {product.name.toUpperCase()}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-4xl text-accent">
                ${Number(product.price).toLocaleString('es-CO')}
              </span>
              <span className="text-white/30 text-xs uppercase tracking-widest">COP</span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-white/60 text-sm leading-relaxed border-t border-white/10 pt-6">
                {product.description}
              </p>
            )}

            {/* Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="border-t border-white/10 pt-6">
                <p className="text-[0.6rem] font-bold uppercase tracking-[3px] text-white/40 mb-3">
                  Especificaciones
                </p>
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {product.attributes.map((attr) => (
                      <tr key={attr.id} className="border-b border-white/5 last:border-0">
                        <td className="py-2 pr-4 text-white/40 font-medium whitespace-nowrap w-1/3">
                          {attr.name}
                        </td>
                        <td className="py-2 text-white/80">{attr.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add to cart */}
            <div className="border-t border-white/10 pt-6">
              <AddToCartSection product={product} />
            </div>

            {/* Stock count (subtle) */}
            {inStock && product.stock > 5 && (
              <p className="text-white/25 text-xs">
                {product.stock} unidades disponibles
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
