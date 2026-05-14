'use client';

import { useEffect, useState } from 'react';

// Module-level: survives React remounts (navigation) but resets on hard reload
let loaderCompleted = false;

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [slideOut, setSlideOut] = useState(false);
  // Initialize hidden from the module flag so client-side navigation skips instantly
  const [hidden, setHidden] = useState(() => loaderCompleted);

  useEffect(() => {
    if (loaderCompleted) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setSlideOut(true), 500);
          setTimeout(() => {
            setHidden(true);
            loaderCompleted = true; // mark AFTER animation finishes, not before
          }, 1600);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 bg-dark text-white z-10000 grid place-items-center transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)]"
      style={{ transform: slideOut ? 'translateY(-100%)' : 'translateY(0)' }}
    >
      <div className="text-center">
        <span className="font-heading text-[5rem] tracking-[5px] block">WIIMY</span>
        <div
          className="h-0.5 bg-accent mt-2.5 transition-[width] duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
