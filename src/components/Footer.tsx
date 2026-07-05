"use client";

import { useRef, useState } from "react";
import { siteConfig } from "@/lib/data";
import { ResumeModal } from "@/components/ResumeModal";

const pages = [
  { label: "About", href: "#about-section" },
  { label: "Case Studies", href: "#featured-work" },
  { label: "Side Projects", href: "#side-projects" },
];

const contactLinks = [
  { label: "Email", href: `mailto:${siteConfig.email}` },
  { label: "LinkedIn", href: siteConfig.linkedin },
];

const stickers = [
  { text: "PRODUCT DESIGN", bg: "#0071e3", color: "#fff", rotate: "-3deg", top: "22%", left: "6%" },
  { text: "✦ UX/UI", bg: "#ff791b", color: "#fff", rotate: "2.5deg", top: "52%", left: "38%" },
  { text: "2026", bg: "transparent", color: "rgba(255,255,255,0.35)", rotate: "-1.5deg", top: "25%", right: "8%", border: "1.5px solid rgba(255,255,255,0.2)" },
] as const;

const mobileStickers = [
  { text: "PRODUCT DESIGN", bg: "#0071e3", color: "#fff", rotate: "-3deg", top: "14%", left: "4%" },
  { text: "✦ UX/UI", bg: "#ff791b", color: "#fff", rotate: "2.5deg", top: "42%", left: "32%" },
  { text: "2026", bg: "transparent", color: "rgba(255,255,255,0.35)", rotate: "-1.5deg", top: "18%", right: "5%", border: "1.5px solid rgba(255,255,255,0.2)" },
] as const;

export function Footer() {
  const watermarkRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [resumeOpen, setResumeOpen] = useState(false);

  const scrollTo = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = watermarkRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    setOffset({ x, y });
  };

  const onMouseLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <>
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />

      <footer className="overflow-hidden bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 pb-8 pt-16 lg:grid-cols-[1fr_auto_auto] lg:gap-24 lg:pb-10 lg:pt-20">

            {/* Brand */}
            <div className="space-y-5">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-block transition-opacity hover:opacity-60"
                aria-label="Back to top"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-white.png" alt="Taha" className="h-5 w-auto" />
              </button>
              <p className="max-w-[220px] text-[13px] leading-relaxed text-white/40 lg:text-sm">
                Product Designer at Dubizzle Labs — crafting meaningful digital experiences.
              </p>
            </div>

            {/* Pages */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/30">Pages</p>
              <ul className="space-y-3">
                {pages.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                      className="text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/30">Get in touch</p>
              <ul className="space-y-3">
                {contactLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => setResumeOpen(true)}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    Resume
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Watermark with stickers + shimmer */}
        <div
          ref={watermarkRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className="relative mx-auto max-w-7xl px-6 lg:px-10"
        >
          {/* Logo image */}
          <div aria-hidden="true" className="pointer-events-none relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-white.png"
              alt=""
              className="block w-full opacity-[0.06] transition-transform duration-300 ease-out"
              style={{ height: "auto", transform: `translate(${offset.x}px, ${offset.y}px)` }}
            />
            {/* Light streak — moves left to right on a loop */}
            <div className="logo-shimmer-streak" />
          </div>

          {mobileStickers.map((s, i) => (
            <div
              key={`mobile-${i}`}
              aria-hidden="true"
              className="pointer-events-none absolute px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] sm:hidden"
              style={{
                background: s.bg,
                color: s.color,
                border: "border" in s ? s.border : undefined,
                borderRadius: 6,
                transform: `rotate(${s.rotate})`,
                top: s.top,
                left: "left" in s ? s.left : undefined,
                right: "right" in s ? s.right : undefined,
              }}
            >
              {s.text}
            </div>
          ))}

          {stickers.map((s, i) => (
            <div
              key={i}
              aria-hidden="true"
              className="pointer-events-none absolute hidden px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] sm:block"
              style={{
                background: s.bg,
                color: s.color,
                border: "border" in s ? s.border : undefined,
                borderRadius: 8,
                transform: `rotate(${s.rotate})`,
                top: s.top,
                left: "left" in s ? s.left : undefined,
                right: "right" in s ? s.right : undefined,
              }}
            >
              {s.text}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col gap-2 border-t border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/25">© 2026 {siteConfig.name}</p>
            <p className="text-xs text-white/25">Designing thoughtful experiences and building ideas into products.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
