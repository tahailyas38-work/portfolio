"use client";

import React from "react";
import { designPrinciples } from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function PrincipleCard({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: string;
  index: number;
}) {
  return (
    <div
      className="flip-card group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flip-card-inner relative h-full min-h-[180px] rounded-2xl border border-[#e6e6e6] bg-white p-6 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
        <div
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0071e3]/[0.08] text-lg text-[#0071e3] transition-transform duration-300 group-hover:scale-110"
        >
          {icon}
        </div>
        <h3 className="text-[17px] font-bold text-gray-900">{title}</h3>
        <p className="mt-2.5 text-[14px] leading-[1.7] text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export function DesignPrinciples() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="design-principles" className="snap-section py-24 lg:py-32">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="mx-auto max-w-7xl px-6 lg:px-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <p className="section-label mb-4">Design Principles</p>
        <h2 className="text-[2.5rem] font-bold tracking-tight text-gray-900">
          How I think about design
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-[1.75] text-gray-500">
          Core beliefs that guide every project — from enterprise CRMs to consumer products.
        </p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {designPrinciples.map((p, i) => (
            <PrincipleCard key={p.title} {...p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
