'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import type { ApiProduct } from '@/types';

interface Props {
  product: ApiProduct;
}

export default function AddToCartSection({ product }: Props) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock === 0;
  const maxQty = Math.min(product.stock, 10);

  async function handleAdd() {
    if (outOfStock) return;
    for (let i = 0; i < qty; i++) {
      await addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stock indicator */}
      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
          ¡Solo quedan {product.stock}!
        </p>
      )}
      {outOfStock && (
        <p className="text-xs font-bold uppercase tracking-widest text-red-400">
          Sin stock
        </p>
      )}

      <div className="flex items-center gap-4">
        {/* Quantity selector */}
        {!outOfStock && (
          <div className="flex items-center gap-3 border border-white/20 rounded-full px-4 py-2.5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="text-white/60 hover:text-white transition-colors text-sm w-4 text-center"
            >
              −
            </button>
            <span className="text-sm font-bold w-4 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              className="text-white/60 hover:text-white transition-colors text-sm w-4 text-center"
            >
              +
            </button>
          </div>
        )}

        {/* Add to cart button */}
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="flex-1 bg-accent text-white font-bold py-3 text-sm uppercase tracking-widest rounded-sm transition-all duration-500 hover:bg-white hover:text-dark disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {added ? 'Agregado ✓' : outOfStock ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
