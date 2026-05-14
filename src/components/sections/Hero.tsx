'use client';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[calc(100vh-140px)] flex items-center py-12.5 overflow-hidden">
      
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0 scale-[1.02]"
      >
        <source src="/videos/videoFinal.mp4" type="video/mp4" />
      </video>


<div className="w-full relative z-10 px-[5vw] flex flex-col gap-12">
        {/* Main content */}
        <div className="max-w-3xl flex flex-col justify-center drop-shadow-md">
          <h1>
            GEEK
            <br />
            CULTURE
            <br />
            <span className="accent-text">STORE.</span>
          </h1>
          <p className="text-[1.5rem] max-w-100 mb-12 leading-relaxed bg-white/35 p-4 rounded-md backdrop-blur-sm mt-4 font-medium">
            Elevamos la sublimación a otro nivel. Excelentes diseños impresos con
            precisión atómica.
          </p>
        </div>

        <div className="flex">
          <a
            href="#shop"
            className="btn-color-cycle px-12 py-6 font-bold rounded-sm hover:scale-105 hover:opacity-90"
          >
            Descubre nuestro Universo
          </a>
        </div>
      </div>
    </section>
  );
}
