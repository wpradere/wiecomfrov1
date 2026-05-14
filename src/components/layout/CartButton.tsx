'use client';

import { useCart } from '@/context/CartContext';

export default function CartButton() {
  const { state, toggleCart } = useCart();

  return (
    <button
      id="cart-btn"
      onClick={toggleCart}
      className="border border-grey-border rounded-full px-5 py-2.5 font-bold text-xs cursor-pointer transition-all duration-500 hover:bg-dark hover:text-white"
    >
      Cart (<span>{state.count}</span>)
    </button>
  );
}
