'use client';

import { useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import type { ApiProduct, CategoryDto } from '@/types';

interface FilterOption {
  label: string;
  value: string;
}

function buildFilters(categories: CategoryDto[]): FilterOption[] {
  return [
    { label: 'Todos', value: 'all' },
    ...categories.map((c) => ({ label: c.label ?? c.name, value: c.id })),
  ];
}

interface SectionGridProps {
  products:       ApiProduct[];
  filters:        FilterOption[];
  title:          string;
  subtitle:       string;
  titleHighlight: string;
  id:             string;
}

function SectionGrid({ products, filters, title, subtitle, titleHighlight, id }: SectionGridProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const visible =
    activeFilter === 'all'
      ? products
      : products.filter((p) => p.category.id === activeFilter);

  return (
    <section id={id} className="py-37.5">
      <div className="container">
        <div className="flex justify-between items-end mb-20 max-md:flex-col max-md:items-start max-md:gap-6">
          <div>
            <span className="sub-title">{subtitle}</span>
            <h2>
              {title} <span className="outline-text">{titleHighlight}</span>
            </h2>
          </div>
          {filters.length > 1 && (
            <div className="flex gap-8">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`bg-transparent border-none font-(family-name:--font-main) font-bold text-[0.9rem] uppercase cursor-pointer transition-all duration-500 ${
                    activeFilter === f.value ? 'text-dark' : 'text-[#999] hover:text-dark'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {visible.length > 0 ? (
          <div className="grid grid-cols-12 gap-7.5">
            {visible.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4 border border-white/10 rounded-sm">
            <span className="text-5xl opacity-20">🚀</span>
            <p className="text-white/30 text-xs uppercase tracking-[4px]">Próximamente</p>
          </div>
        )}
      </div>
    </section>
  );
}

interface ShopClientProps {
  products: ApiProduct[];
  meta:     Record<string, CategoryDto[]>;
}

export default function ShopClient({ products, meta }: ShopClientProps) {
  const sublimacion = products.filter((p) => !p.section || p.section === 'SUBLIMACION');
  const zonaGeek    = products.filter((p) => p.section === 'ZONA_GEEK');

  const sublimacionFilters = buildFilters(meta['SUBLIMACION'] ?? []);
  const zonaGeekFilters    = buildFilters(meta['ZONA_GEEK']   ?? []);

  return (
    <>
      <SectionGrid
        id="sublimacion"
        products={sublimacion}
        filters={sublimacionFilters}
        subtitle="Ediciones limitadas"
        title="Nuestros"
        titleHighlight="Diseños"
      />
      <SectionGrid
        id="zona-geek"
        products={zonaGeek}
        filters={zonaGeekFilters}
        subtitle="Coleccionables & Figuras"
        title="Zona"
        titleHighlight="Geek"
      />
    </>
  );
}
