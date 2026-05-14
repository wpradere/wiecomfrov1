import ShopClient from './ShopClient';
import { getProducts } from '@/services/productService';
import type { CategoryDto } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function getMeta(): Promise<Record<string, CategoryDto[]>> {
  try {
    const res = await fetch(`${API}/products/meta`, { cache: 'no-store' });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export default async function Shop() {
  let products = [];
  let meta: Record<string, CategoryDto[]> = {};

  try {
    [products, meta] = await Promise.all([getProducts(), getMeta()]);
  } catch {
    return (
      <section id="shop" className="py-37.5">
        <div className="container">
          <p className="text-center text-accent py-20">
            No se pudo conectar al servidor. Verificá que el backend esté corriendo en puerto 8080.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div id="shop">
      <ShopClient products={products} meta={meta} />
    </div>
  );
}
