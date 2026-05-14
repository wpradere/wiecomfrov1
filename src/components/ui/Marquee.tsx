const TEXT = 'LIMITED DROP • FREE SHIPPING ON ORDERS OVER $100 • NEW DESIGNS EVERY WEEK • ';

export default function Marquee() {
  return (
    <div className="bg-dark text-white py-2.5 text-xs font-bold whitespace-nowrap overflow-hidden flex">
      <span className="inline-block pl-[100%] animate-[marquee_20s_linear_infinite]">{TEXT}</span>
      <span className="inline-block pl-[100%] animate-[marquee_20s_linear_infinite]">{TEXT}</span>
    </div>
  );
}
