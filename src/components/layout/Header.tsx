import Marquee from '@/components/ui/Marquee';
import CartButton from './CartButton';

export default function Header() {
  return (
    <header id="main-header" className="border-b border-grey-border relative z-100">
      <Marquee />
      <nav className="container flex justify-between items-center h-22.5">
        <div className="font-heading text-[2.2rem] tracking-wide">
          WIIMY<span className="text-accent">.</span>STORE
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex list-none gap-8">
            <li>
              <a
                href="#shop"
                className="font-bold text-[0.8rem] uppercase relative after:content-[''] after:absolute after:-bottom-1.25 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-500 hover:after:w-full"
              >
                Colección
              </a>
            </li>
            <li>
              <a
                href="#"
                className="font-bold text-[0.8rem] uppercase relative after:content-[''] after:absolute after:-bottom-1.25 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-500 hover:after:w-full"
              >
                Drops
              </a>
            </li>
            <li>
              <a
                href="#"
                className="font-bold text-[0.8rem] uppercase relative after:content-[''] after:absolute after:-bottom-1.25 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-500 hover:after:w-full"
              >
                Estudio
              </a>
            </li>
          </ul>
          <div className="flex gap-6">
            <button className="bg-transparent border border-grey-border px-5 py-2.5 rounded-full font-(family-name:--font-main) font-bold text-[0.75rem] cursor-pointer transition-all duration-500">
              Buscar
            </button>
            <CartButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
