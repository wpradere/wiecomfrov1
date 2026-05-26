import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NoiseOverlay from '@/components/ui/NoiseOverlay';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | WIIMY Store',
};

export default function FaqPage() {
  return (
    <>
      <NoiseOverlay />
      <Header />
      <main className="bg-white min-h-screen">
        <div className="container py-20 max-w-3xl">
          <h1 className="font-heading text-6xl mb-2">PREGUNTAS</h1>
          <h2 className="font-heading text-6xl text-accent mb-12">FRECUENTES</h2>

          <div className="space-y-6 text-[#444] text-sm leading-relaxed">

            <Item question="¿Cómo hago un pedido?">
              <p>
                Navegá por nuestra tienda, seleccioná el producto que te interesa, elegí la
                talla o variante disponible y hacé clic en "Agregar al carrito". Cuando estés
                listo, completá el proceso de pago ingresando tus datos de envío y seleccionando
                el método de pago.
              </p>
            </Item>

            <Item question="¿Cuáles son los métodos de pago aceptados?">
              <p>
                Aceptamos los medios de pago habilitados en nuestra plataforma: tarjetas de
                crédito y débito, transferencias bancarias y otros métodos disponibles según
                tu ubicación. El procesamiento es seguro y WIIMY Store no almacena datos de
                tarjetas.
              </p>
            </Item>

            <Item question="¿Cuánto tarda en llegar mi pedido?">
              <p>Los tiempos estimados de entrega son:</p>
              <ul className="list-disc list-inside mt-3 space-y-1">
                <li>Bogotá y ciudades principales: 2 a 4 días hábiles</li>
                <li>Resto del país: 4 a 8 días hábiles</li>
              </ul>
              <p className="mt-3">
                Estos tiempos son aproximados y pueden variar por condiciones externas o
                períodos de alta demanda.
              </p>
            </Item>

            <Item question="¿Hacen envíos a todo Colombia?">
              <p>
                Sí. Realizamos envíos a todo el territorio colombiano a través de operadores
                logísticos aliados.
              </p>
            </Item>

            <Item question="¿Puedo personalizar un producto con mi propio diseño?">
              <p>
                Por el momento trabajamos con nuestro catálogo de diseños propios. Si tenés
                alguna idea o consulta especial, escribinos a{' '}
                <a href="mailto:storewiimy@gmail.com" className="text-accent hover:underline">
                  storewiimy@gmail.com
                </a>{' '}
                y lo evaluamos.
              </p>
            </Item>

            <Item question="¿Qué hago si mi producto llegó con defectos?">
              <p>
                Aceptamos devoluciones dentro de los 5 días hábiles siguientes a la recepción
                del producto cuando presenta defectos de fabricación o no corresponde a lo
                solicitado. Escribinos a{' '}
                <a href="mailto:storewiimy@gmail.com" className="text-accent hover:underline">
                  storewiimy@gmail.com
                </a>{' '}
                con el número de orden y una foto del producto.
              </p>
            </Item>

            <Item question="¿Las ediciones limitadas se reponen?">
              <p>
                No. Las ediciones limitadas tienen disponibilidad restringida y no se garantiza
                su reposición una vez agotadas. Te recomendamos seguirnos en redes para enterarte
                de nuevos drops antes que nadie.
              </p>
            </Item>

            <Item question="¿Cómo puedo saber el estado de mi pedido?">
              <p>
                Una vez confirmado el pago, recibirás un correo con tu número de orden. Ante
                cualquier consulta sobre el estado de tu envío, contactanos a{' '}
                <a href="mailto:storewiimy@gmail.com" className="text-accent hover:underline">
                  storewiimy@gmail.com
                </a>{' '}
                indicando tu número de orden.
              </p>
            </Item>

            <Item question="¿Cómo puedo contactarlos?">
              <p>
                Por correo electrónico a{' '}
                <a href="mailto:storewiimy@gmail.com" className="text-accent hover:underline">
                  storewiimy@gmail.com
                </a>
                . Respondemos en el menor tiempo posible en días hábiles.
              </p>
            </Item>

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

function Item({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 pb-6">
      <h3 className="font-bold text-[#111] text-base mb-3">{question}</h3>
      {children}
    </div>
  );
}
