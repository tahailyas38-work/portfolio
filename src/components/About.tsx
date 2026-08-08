"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useCountUp } from "@/hooks/useCountUp";
import { siteConfig } from "@/lib/data";
import { ResumeModal } from "@/components/ResumeModal";

const stats = [
  { label: "Years Experience", value: "3+" },
  { label: "Products Designed", value: "20+" },
  { label: "Tools", value: "17+" },
  { label: "Businesses", value: "5" },
];

const iconBtn =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e6e6] text-gray-500 transition-colors hover:border-[#0071e3]/35 hover:text-[#0071e3]";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function ResumeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-gray-800">{children}</strong>;
}

function StatValue({ value, active }: { value: string; active: boolean }) {
  const display = useCountUp(value, active);
  return <p className="mt-1 text-[28px] font-bold text-gray-900">{display}</p>;
}

function GlassCard({
  statsActive,
  flipDone,
  onOpenResume,
}: {
  statsActive: boolean;
  flipDone: boolean;
  onOpenResume: () => void;
}) {
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

  const scrollToContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scale = pressed ? 0.96 : hovered ? 1.015 : 1;
  const tz = pressed ? "-12px" : "0px";

  const tiltTransform = flipDone
    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${scale}) translateZ(${tz})`
    : undefined;

  const tiltTransition = pressed
    ? "transform 0.12s cubic-bezier(0.34,1.56,0.64,1)"
    : "transform 0.35s cubic-bezier(0.22,1,0.36,1)";

  return (
    <div className="relative" style={{ perspective: "1000px" }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -bottom-8 rounded-[2.5rem] opacity-70 blur-3xl transition-all duration-500"
        style={{
          background: `radial-gradient(ellipse 70% 40% at ${glowPos.x}% 110%, rgba(0,113,227,0.20), transparent 65%)`,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
        style={{
          opacity: hovered ? 0.5 : 0,
          background: `radial-gradient(ellipse 60% 50% at ${glowPos.x}% ${glowPos.y}%, rgba(120,180,255,0.15) 0%, rgba(180,100,255,0.06) 40%, transparent 65%)`,
          mixBlendMode: "screen",
        }}
      />

      <div
        className={flipDone ? "" : "card-flip-enter"}
        style={{
          transform: tiltTransform,
          transition: flipDone ? tiltTransition : undefined,
          transformStyle: "preserve-3d",
        }}
      >
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
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.95) 50%, transparent 90%)" }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
            style={{
              opacity: hovered ? 1 : 0,
              background: `radial-gradient(ellipse 55% 45% at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.22), transparent 70%)`,
            }}
          />

          <div
            className="relative flex items-center gap-4 overflow-hidden p-6"
            style={{ background: "linear-gradient(135deg, rgba(0,113,227,0.10) 0%, rgba(0,113,227,0.05) 100%)" }}
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#0071e3]/[0.08]" />
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ececee] ring-2 ring-white shadow-md">
              <Image
                src="/Avatar.png"
                alt="Taha"
                width={56}
                height={56}
                className="h-[92%] w-[92%] object-contain object-center"
              />
            </span>
            <div className="relative min-w-0">
              <p className="text-[20px] font-bold leading-tight text-gray-900">M. Taha Madni</p>
              <p className="mt-1.5 text-[12px] font-medium leading-snug text-gray-400 sm:text-[13px]">
                Creative Product Design | Entrepreneur
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-[#e6e6e6]">
            {stats.map((s) => (
              <div key={s.label} className="bg-white px-4 py-6 sm:px-6 sm:py-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">{s.label}</p>
                <StatValue value={s.value} active={statsActive} />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#e6e6e6] bg-white px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2">
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={iconBtn}
                onClick={(e) => e.stopPropagation()}
              >
                <LinkedInIcon className="h-3.5 w-3.5" />
              </a>
              <span
                aria-label="Instagram (coming soon)"
                title="Coming soon"
                className={`${iconBtn} cursor-default opacity-55 hover:border-[#e6e6e6] hover:text-gray-500`}
              >
                <InstagramIcon className="h-3.5 w-3.5" />
              </span>
              <button
                type="button"
                aria-label="Resume"
                className={iconBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenResume();
                }}
              >
                <ResumeIcon className="h-3.5 w-3.5" />
              </button>
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Email"
                className={iconBtn}
                onClick={(e) => e.stopPropagation()}
              >
                <EmailIcon className="h-3.5 w-3.5" />
              </a>
            </div>

            <button
              type="button"
              onClick={scrollToContact}
              className="group inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-[#0071e3] transition-opacity hover:opacity-70 sm:text-[14px]"
            >
              Let&apos;s Connect
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
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
  const [resumeOpen, setResumeOpen] = useState(false);

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
    const t = setTimeout(() => setFlipDone(true), 1450);
    return () => clearTimeout(t);
  }, [flipActive]);

  useEffect(() => {
    const el = document.getElementById("about");
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
    <section id="about" ref={sectionRef} className="snap-about overflow-x-hidden py-16 sm:py-20 lg:py-28">
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div
          data-animate
          className="max-w-3xl"
          style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
        >
          <p className="section-label">About Me</p>
          <h2 className="mt-3 text-[1.75rem] font-bold leading-[1.18] tracking-tight text-gray-900 sm:text-[2rem] lg:text-[2.5rem]">
            Turning complexity into clarity.
          </h2>
        </div>

        <div className="mt-10 grid items-center gap-10 sm:mt-12 sm:gap-12 lg:mt-14 lg:grid-cols-[1fr_1.35fr] lg:gap-16 xl:gap-20">
          <div
            data-animate
            style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}
          >
            <GlassCard
              statsActive={statsActive}
              flipDone={flipDone}
              onOpenResume={() => setResumeOpen(true)}
            />
          </div>

          <div
            data-animate
            className="space-y-4 text-[15px] leading-[1.7] text-gray-500 sm:text-[16px] sm:leading-[1.75] lg:leading-[1.8]"
            style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s ease 0.08s, transform 0.5s ease 0.08s" }}
          >
            <p>
              I enjoy figuring out the things that don&apos;t make sense yet — the{" "}
              <Bold>messy workflows, complicated systems, and half-formed ideas</Bold> that
              need to become something people can actually use.
            </p>
            <p>
              For the past <Bold>3+ years</Bold>, I&apos;ve worked across{" "}
              <Bold>enterprise, consumer, and AI products</Bold>, bringing together{" "}
              <Bold>systems thinking, visual craft, and curiosity</Bold> to make technology
              feel simpler. Beyond product design, I&apos;ve explored{" "}
              <Bold>branding, marketing, advertising, and entrepreneurship</Bold> — and{" "}
              <Bold>launched two businesses of my own</Bold>, with three more in the works.
            </p>
            <p>
              That work taught me to look past the interface — to{" "}
              <Bold>products, brands, people, and the bigger story</Bold>. I move between
              strategy and execution: untangling systems, shaping brands, and turning ideas
              into something real.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
