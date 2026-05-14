import Link from 'next/link';
import type { OrderResponse } from '@/types';

interface Props {
  params: Promise<{ orderNumber: string }>;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PROCESSING: 'En proceso',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

async function fetchOrder(orderNumber: string): Promise<OrderResponse | null> {
  try {
    const res = await fetch(
      `http://localhost:8080/api/v1/orders/number/${orderNumber}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ConfirmacionPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await fetchOrder(orderNumber);

  if (!order) {
    return (
      <main className="min-h-screen bg-dark text-white flex flex-col items-center justify-center gap-6 px-6">
        <p className="font-heading text-5xl text-accent">¡LISTO!</p>
        <p className="font-heading text-3xl">ORDEN #{orderNumber}</p>
        <p className="text-white/50 text-sm uppercase tracking-widest text-center max-w-sm">
          Tu orden fue recibida. Te llegará un email con los detalles.
        </p>
        <Link
          href="/"
          className="mt-4 text-accent text-sm uppercase tracking-widest hover:text-white transition-colors"
        >
          ← Volver a la tienda
        </Link>
      </main>
    );
  }

  const shippingCountryName =
    order.shippingCountry === 'AR'
      ? 'Argentina'
      : order.shippingCountry === 'US'
      ? 'Estados Unidos'
      : order.shippingCountry;

  return (
    <main className="min-h-screen bg-dark text-white">
      {/* Top bar */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-2xl tracking-widest hover:text-accent transition-colors"
        >
          WIIMY
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-10">
        {/* Success header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-accent flex items-center justify-center text-2xl text-accent">
            ✓
          </div>
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[3px] text-accent">
              Orden confirmada
            </p>
            <h1 className="font-heading text-5xl mt-1">{order.orderNumber}</h1>
          </div>
          <p className="text-white/50 text-sm max-w-sm text-center leading-relaxed">
            Gracias, {order.customerName.split(' ')[0]}. Recibiste un resumen en{' '}
            <span className="text-white">{order.customerEmail}</span>.
          </p>
        </div>

        {/* Order items */}
        <div className="border border-white/10 rounded-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
            <p className="text-xs font-bold uppercase tracking-[3px] text-white/50">
              Productos
            </p>
            <span className="text-xs text-white/40">
              Estado:{' '}
              <span className="text-accent font-bold">
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {order.items.map((item) => (
              <div
                key={item.itemId}
                className="px-6 py-4 flex justify-between items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{item.productName}</p>
                  <p className="text-xs text-white/40">
                    {item.quantity} × ${Number(item.unitPrice).toLocaleString('es-CO')}
                  </p>
                </div>
                <span className="text-sm font-bold text-accent shrink-0">
                  ${Number(item.subtotal).toLocaleString('es-CO')}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-6 py-4 border-t border-white/10 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-white/50">
              <span>Subtotal</span>
              <span>${Number(order.subtotal).toLocaleString('es-CO')}</span>
            </div>
            {Number(order.shippingCost) > 0 && (
              <div className="flex justify-between text-sm text-white/50">
                <span>Envío</span>
                <span>${Number(order.shippingCost).toLocaleString('es-CO')}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline border-t border-white/10 pt-2 mt-1">
              <span className="text-sm font-bold uppercase tracking-widest">
                Total
              </span>
              <span className="font-heading text-3xl text-accent">
                ${Number(order.total).toLocaleString('es-CO')}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping info */}
        <div className="border border-white/10 rounded-sm p-6 flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-[3px] text-white/50">
            Dirección de entrega
          </p>
          <address className="not-italic text-sm text-white/80 leading-relaxed">
            {order.shippingStreet}
            <br />
            {order.shippingCity}
            {order.shippingState && `, ${order.shippingState}`}
            {order.shippingZipCode && ` (${order.shippingZipCode})`}
            <br />
            {shippingCountryName}
          </address>
          {order.notes && (
            <p className="text-xs text-white/40 italic mt-1">
              &ldquo;{order.notes}&rdquo;
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-accent text-white font-bold py-4 px-10 text-sm uppercase tracking-widest transition-all duration-500 hover:bg-white hover:text-dark rounded-sm"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
}
