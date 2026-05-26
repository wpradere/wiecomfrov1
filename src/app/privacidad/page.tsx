import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NoiseOverlay from '@/components/ui/NoiseOverlay';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | WIIMY Store',
};

export default function PrivacidadPage() {
  return (
    <>
      <NoiseOverlay />
      <Header />
      <main className="bg-white min-h-screen">
        <div className="container py-20 max-w-3xl">
          <h1 className="font-heading text-6xl mb-2">POLÍTICA DE</h1>
          <h2 className="font-heading text-6xl text-accent mb-12">PRIVACIDAD</h2>

          <div className="space-y-10 text-[#444] text-sm leading-relaxed">

            <Section title="1. Responsable del tratamiento">
              <p>
                Wiimisoft, operador de WIIMY Store (wiimystore.com), es el responsable del
                tratamiento de los datos personales recolectados a través de este sitio web,
                en cumplimiento de la Ley 1581 de 2012 y el Decreto 1074 de 2015 de la
                República de Colombia.
              </p>
            </Section>

            <Section title="2. Datos que recolectamos">
              <p>Al realizar una compra o registrarte, podemos recolectar:</p>
              <ul className="list-disc list-inside mt-3 space-y-1">
                <li>Nombre completo</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Dirección de envío</li>
                <li>Historial de pedidos</li>
              </ul>
            </Section>

            <Section title="3. Finalidad del tratamiento">
              <p>Usamos tus datos exclusivamente para:</p>
              <ul className="list-disc list-inside mt-3 space-y-1">
                <li>Procesar y gestionar tus pedidos</li>
                <li>Enviar confirmaciones y actualizaciones de estado de tu compra</li>
                <li>Coordinar el envío con operadores logísticos</li>
                <li>Enviarte información sobre promociones (solo si das tu consentimiento)</li>
                <li>Cumplir obligaciones legales y fiscales</li>
              </ul>
            </Section>

            <Section title="4. Compartición de datos con terceros">
              <p>
                Tus datos personales solo se comparten con terceros cuando es estrictamente
                necesario para completar el servicio:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1">
                <li>
                  <strong>Operadores logísticos:</strong> nombre, dirección y teléfono para
                  gestionar la entrega
                </li>
                <li>
                  <strong>Pasarelas de pago:</strong> procesan el cobro de forma segura, no
                  compartimos datos de tarjeta
                </li>
              </ul>
              <p className="mt-3">
                No vendemos, alquilamos ni cedemos tus datos a terceros con fines comerciales.
              </p>
            </Section>

            <Section title="5. Seguridad de los datos">
              <p>
                Implementamos medidas técnicas y organizativas para proteger tus datos contra
                acceso no autorizado, pérdida o alteración. Las transmisiones de datos se
                realizan mediante protocolo HTTPS cifrado.
              </p>
            </Section>

            <Section title="6. Derechos del titular (Habeas Data)">
              <p>
                De acuerdo con la Ley 1581 de 2012, tenés derecho a:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1">
                <li>Conocer, actualizar y rectificar tus datos personales</li>
                <li>Solicitar la supresión de tus datos cuando no sean necesarios</li>
                <li>Revocar la autorización de tratamiento en cualquier momento</li>
                <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC)</li>
              </ul>
              <p className="mt-3">
                Para ejercer estos derechos, escribinos a{' '}
                <a href="mailto:storewiimy@gmail.com" className="text-accent hover:underline">
                  storewiimy@gmail.com
                </a>
              </p>
            </Section>

            <Section title="7. Cookies">
              <p>
                Este sitio puede usar cookies técnicas necesarias para el funcionamiento de la
                tienda (carrito de compras, sesión). No usamos cookies de rastreo ni publicidad
                de terceros.
              </p>
            </Section>

            <Section title="8. Retención de datos">
              <p>
                Conservamos tus datos durante el tiempo necesario para cumplir con las
                finalidades descritas y con las obligaciones legales aplicables. Una vez
                cumplido ese período, los datos serán eliminados de forma segura.
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
