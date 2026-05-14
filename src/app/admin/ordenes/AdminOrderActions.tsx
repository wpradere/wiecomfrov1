'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = '/api/v1';

type OrderStatus =
  | 'PENDING_PAYMENT' | 'PENDING' | 'CONFIRMED'
  | 'PROCESSING' | 'SHIPPED' | 'DELIVERED'
  | 'CANCELLED' | 'REFUNDED';

interface Props {
  orderId: number;
  status: OrderStatus;
}

export default function AdminOrderActions({ orderId, status }: Props) {
  const router = useRouter();
  const [shippingCost, setShippingCost] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  async function changeStatus(next: OrderStatus, extra?: string) {
    setLoading(next);
    try {
      const url = new URL(`${API}/orders/${orderId}/status`);
      url.searchParams.set('status', next);
      if (extra) url.searchParams.set('shippingCost', extra);

      const res = await fetch(url.toString(), { method: 'PATCH' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message ?? 'Error al cambiar el estado');
        return;
      }
      router.refresh();
    } catch {
      alert('No se pudo conectar con el servidor');
    } finally {
      setLoading(null);
    }
  }

  if (status === 'PENDING_PAYMENT') {
    return (
      <div className="flex flex-col gap-2 items-end min-w-40">
        {/* Shipping cost input */}
        <div className="flex items-center gap-1.5 w-full">
          <span className="text-white/30 text-xs">$</span>
          <input
            type="number"
            min="0"
            step="500"
            placeholder="Costo envío"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 text-white text-xs px-2 py-1.5 rounded-sm outline-none focus:border-[#ff5c35] transition-colors placeholder-white/20 w-full"
          />
        </div>

        <button
          onClick={() => {
            if (!shippingCost || Number(shippingCost) <= 0) {
              alert('Ingresá el costo de envío antes de despachar');
              return;
            }
            changeStatus('SHIPPED', shippingCost);
          }}
          disabled={!!loading}
          className="w-full px-3 py-1.5 bg-[#ff5c35] text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white hover:text-[#0d0d0d] transition-colors disabled:opacity-40 whitespace-nowrap"
        >
          {loading === 'SHIPPED' ? 'Despachando...' : 'Despachar'}
        </button>

        <button
          onClick={() => {
            if (confirm('¿Cancelar esta orden?')) changeStatus('CANCELLED');
          }}
          disabled={!!loading}
          className="w-full px-3 py-1.5 text-red-400 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-red-500/10 transition-colors disabled:opacity-40"
        >
          {loading === 'CANCELLED' ? '...' : 'Cancelar'}
        </button>
      </div>
    );
  }

  if (status === 'SHIPPED') {
    return (
      <button
        onClick={() => changeStatus('DELIVERED')}
        disabled={!!loading}
        className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-emerald-500/30 transition-colors disabled:opacity-40 whitespace-nowrap"
      >
        {loading === 'DELIVERED' ? '...' : 'Marcar entregado'}
      </button>
    );
  }

  return null;
}
