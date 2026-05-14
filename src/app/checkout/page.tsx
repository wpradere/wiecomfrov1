'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/orderService';
import type { ShippingAddressDto } from '@/types';

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes: string;
}

const EMPTY_FORM: FormData = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'CO',
  notes: '',
};

const COUNTRIES = [
  { code: 'AR', label: 'Argentina' },
  { code: 'US', label: 'Estados Unidos' },
  { code: 'MX', label: 'México' },
  { code: 'CL', label: 'Chile' },
  { code: 'UY', label: 'Uruguay' },
  { code: 'BR', label: 'Brasil' },
  { code: 'CO', label: 'Colombia' },
  { code: 'ES', label: 'España' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { state, clearCart } = useCart();
  const { items, sessionId } = state;

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!sessionId) {
      setError('No se pudo identificar tu sesión. Recargá la página.');
      return;
    }
    if (items.length === 0) {
      setError('Tu carrito está vacío.');
      return;
    }

    setLoading(true);
    setError(null);

    const shippingAddress: ShippingAddressDto = {
      street: form.street,
      city: form.city,
      state: form.state || undefined,
      zipCode: form.zipCode || undefined,
      country: form.country,
    };

    try {
      const order = await createOrder({
        sessionId,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone || undefined,
        shippingAddress,
        notes: form.notes || undefined,
      });

      await clearCart();
      router.push(`/confirmacion/${order.orderNumber}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Ocurrió un error al procesar tu orden. Intentá de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && !loading) {
    return (
      <main className="min-h-screen bg-dark text-white flex flex-col items-center justify-center gap-6 px-6">
        <p className="font-heading text-4xl">CARRITO VACÍO</p>
        <p className="text-white/50 text-sm uppercase tracking-widest">
          Agregá productos antes de continuar
        </p>
        <Link
          href="/"
          className="text-accent text-sm uppercase tracking-widest hover:text-white transition-colors"
        >
          ← Volver a la tienda
        </Link>
      </main>
    );
  }

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
        <Link
          href="/"
          className="text-white/40 text-xs uppercase tracking-widest hover:text-white transition-colors"
        >
          ← Seguir comprando
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
        {/* ── Form ── */}
        <section>
          <p className="text-[0.65rem] font-bold uppercase tracking-[3px] text-accent mb-2">
            Paso 1 de 1
          </p>
          <h1 className="font-heading text-5xl mb-10">CHECKOUT</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* Customer info */}
            <fieldset className="flex flex-col gap-5">
              <legend className="text-xs font-bold uppercase tracking-[3px] text-white/50 mb-4">
                Datos del cliente
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label="Nombre completo *"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  placeholder="Ana García"
                />
                <Field
                  label="Email *"
                  name="customerEmail"
                  type="email"
                  value={form.customerEmail}
                  onChange={handleChange}
                  required
                  placeholder="ana@email.com"
                />
              </div>
              <Field
                label="Teléfono"
                name="customerPhone"
                type="tel"
                value={form.customerPhone}
                onChange={handleChange}
                placeholder="+57 300 123 4567"
              />
            </fieldset>

            {/* Shipping address */}
            <fieldset className="flex flex-col gap-5">
              <legend className="text-xs font-bold uppercase tracking-[3px] text-white/50 mb-4">
                Dirección de envío
              </legend>

              <Field
                label="Calle y número *"
                name="street"
                value={form.street}
                onChange={handleChange}
                required
                placeholder="Cra. 7 #32-16, Apto 301"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label="Ciudad *"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Bogotá"
                />
                <Field
                  label="Provincia / Estado"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Cundinamarca"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field
                  label="Código postal"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  placeholder="110111"
                />
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-[2px] text-white/60">
                    País *
                  </label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border border-white/15 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option
                        key={c.code}
                        value={c.code}
                        className="bg-[#111] text-white"
                      >
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Shipping notice */}
            <div className="border border-[#ff5c35]/30 bg-[#ff5c35]/5 rounded-sm px-4 py-4 flex gap-3">
              <span className="text-[#ff5c35] text-lg leading-none mt-0.5">&#8505;</span>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase tracking-widest text-[#ff5c35]">
                  Pago y envío a convenir
                </p>
                <p className="text-xs text-white/60 leading-relaxed">
                  Tras completar este formulario, nos pondremos en contacto contigo por <strong className="text-white/80">WhatsApp</strong> para formalizar el pago y definir el costo de entrega según las variables de tu pedido. Estamos listos para brindarte una atención rápida y personalizada para finalizar tu compra.
                </p>
              </div>
            </div>

            {/* Notes */}
            <fieldset className="flex flex-col gap-5">
              <legend className="text-xs font-bold uppercase tracking-[3px] text-white/50 mb-4">
                Comentarios (opcional)
              </legend>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Instrucciones especiales para el envío..."
                className="bg-white/5 border border-white/15 rounded-sm px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors resize-none"
              />
            </fieldset>

            {/* Error */}
            {error && (
              <div className="border border-red-500/40 bg-red-500/10 rounded-sm px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white font-bold py-5 text-sm uppercase tracking-widest transition-all duration-500 hover:bg-white hover:text-dark rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : `Confirmar orden — $${subtotal.toLocaleString('es-CO')}`}
            </button>
          </form>
        </section>

        {/* ── Order summary ── */}
        <aside className="lg:sticky lg:top-8 self-start">
          <div className="border border-white/10 rounded-sm p-6 flex flex-col gap-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[3px] text-accent">
              Resumen
            </p>

            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 shrink-0 bg-white/5 rounded-sm overflow-hidden">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {item.product.name}
                    </p>
                    {item.product.edition && (
                      <p className="text-[0.6rem] text-accent uppercase tracking-widest">
                        {item.product.edition}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-white/70 shrink-0">
                    ${(item.product.price * item.quantity).toLocaleString('es-CO')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
              <div className="flex justify-between text-sm text-white/60">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>Envío</span>
                <span className="text-[#ff5c35]">Contra entrega</span>
              </div>
              <p className="text-[0.6rem] text-white/30 leading-relaxed -mt-1">
                El costo lo asume el comprador
              </p>
              <div className="flex justify-between items-baseline border-t border-white/10 pt-3 mt-1">
                <span className="text-sm uppercase tracking-widest font-bold">
                  Total
                </span>
                <span className="font-heading text-3xl text-accent">
                  ${subtotal.toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

// ── Field component ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}

function Field({
  label,
  name,
  value,
  onChange,
  required,
  type = 'text',
  placeholder,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-xs font-bold uppercase tracking-[2px] text-white/60"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="bg-white/5 border border-white/15 rounded-sm px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
