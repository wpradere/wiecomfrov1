'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { label: 'Órdenes',        href: '/admin/ordenes' },
  { label: 'Productos',      href: '/admin/productos' },
  { label: 'Categorías',     href: '/admin/categorias' },
  { label: 'Configuración',  href: '/admin/configuracion' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return <>{children}</>;

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#111] border-r border-white/10 flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/" className="text-lg font-black tracking-[4px] text-white">
            WIIMY<span className="text-[#ff5c35]">.</span>
          </Link>
          <p className="text-[0.6rem] text-white/30 uppercase tracking-[3px] mt-0.5">Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? 'bg-[#ff5c35]/10 text-[#ff5c35]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-left text-sm text-white/30 hover:text-white transition-colors rounded-sm hover:bg-white/5"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
