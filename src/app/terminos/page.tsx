import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NoiseOverlay from '@/components/ui/NoiseOverlay';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | WIIMY Store',
};

export default function TerminosPage() {
  return (
    <>
      <NoiseOverlay />
      <Header />
      <main className="bg-white min-h-screen">
        <div className="container py-20 max-w-3xl">
          <h1 className="font-heading text-6xl mb-2">TÉRMINOS</h1>
          <h2 className="font-heading text-6xl text-accent mb-12">Y CONDICIONES</h2>

          <div className="space-y-10 text-[#444] text-sm leading-relaxed">

            <Section title="1. Aceptación de los términos">
              <p>
                Al realizar una compra en WIIMY Store (wiimystore.com), aceptás los presentes
                términos y condiciones. Si no estás de acuerdo con alguno de ellos, te pedimos
                que no realices ninguna transacción en nuestro sitio.
              </p>
            </Section>

            <Section title="2. Productos y precios">
              <p>
                Todos los precios están expresados en pesos colombianos (COP) e incluyen IVA
                cuando aplica. WIIMY Store se reserva el derecho de modificar precios sin previo
                aviso. Las ediciones limitadas tienen disponibilidad restringida y no se garantiza
                su reposición una vez agotadas.
              </p>
            </Section>

            <Section title="3. Proceso de compra">
              <p>
                Para completar una compra debés proporcionar información verídica de contacto y
                envío. Una vez confirmado el pago, recibirás un correo electrónico con el número
                de orden. WIIMY Store se reserva el derecho de cancelar pedidos en caso de
                detectar información incorrecta o fraudulenta.
              </p>
            </Section>

            <Section title="4. Métodos de pago">
              <p>
                Aceptamos pagos a través de los medios habilitados en nuestra plataforma.
                El procesamiento del pago es responsabilidad exclusiva del proveedor de pagos
                seleccionado. WIIMY Store no almacena datos de tarjetas de crédito o débito.
              </p>
            </Section>

            <Section title="5. Envíos y tiempos de entrega">
              <p>
                Realizamos envíos a todo Colombia a través de operadores logísticos aliados.
                Los tiempos estimados de entrega son:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1">
                <li>Bogotá y ciudades principales: 2 a 4 días hábiles</li>
                <li>Resto del país: 4 a 8 días hábiles</li>
              </ul>
              <p className="mt-3">
                Estos tiempos son estimados y pueden variar por condiciones externas.
                WIIMY Store no se responsabiliza por demoras causadas por la empresa de transporte.
              </p>
            </Section>

            <Section title="6. Devoluciones y garantías">
              <p>
                Aceptamos devoluciones dentro de los 5 días hábiles siguientes a la recepción
                del producto, siempre que este presente defectos de fabricación o no corresponda
                a lo solicitado. Los productos personalizados no tienen derecho a devolución
                salvo defecto de fábrica.
              </p>
              <p className="mt-3">
                Para iniciar un proceso de devolución, contactanos por correo electrónico
                indicando el número de orden y una descripción del problema.
              </p>
            </Section>

            <Section title="7. Propiedad intelectual">
              <p>
                Todos los diseños, imágenes y contenidos publicados en WIIMY Store son propiedad
                de Wiimisoft o cuentan con las licencias correspondientes. Queda prohibida su
                reproducción, distribución o uso comercial sin autorización expresa.
              </p>
            </Section>

            <Section title="8. Modificaciones">
              <p>
                WIIMY Store puede actualizar estos términos en cualquier momento. Los cambios
                entrarán en vigencia desde su publicación en el sitio. Te recomendamos revisar
                esta página periódicamente.
              </p>
            </Section>

            <p className="text-xs text-[#999] pt-4 border-t border-gray-100">
              Última actualización: Mayo 2026 · Wiimisoft · Colombia
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-bold text-[#111] text-base mb-3">{title}</h3>
      {children}
    </div>
  );
}
