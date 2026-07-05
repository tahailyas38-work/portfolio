"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useCountUp } from "@/hooks/useCountUp";


const stats = [
  { label: "Years Experience", value: "3+" },
  { label: "Companies", value: "2" },
  { label: "Products Designed", value: "20+" },
  { label: "Tools", value: "17" },
];

function StatValue({ value, active }: { value: string; active: boolean }) {
  const display = useCountUp(value, active);
  return <p className="mt-1 text-[28px] font-bold text-gray-900">{display}</p>;
}

function GlassCard({ statsActive, flipDone }: { statsActive: boolean; flipDone: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [pressed, setPressed] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (pressed || !flipDone) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (0.5 - y) * 16, y: (x - 0.5) * 16 });
    setGlowPos({ x: x * 100, y: y * 100 });
  }, [pressed, flipDone]);

  const onPointerLeave = useCallback(() => {
    if (pressed) return;
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, [pressed]);

  const onPointerEnter = useCallback(() => { if (flipDone) setHovered(true); }, [flipDone]);

  const onPointerDown = useCallback(() => {
    if (!flipDone) return;
    setPressed(true);
    setTilt({ x: 3, y: 0 });
  }, [flipDone]);

  const onPointerUp = useCallback(() => {
    setPressed(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const scale = pressed ? 0.96 : hovered ? 1.015 : 1;
  const tz = pressed ? "-12px" : "0px";

  // Tilt only applies once the flip animation is done
  const tiltTransform = flipDone
    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${scale}) translateZ(${tz})`
    : undefined;

  const tiltTransition = pressed
    ? "transform 0.12s cubic-bezier(0.34,1.56,0.64,1)"
    : "transform 0.35s cubic-bezier(0.22,1,0.36,1)";

  return (
    <div className="relative" style={{ perspective: "1000px" }}>
      {/* Ground glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -bottom-8 rounded-[2.5rem] opacity-70 blur-3xl transition-all duration-500"
        style={{
          background: `radial-gradient(ellipse 70% 40% at ${glowPos.x}% 110%, rgba(0,113,227,0.20), transparent 65%)`,
        }}
      />

      {/* Iridescent shimmer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
        style={{
          opacity: hovered ? 0.5 : 0,
          background: `radial-gradient(ellipse 60% 50% at ${glowPos.x}% ${glowPos.y}%, rgba(120,180,255,0.15) 0%, rgba(180,100,255,0.06) 40%, transparent 65%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* Card wrapper — holds the 360° flip animation */}
      <div
        className={flipDone ? "" : "card-flip-enter"}
        style={{
          transform: tiltTransform,
          transition: flipDone ? tiltTransition : undefined,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Card face */}
        <div
          ref={cardRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onPointerEnter={onPointerEnter}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          className="relative cursor-grab overflow-hidden rounded-3xl active:cursor-grabbing"
          style={{
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(24px) saturate(1.5)",
            WebkitBackdropFilter: "blur(24px) saturate(1.5)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: hovered
              ? "0 28px 56px rgba(0,113,227,0.10), 0 6px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)"
              : "0 8px 32px rgba(0,113,227,0.06), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)",
          }}
        >
          {/* Top specular highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.95) 50%, transparent 90%)" }}
          />

          {/* Moving shine on hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
            style={{
              opacity: hovered ? 1 : 0,
              background: `radial-gradient(ellipse 55% 45% at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.22), transparent 70%)`,
            }}
          />

          {/* Header — stronger blue tint */}
          <div
            className="relative flex items-center gap-4 overflow-hidden p-6"
            style={{ background: "linear-gradient(135deg, rgba(0,113,227,0.10) 0%, rgba(0,113,227,0.05) 100%)" }}
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#0071e3]/[0.08]" />
            <Image
              src="/profile-avatar.png"
              alt="Taha"
              width={56}
              height={56}
              className="relative h-14 w-14 rounded-full object-cover object-top ring-2 ring-white shadow-md"
            />
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

          {/* Stats grid — pure white cells */}
          <div className="grid grid-cols-2 gap-px bg-[#e6e6e6]">
            {stats.map((s) => (
              <div key={s.label} className="bg-white px-4 py-6 sm:px-6 sm:py-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">{s.label}</p>
                <StatValue value={s.value} active={statsActive} />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-[#e6e6e6] bg-white px-4 py-4 sm:px-5">
            <span className="text-[14px] text-gray-400">Currently working at</span>
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
      </div>
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [statsActive, setStatsActive] = useState(false);
  const [flipDone, setFlipDone] = useState(false);
  const [flipActive, setFlipActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
          setFlipActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!flipActive) return;
    // Animation takes 1.4s; mark done after it completes
    const t = setTimeout(() => setFlipDone(true), 1450);
    return () => clearTimeout(t);
  }, [flipActive]);

  useEffect(() => {
    const el = document.getElementById("about-section");
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about-section" ref={sectionRef} className="snap-about overflow-x-hidden py-16 sm:py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
          <div
            data-animate
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}
          >
            <GlassCard statsActive={statsActive} flipDone={flipDone} />
          </div>

          <div className="flex flex-col justify-center">
            <p
              data-animate
              className="section-label"
              style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
            >
              About
            </p>
            <h2
              data-animate
              className="mt-3 text-[1.75rem] font-bold leading-[1.18] tracking-tight text-gray-900 sm:text-[2rem] lg:text-[2.5rem]"
              style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s ease 0.08s, transform 0.5s ease 0.08s" }}
            >
              Turning complexity into intuitive experiences.
            </h2>
            <p
              data-animate
              className="mt-5 text-[13px] leading-[1.75] text-gray-500 lg:text-[15px] lg:leading-[1.85]"
              style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s ease 0.16s, transform 0.5s ease 0.16s" }}
            >
              I enjoy turning complex systems into experiences that feel simple and intuitive.
              My work spans enterprise platforms, consumer products, and scalable workflows
              designed for thousands of users.
            </p>
            <div
              data-animate
              className="mt-8"
              style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s ease 0.24s, transform 0.5s ease 0.24s" }}
            >
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center rounded-full px-6 py-3 text-[14px] font-semibold text-white shadow-md shadow-[#0071e3]/20 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-[#0071e3]/30 lg:text-[16px]"
                style={{ backgroundColor: "#0071e3" }}
              >
                Let&apos;s Connect
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
