"use client";

import { useRef, useState } from "react";
import { beyondDesign } from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function BeyondDesign() {
  const { ref, visible } = useScrollReveal();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  return (
    <section id="beyond-design" className="snap-section py-24 lg:py-32">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="mx-auto max-w-7xl px-6 lg:px-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <p className="section-label mb-4">Beyond Design</p>
        <h2 className="text-[2.5rem] font-bold tracking-tight text-gray-900">
          What I do outside work
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-[1.75] text-gray-500">
          The curiosity and energy that keeps my design thinking fresh.
        </p>

        <div
          ref={containerRef}
          onMouseMove={onMouseMove}
          className="relative mt-14 flex min-h-[200px] flex-wrap items-center justify-center gap-4 lg:gap-6"
        >
          {beyondDesign.map((item, i) => (
            <div
              key={item.label}
              className="group cursor-default rounded-2xl border border-[#e6e6e6] bg-white px-5 py-4 shadow-sm transition-all duration-300 hover:border-[#0071e3]/30 hover:shadow-lg hover:shadow-[#0071e3]/5"
              style={{
                transform: `translate(${mouse.x * (i % 2 === 0 ? 0.3 : -0.3)}px, ${mouse.y * (i % 2 === 0 ? 0.2 : -0.2)}px)`,
                transition: "transform 0.2s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
              }}
            >
              <span className="mr-2 text-lg">{item.emoji}</span>
              <span className="text-[14px] font-medium text-gray-700 group-hover:text-gray-900">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
