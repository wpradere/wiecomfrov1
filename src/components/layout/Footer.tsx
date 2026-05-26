import Link from 'next/link';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer id="main-footer" className="pt-[100px] pb-[50px] bg-white">
      <div className="container flex justify-between items-start mb-20 max-lg:flex-col max-lg:gap-16">
        <div className="font-heading text-[10rem] leading-[0.8] max-lg:text-[5rem]">
          NEXT
          <br />
          LEVEL
        </div>
        <div className="flex gap-24 max-md:flex-col max-md:gap-12">
          <div>
            <h4 className="mb-8 text-[0.8rem] uppercase font-bold">Navegación</h4>
            <ul className="list-none space-y-2">
              <li><Link href="/terminos" className="text-[#666] text-sm transition-all duration-500 hover:text-accent">Términos</Link></li>
              <li><Link href="/privacidad" className="text-[#666] text-sm transition-all duration-500 hover:text-accent">Privacidad</Link></li>
              <li><Link href="/faq" className="text-[#666] text-sm transition-all duration-500 hover:text-accent">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-8 text-[0.8rem] uppercase font-bold">Newsletter</h4>
            <p className="text-sm text-[#666] mb-4">Únete para acceso exclusivo a nuevos drops.</p>
            <NewsletterForm />
          </div>
        </div>
      </div>
      <div className="border-t border-grey-border pt-[50px]">
        <div className="container flex justify-between text-[0.8rem] font-bold">
          <span>© 2026 Wiimisoft · One More Step · Todos los derechos reservados</span>
          <div className="flex gap-8">
            <a href="#" className="text-black">IG</a>
            <a href="#" className="text-black">TW</a>
            <a href="#" className="text-black">TK</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
