export default function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999] opacity-[0.04]"
      style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
    />
  );
}
