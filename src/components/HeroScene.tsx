"use client";

import { useEffect, useRef, useState } from "react";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const parallax = (factor: number) => ({
    transform: `translate(${mouse.x * factor}px, ${mouse.y * factor}px)`,
  });

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Connection nodes */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.12]" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <line x1="120" y1="180" x2="320" y2="240" stroke="#0071e3" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="320" y1="240" x2="520" y2="200" stroke="#0071e3" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="520" y1="200" x2="680" y2="320" stroke="#0071e3" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="320" y1="240" x2="400" y2="380" stroke="#0071e3" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="120" cy="180" r="4" fill="#0071e3" opacity="0.5" />
        <circle cx="320" cy="240" r="5" fill="#0071e3" opacity="0.6" />
        <circle cx="520" cy="200" r="4" fill="#0071e3" opacity="0.5" />
        <circle cx="680" cy="320" r="4" fill="#0071e3" opacity="0.4" />
        <circle cx="400" cy="380" r="4" fill="#0071e3" opacity="0.5" />
      </svg>

      {/* Floating UI layer — back */}
      <div
        className="animate-float-a absolute right-[8%] top-[18%] hidden sm:block"
        style={{ ...parallax(8), transformStyle: "preserve-3d" }}
      >
        <div className="w-44 rounded-xl border border-[#e6e6e6]/80 bg-white/70 p-3 shadow-lg backdrop-blur-sm lg:w-52">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#0071e3]/60" />
            <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-gray-100" />
            <div className="h-1.5 w-3/4 rounded-full bg-gray-100" />
            <div className="h-1.5 w-1/2 rounded-full bg-gray-100" />
          </div>
        </div>
      </div>

      {/* Floating UI layer — middle */}
      <div
        className="animate-float-b absolute left-[6%] top-[32%] hidden md:block"
        style={{ ...parallax(14), transformStyle: "preserve-3d" }}
      >
        <div className="w-36 rounded-xl border border-[#e6e6e6]/80 bg-white/80 p-3 shadow-xl backdrop-blur-md lg:w-44">
          <div className="mb-3 flex gap-1.5">
            <div className="h-6 flex-1 rounded-lg bg-[#0071e3]/10" />
            <div className="h-6 w-6 rounded-lg bg-gray-100" />
          </div>
          <div className="rounded-lg border border-[#e6e6e6] bg-white p-2">
            <div className="h-1.5 w-full rounded-full bg-gray-200" />
            <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-gray-100" />
          </div>
        </div>
      </div>

      {/* Floating UI layer — front */}
      <div
        className="animate-float-c absolute bottom-[22%] right-[14%] hidden lg:block"
        style={{ ...parallax(20), transformStyle: "preserve-3d" }}
      >
        <div className="w-48 rounded-2xl border border-[#e6e6e6]/60 bg-white/90 p-4 shadow-2xl backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div className="h-2 w-16 rounded-full bg-gray-200" />
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[8px] text-emerald-600">●</div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-lg bg-[#0071e3]/[0.06]" />
            ))}
          </div>
          <div className="mt-3 h-7 rounded-full bg-[#0071e3]/10" />
        </div>
      </div>

      {/* Workflow node pill */}
      <div
        className="animate-float-b absolute left-[18%] bottom-[28%] hidden lg:block"
        style={{ ...parallax(10), animationDelay: "1.2s" }}
      >
        <div className="rounded-full border border-[#0071e3]/20 bg-white/60 px-3 py-1.5 text-[11px] font-medium text-[#0071e3]/70 shadow-sm backdrop-blur-sm">
          Workflow → Screen
        </div>
      </div>
    </div>
  );
}
