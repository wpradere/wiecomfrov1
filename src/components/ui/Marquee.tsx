const TEXT = 'EDICIONES LIMITADAS • ENVÍO GRATIS DESDE $70MIL • NUEVOS DISEÑOS CADA MES • ';

export default function Marquee() {
  return (
    <div className="bg-dark text-white py-2.5 text-xs font-bold whitespace-nowrap overflow-hidden flex">
      <span className="inline-block pl-[100%] animate-[marquee_20s_linear_infinite]">{TEXT}</span>
      <span className="inline-block pl-[100%] animate-[marquee_20s_linear_infinite]">{TEXT}</span>
    </div>
  );
}
