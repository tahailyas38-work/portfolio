"use client";

import { useEffect, useRef, useState } from "react";

export function MouseGradient() {
  const [pos, setPos] = useState({ x: 50, y: 40 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const parent = ref.current?.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      setPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Sweeping orb A — starts top-left, sweeps right across the hero */}
      <div className="animate-hero-orb-a absolute -left-40 top-[5%] h-[700px] w-[700px] rounded-full bg-blue-400/[0.13] blur-[80px]" />

      {/* Sweeping orb B — starts bottom-right, sweeps left */}
      <div className="animate-hero-orb-b absolute -right-40 bottom-[5%] h-[600px] w-[600px] rounded-full bg-violet-400/[0.11] blur-[80px]" />

      {/* Sweeping orb C — starts center-ish, roams */}
      <div className="animate-hero-orb-c absolute left-[40%] top-[50%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400/[0.07] blur-[80px]" />

      {/* Mouse-following interactive layer */}
      <div
        className="absolute inset-0 transition-[background] duration-500 ease-out"
        style={{
          background: `radial-gradient(700px circle at ${pos.x}% ${pos.y}%, rgba(66,133,244,0.10), transparent 70%)`,
        }}
      />
    </div>
  );
}
