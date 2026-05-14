import AdminOrderActions from './AdminOrderActions';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

type OrderStatus =
  | 'PENDING_PAYMENT' | 'PENDING' | 'CONFIRMED'
  | 'PROCESSING' | 'SHIPPED' | 'DELIVERED'
  | 'CANCELLED' | 'REFUNDED';

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface AdminOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string | null;
  shippingZipCode: string | null;
  createdAt: string;
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pendiente de pago',
  PENDING:         'Pendiente',
  CONFIRMED:       'Confirmado',
  PROCESSING:      'En proceso',
  SHIPPED:         'Despachado',
  DELIVERED:       'Entregado',
  CANCELLED:       'Cancelado',
  REFUNDED:        'Reembolsado',
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  PENDING:         'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
  CONFIRMED:       'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  PROCESSING:      'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  SHIPPED:         'bg-[#ff5c35]/15 text-[#ff5c35] border border-[#ff5c35]/30',
  DELIVERED:       'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  CANCELLED:       'bg-red-500/15 text-red-400 border border-red-500/30',
  REFUNDED:        'bg-white/10 text-white/50 border border-white/20',
};

async function fetchOrders(status?: string): Promise<AdminOrder[]> {
  try {
    const url = status
      ? `${API}/orders/status/${status}?size=100`
      : `${API}/orders?size=100`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.content ?? [];
  } catch {
    return [];
  }
}

const FILTERS: { label: string; value: string | undefined }[] = [
  { label: 'Pendientes de pago', value: 'PENDING_PAYMENT' },
  { label: 'Despachados',        value: 'SHIPPED' },
  { label: 'Entregados',         value: 'DELIVERED' },
  { label: 'Cancelados',         value: 'CANCELLED' },
  { label: 'Todos',              value: undefined },
];

export default async function AdminOrdenes({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status ?? 'PENDING_PAYMENT';
  const orders = await fetchOrders(activeStatus === 'ALL' ? undefined : activeStatus);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-wide">Órdenes</h1>
        <p className="text-white/40 text-sm mt-1">{orders.length} órdenes</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => {
          const val = f.value ?? 'ALL';
          const isActive = activeStatus === val;
          return (
            <a
              key={val}
              href={`/admin/ordenes?status=${val}`}
              className={`px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors ${
                isActive
                  ? 'bg-[#ff5c35] text-white'
                  : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
              }`}
            >
              {f.label}
            </a>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/10 rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-widest">Orden</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-widest">Cliente</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-widest">Productos</th>
              <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-widest">Ciudad</th>
              <th className="text-right px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-widest">Total</th>
              <th className="text-center px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-widest">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-4">
                  <p className="text-[#ff5c35] font-mono text-xs font-bold">{order.orderNumber}</p>
                  <p className="text-white/30 text-xs mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('es-CO', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-white font-medium text-sm">{order.customerName}</p>
                  <p className="text-white/40 text-xs">{order.customerEmail}</p>
                  {order.customerPhone && (
                    <p className="text-white/40 text-xs">{order.customerPhone}</p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <ul className="flex flex-col gap-0.5">
                    {order.items.map((item, i) => (
                      <li key={i} className="text-xs text-white/70">
                        <span className="text-white/30">{item.quantity}×</span> {item.productName}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-4 text-white/60 text-sm">
                  {order.shippingCity}
                  {order.shippingState && <span className="text-white/30">, {order.shippingState}</span>}
                </td>
                <td className="px-4 py-4 text-right font-bold text-[#ff5c35]">
                  ${Number(order.total).toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-block px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide ${STATUS_COLOR[order.status]}`}>
                    {STATUS_LABEL[order.status]}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <AdminOrderActions orderId={order.id} status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-16 text-white/30 text-sm">
            No hay órdenes en este estado.
          </div>
        )}
      </div>
    </div>
  );
}
