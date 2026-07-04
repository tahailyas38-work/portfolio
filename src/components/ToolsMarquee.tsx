"use client";

import { useState } from "react";
import { tools } from "@/lib/data";

const ICON_SIZE = 74; // 1.2× previous 62px

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
      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-full left-1/2 z-10 mb-3 -translate-x-1/2">
          <div className="whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-[12px] font-medium text-background shadow-lg">
            {name}
          </div>
          <div className="mx-auto mt-0.5 h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-foreground" />
        </div>
      )}

      <div className="flex h-[112px] w-[112px] cursor-default items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-md sm:h-[120px] sm:w-[120px]">
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
    <section className="relative mt-0 overflow-hidden py-16 lg:py-20">
      {/* Edge fades */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

      <p className="mb-16 text-center text-sm font-medium text-muted lg:mb-20">
        Design &amp; Development Tools
      </p>

      <div className="relative">
        <div className="animate-drift flex w-max gap-5 px-6 sm:gap-6">
          {items.map((tool, index) => (
            <ToolIcon
              key={`${tool.name}-${index}`}
              name={tool.name}
              icon={tool.icon}
              size={ICON_SIZE}
              delay={index * 0.22}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
