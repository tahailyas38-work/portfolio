"use client";

import { useState } from "react";
import { tools } from "@/lib/data";

const ICON_SIZE = 74;

function ToolIcon({
  name,
  icon,
  size,
  delay,
}: {
  name: string;
  icon: string;
  size: number;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="animate-wave relative flex shrink-0 items-center justify-center"
      style={{
        animationDelay: `${delay}s`,
        animationPlayState: hovered ? "paused" : "running",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div className="absolute bottom-full left-1/2 z-10 mb-3 -translate-x-1/2">
          <div className="whitespace-nowrap rounded-lg bg-[#0a0a0a] px-3 py-1.5 text-[12px] font-medium text-white shadow-lg">
            {name}
          </div>
          <div className="mx-auto mt-0.5 h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-[#0a0a0a]" />
        </div>
      )}

      <div className="relative z-[1] flex h-[100px] w-[100px] cursor-default items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-md sm:h-[108px] sm:w-[108px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={icon}
          alt={name}
          width={ICON_SIZE}
          height={ICON_SIZE}
          className="pointer-events-none select-none object-contain"
          style={{ width: size, height: size }}
          draggable={false}
        />
      </div>
    </div>
  );
}

export function ToolsMarquee() {
  const items = [...tools, ...tools, ...tools];

  return (
    <section id="workflow-tools" className="relative overflow-hidden pb-32 pt-16 lg:pb-40 lg:pt-20">
      <p className="relative z-[1] mb-16 text-center text-[13px] font-medium text-muted lg:mb-20 lg:text-sm">
        Design &amp; Development Tools
      </p>

      <div className="relative z-[1]">
        <div className="animate-drift flex w-max gap-5 px-6 sm:gap-6">
          {items.map((tool, index) => (
            <ToolIcon
              key={`${tool.name}-${index}`}
              name={tool.name}
              icon={tool.icon}
              size={tool.name === "Vapi" ? ICON_SIZE * 0.85 : ICON_SIZE}
              delay={index * 0.22}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
