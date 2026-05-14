'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/types';

export default function CartDrawer() {
  const { state, closeCart, removeFromCart, updateQty, clearCart } = useCart();
  const { items, isOpen } = state;

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-900 backdrop-blur-[2px]"
          onClick={closeCart}
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-105 max-w-full bg-dark text-white z-950 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[3px] text-accent">
              Tu carrito
            </p>
            <h3 className="font-heading text-3xl leading-none mt-1">
              {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'}
            </h3>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full text-lg hover:border-white transition-colors duration-300"
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <span className="text-6xl opacity-20">🛒</span>
              <p className="text-white/50 text-sm uppercase tracking-widest">
                Tu carrito está vacío
              </p>
            </div>
          ) : (
            items.map((item: CartItem) => (
              <div key={item.cartItemId} className="flex gap-4">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 shrink-0 bg-white/5 rounded-sm overflow-hidden">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {item.product.edition && (
                      <span className="text-[0.6rem] font-bold uppercase tracking-[2px] text-accent">
                        {item.product.edition}
                      </span>
                    )}
                    <p className="text-sm font-bold leading-tight mt-0.5">
                      {item.product.name}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    {/* Qty controls */}
                    <div className="flex items-center gap-3 border border-white/20 rounded-full px-3 py-1">
                      <button
                        onClick={() =>
                          item.quantity === 1
                            ? removeFromCart(item.cartItemId)
                            : updateQty(item.cartItemId, item.quantity - 1)
                        }
                        className="text-white/60 hover:text-white transition-colors text-sm w-4 text-center"
                      >
                        −
                      </button>
                      <span className="text-sm font-bold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(item.cartItemId, item.quantity + 1)
                        }
                        className="text-white/60 hover:text-white transition-colors text-sm w-4 text-center"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal line */}
                    <span className="text-sm font-bold text-accent">
                      ${(item.product.price * item.quantity).toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="text-white/30 hover:text-white transition-colors text-xs self-start mt-1"
                  aria-label="Eliminar"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-white/10 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm uppercase tracking-widest">
                Subtotal
              </span>
              <span className="font-heading text-3xl text-accent">
                ${subtotal.toLocaleString('es-CO')}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-accent text-white font-bold py-4 text-sm uppercase tracking-widest transition-all duration-500 hover:bg-white hover:text-dark rounded-sm text-center block"
            >
              Ir al checkout →
            </Link>
            <button
              onClick={clearCart}
              className="w-full text-white/40 text-xs uppercase tracking-widest hover:text-white transition-colors py-1"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
