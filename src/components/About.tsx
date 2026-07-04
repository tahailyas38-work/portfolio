"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const focusAreas = [
  "Enterprise Systems",
  "Mobile Experiences",
  "AI Workflows",
  "Design Systems",
];

const stats = [
  { label: "Years Experience", value: "3+" },
  { label: "Companies",        value: "2"  },
  { label: "Products Designed", value: "20+" },
  { label: "Tools",            value: "17" },
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [avatarHovered, setAvatarHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll<HTMLElement>("[data-animate]").forEach((child, i) => {
            setTimeout(() => {
              child.style.opacity = "1";
              child.style.transform = "translateY(0)";
            }, i * 90);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about-section" className="py-24 lg:py-32">
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-24">

          {/* ── Left card ─────────────────────────────────── */}
          <div
            data-animate
            className="flex flex-col overflow-hidden rounded-3xl border border-[#e6e6e6] bg-white shadow-sm"
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}
          >
            {/* Identity header */}
            <div
              className="relative flex items-center gap-4 overflow-hidden p-6"
              style={{ backgroundColor: "#f5f9ff" }}
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#0071e3]/[0.07]" />
              <div className="absolute -right-2 -top-2 h-14 w-14 rounded-full bg-[#0071e3]/[0.05]" />

              <div
                className="relative shrink-0 cursor-default"
                onMouseEnter={() => setAvatarHovered(true)}
                onMouseLeave={() => setAvatarHovered(false)}
              >
                <Image
                  src="/profile-avatar.png"
                  alt="Taha"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover object-top transition-all duration-500"
                  style={{
                    boxShadow: avatarHovered
                      ? "0 0 0 3px #0071e3, 0 0 0 6px rgba(0,113,227,0.2)"
                      : "0 0 0 3px white",
                  }}
                />
              </div>

              <div className="relative">
                <p className="text-[20px] font-bold leading-tight text-gray-900">Muhammad Taha Madni</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <p className="text-[14px] font-medium text-gray-400">Available for work</p>
                </div>
              </div>
            </div>

            {/* 2×2 stat grid — label + value format matching Company row */}
            <div className="grid grid-cols-2 gap-px bg-[#e6e6e6]">
              {stats.map((s) => (
                <div key={s.label} className="bg-white px-6 py-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    {s.label}
                  </p>
                  <p className="mt-1 text-[28px] font-bold text-gray-900">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Bottom row — "Currently working in   Dubizzle Labs" */}
            <div className="flex items-center gap-2 border-t border-[#e6e6e6] px-5 py-4">
              <span className="text-[14px] text-gray-400">Currently working in</span>
              <a
                href="https://www.dubizzlelabs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[14px] text-gray-400 underline-offset-2 transition-colors hover:text-gray-600 hover:underline"
              >
                <Image src="/dubizzle-labs-logo.png" alt="" width={14} height={14} className="h-[14px] w-auto shrink-0 opacity-60" />
                Dubizzle Labs
              </a>
            </div>
          </div>

          {/* ── Right content — Law of Proximity grouping ── */}
          <div>
            {/* Label tight to heading — they're one unit */}
            <p
              data-animate
              className="section-label"
              style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
            >
              About
            </p>

            {/* x = 16px: heading belongs to the label */}
            <h2
              data-animate
              className="mt-3 text-[2.5rem] font-bold leading-[1.18] tracking-tight text-gray-900"
              style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s ease 0.08s, transform 0.5s ease 0.08s" }}
            >
              Turning complexity into experiences people actually enjoy using.
            </h2>

            {/* Group 1 → Description: x = 20px */}
            <p
              data-animate
              className="mt-5 text-[15px] leading-[1.85] text-gray-500"
              style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s ease 0.16s, transform 0.5s ease 0.16s" }}
            >
              I enjoy turning complex systems into experiences that feel simple and intuitive.
              My work spans enterprise platforms, consumer products, and scalable workflows
              designed for thousands of users.
            </p>

            {/* Group 2 → Pills: x + 4 = 24px — static, no hover colour change */}
            <div
              data-animate
              className="mt-6 flex flex-wrap gap-2"
              style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s ease 0.24s, transform 0.5s ease 0.24s" }}
            >
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="cursor-default rounded-full border border-[#e6e6e6] px-4 py-1.5 text-[13px] font-medium text-gray-500"
                >
                  {area}
                </span>
              ))}
            </div>

            {/* CTA: x + 12 = 32px — most breathing room, arrow points down */}
            <div className="mt-8">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white shadow-md shadow-[#0071e3]/20 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-[#0071e3]/30"
                style={{ backgroundColor: "#0071e3" }}
              >
                Let&apos;s Connect
                {/* Arrow pointing down — scrolls user downward */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
