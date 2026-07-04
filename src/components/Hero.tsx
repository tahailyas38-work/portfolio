"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const BEFORE = "Hey, I'm ";
const AFTER = " Taha.";
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

export function Hero({ splashDone }: { splashDone: boolean }) {
  const [started, setStarted] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [showCTAs, setShowCTAs] = useState(false);

  useEffect(() => {
    if (!splashDone) return;
    const t0 = setTimeout(() => setStarted(true), 80);
    const t1 = setTimeout(() => setShowSub(true), 820);
    const t2 = setTimeout(() => setShowCTAs(true), 1080);
    return () => [t0, t1, t2].forEach(clearTimeout);
  }, [splashDone]);

  const beforeChars = BEFORE.split("");
  const afterChars = AFTER.split("");
  const avatarDelay = beforeChars.length * CHAR_STAGGER;
  const afterDelay = avatarDelay + 180;

  return (
    <section
      id="about"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-0 text-center lg:px-8"
    >
      {/* Animated blue orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-hero-orb-a absolute -left-40 top-[5%] h-[600px] w-[600px] rounded-full bg-[#0071e3]/[0.08] blur-[90px]" />
        <div className="animate-hero-orb-b absolute -right-40 bottom-[5%] h-[500px] w-[500px] rounded-full bg-[#0071e3]/[0.06] blur-[90px]" />
        <div className="animate-hero-orb-c absolute left-[40%] top-[50%] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0071e3]/[0.04] blur-[80px]" />
      </div>

      {/* Dot grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.25]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,113,227,0.10) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Main heading — letter by letter */}
        <h1 className="text-[2.75rem] font-bold leading-[1.06] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.25rem]">
          {started ? (
            <>
              {beforeChars.map((char, i) => (
                <Char key={`b${i}`} char={char} delay={i * CHAR_STAGGER} />
              ))}
              <span
                className="relative mx-2 inline-flex align-middle sm:mx-4"
                style={{
                  opacity: 0,
                  animation: "char-in 0.45s ease forwards",
                  animationDelay: `${avatarDelay}ms`,
                }}
              >
                <Image
                  src="/profile-avatar.png"
                  alt="Taha"
                  width={160}
                  height={160}
                  className="inline-block h-20 w-20 rounded-full border-[3px] border-white object-cover object-top shadow-xl sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-[9rem] lg:w-[9rem] xl:h-[10rem] xl:w-[10rem]"
                  priority
                />
              </span>
              {afterChars.map((char, i) => (
                <Char key={`a${i}`} char={char} delay={afterDelay + i * CHAR_STAGGER} />
              ))}
            </>
          ) : (
            <span style={{ opacity: 0 }} aria-hidden="true">
              Hey, I&apos;m Taha.
            </span>
          )}
        </h1>

        {/* Subtitle — single line */}
        <p
          className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-[1.6] text-gray-500 sm:text-xl"
          style={{
            opacity: showSub ? 1 : 0,
            transform: showSub ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          A Product Designer at Dubizzle Labs focused on creating intuitive experiences
          across enterprise systems, mobile products, and scalable design solutions.
        </p>

        {/* CTAs */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{
            opacity: showCTAs ? 1 : 0,
            transform: showCTAs ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <a
            href="#featured-work"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#featured-work")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-semibold text-white shadow-md shadow-[#0071e3]/25 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-[#0071e3]/30"
            style={{ backgroundColor: "#0071e3" }}
          >
            Explore My Work
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 3V13M8 13L4 9M8 13L12 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-7 py-3.5 text-[14px] font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
          >
            Let&apos;s Connect
          </a>
        </div>
      </div>

      {/* Fade into next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-white via-white/60 to-transparent"
      />
    </section>
  );
}
