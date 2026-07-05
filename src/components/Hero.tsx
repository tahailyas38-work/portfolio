"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HeroScene } from "@/components/HeroScene";

const BEFORE = "HEY, I'M ";
const AFTER = " TAHA.";
const CHAR_STAGGER = 42;

function Char({ char, delay }: { char: string; delay: number }) {
  return (
    <span
      className="inline-block"
      style={{
        opacity: 0,
        animation: "char-in 0.35s ease forwards",
        animationDelay: `${delay}ms`,
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  );
}

function InteractiveAvatar() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });

  const onMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -14, y: dx * 14, scale: 1.06 });
  };

  const onMouseLeave = () => setTilt({ x: 0, y: 0, scale: 1 });
  const onMouseDown = () => setTilt((t) => ({ ...t, scale: 0.94 }));
  const onMouseUp = () => setTilt((t) => ({ ...t, scale: 1.06 }));

  return (
    <span
      ref={containerRef}
      className="relative mx-2 inline-flex cursor-pointer align-middle sm:mx-4"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={{
        opacity: 0,
        animation: "char-in 0.45s ease forwards",
        animationDelay: `${BEFORE.split("").length * CHAR_STAGGER}ms`,
      }}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 0 3px rgba(0,113,227,${0.2 + Math.abs(tilt.y) * 0.015}), 0 8px 32px rgba(0,113,227,${0.15 + Math.abs(tilt.y) * 0.01})`,
          transition: "box-shadow 0.15s ease",
        }}
      />
      <Image
        src="/profile-avatar.png"
        alt="Taha"
        width={160}
        height={160}
        className="inline-block rounded-full border-[3px] border-white object-cover object-top shadow-xl h-16 w-16 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-[9rem] lg:w-[9rem] xl:h-[10rem] xl:w-[10rem]"
        style={{
          transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`,
          transition: "transform 0.15s cubic-bezier(0.22,1,0.36,1)",
        }}
        priority
      />
    </span>
  );
}

export function Hero({
  splashDone,
  onReady,
}: {
  splashDone: boolean;
  onReady?: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [showCTAs, setShowCTAs] = useState(false);
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    if (!splashDone) return;
    document.documentElement.classList.add("scroll-locked");

    const t0 = setTimeout(() => setStarted(true), 100);
    const t1 = setTimeout(() => setShowSub(true), 900);
    const t2 = setTimeout(() => setShowCTAs(true), 1200);
    const t3 = setTimeout(() => setShowBackground(true), 1600);
    const t4 = setTimeout(() => {
      document.documentElement.classList.remove("scroll-locked");
      onReady?.();
    }, 2600);

    return () => {
      [t0, t1, t2, t3, t4].forEach(clearTimeout);
      document.documentElement.classList.remove("scroll-locked");
    };
  }, [splashDone, onReady]);

  const beforeChars = BEFORE.split("");
  const afterChars = AFTER.split("");
  const afterDelay = beforeChars.length * CHAR_STAGGER + 180;

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="snap-section-hero relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center lg:px-8"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 ${showBackground ? "hero-bg-enter" : "opacity-0"}`}
      >
        <div className="animate-hero-orb-a absolute -left-40 top-[5%] h-[600px] w-[600px] rounded-full bg-[#0071e3]/[0.08] blur-[90px]" />
        <div className="animate-hero-orb-b absolute -right-40 bottom-[5%] h-[500px] w-[500px] rounded-full bg-[#0071e3]/[0.06] blur-[90px]" />
        <div className="animate-hero-orb-c absolute left-[40%] top-[50%] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0071e3]/[0.04] blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,113,227,0.10) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {showBackground && <HeroScene />}

      <div className="relative z-10 mx-auto max-w-5xl pt-[72px]">
        <h1
          className="text-[2.25rem] font-extrabold uppercase leading-[1.06] tracking-[-0.01em] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.25rem]"
          style={{ fontFamily: "var(--font-display, inherit)" }}
        >
          {started ? (
            <>
              {beforeChars.map((char, i) => (
                <Char key={`b${i}`} char={char} delay={i * CHAR_STAGGER} />
              ))}
              <InteractiveAvatar />
              {afterChars.map((char, i) => (
                <Char key={`a${i}`} char={char} delay={afterDelay + i * CHAR_STAGGER} />
              ))}
            </>
          ) : (
            <span style={{ opacity: 0 }} aria-hidden="true">
              HEY, I&apos;M TAHA.
            </span>
          )}
        </h1>

        <p
          className="mx-auto mt-7 max-w-2xl text-[14px] font-medium leading-[1.65] text-gray-500 lg:text-lg xl:text-xl"
          style={{
            opacity: showSub ? 1 : 0,
            transform: showSub ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          A Product Designer at Dubizzle Labs focused on creating intuitive experiences
          across enterprise systems, mobile products, and scalable design solutions.
        </p>

        {/* Primary: Let's Connect | Secondary: Explore My Work */}
        <div
          className="mt-10 flex flex-row flex-nowrap items-center justify-center gap-2 lg:flex-wrap lg:gap-3"
          style={{
            opacity: showCTAs ? 1 : 0,
            transform: showCTAs ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
            className="inline-flex shrink-0 items-center rounded-full px-4 py-2.5 text-[14px] font-semibold text-white shadow-md shadow-[#0071e3]/25 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-[#0071e3]/30 lg:px-7 lg:py-3.5 lg:text-[16px]"
            style={{ backgroundColor: "#0071e3" }}
          >
            Let&apos;s Connect
          </a>
          <a
            href="#featured-work"
            onClick={(e) => { e.preventDefault(); scrollTo("#featured-work"); }}
            className="inline-flex shrink-0 items-center rounded-full border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md lg:px-7 lg:py-3.5 lg:text-[16px]"
          >
            Explore My Work
          </a>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-white via-white/60 to-transparent"
      />
    </section>
  );
}
