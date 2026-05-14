'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import type { ApiProduct } from '@/types';

interface ProductCardProps {
  product: ApiProduct;
  index: number;
}

const colSpanClass = (_index: number) =>
  'col-span-4 max-lg:col-span-6 max-md:col-span-12';

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://');
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const [btnText, setBtnText] = useState('+ ADD');
  const validImage = isValidUrl(product.imageUrl);

  function handleAddToCart() {
    addToCart(product);
    setBtnText('ADDED ✓');
    setTimeout(() => setBtnText('+ ADD'), 1200);
  }

  return (
    <div
      className={`${colSpanClass(index)} mb-12.5 opacity-0 translate-y-5 animate-[cardReveal_0.8s_cubic-bezier(0.19,1,0.22,1)_forwards] group`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Link href={`/producto/${product.id}`} className="block">
        <div className="h-112.5 bg-grey-bg overflow-hidden relative mb-6 rounded-xs">
          {validImage ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-4 transition-transform duration-1200 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.08]"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <span className="text-white/20 text-xs uppercase tracking-widest">Sin imagen</span>
            </div>
          )}
        </div>
        <div className="mb-2">
          {product.edition && (
            <span className="sub-title" style={{ fontSize: '0.6rem', marginBottom: '0.2rem' }}>
              {product.edition}
            </span>
          )}
          <h3 className="text-[1.2rem] font-bold mb-2">{product.name}</h3>
        </div>
      </Link>
      <div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-accent">${product.price.toLocaleString('es-CO')}</span>
          <button
            onClick={handleAddToCart}
            className="bg-transparent border-none font-bold cursor-pointer text-accent font-(family-name:--font-main) text-[0.85rem] transition-all duration-500"
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
}
