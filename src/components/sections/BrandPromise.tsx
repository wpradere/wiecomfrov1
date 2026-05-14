const cards = [
  {
    number: '01.',
    title: 'Calidad Estudio',
    description: 'Tintas de alta pigmentación y materiales seleccionados para una durabilidad eterna.',
    highlight: false,
  },
  {
    number: '02.',
    title: 'Geek por Diseño',
    description: 'No solo imprimimos, entendemos la cultura por detrás de cada pixel.',
    highlight: true,
  },
  {
    number: '03.',
    title: 'Envío Global',
    description: 'Tu pieza de colección llega a cualquier rincón del mundo con seguridad.',
    highlight: false,
  },
];

export default function BrandPromise() {
  return (
    <section id="brand-promise" className="bg-dark text-white py-25">
      <div className="container flex justify-between gap-16 max-md:flex-col">
        {cards.map((card) => (
          <div key={card.number} className="flex-1">
            <h3 className={`font-heading text-[2.5rem] mb-6 ${card.highlight ? 'text-accent' : ''}`}>
              {card.number} {card.title}
            </h3>
            <p className="text-sm leading-[1.8] text-[#888]">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
