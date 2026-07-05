"use client";

import { useRef, useState } from "react";
import { siteConfig } from "@/lib/data";
import { ContactNetwork } from "@/components/ContactNetwork";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${siteConfig.email}`;
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const parallax = (factor: number) => ({
    transform: `translate(${(mouse.x - 50) * factor}px, ${(mouse.y - 50) * factor}px)`,
  });

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div
          ref={containerRef}
          onMouseMove={onMouseMove}
          className="relative overflow-hidden rounded-[1.5rem] bg-[#0a0a0a] px-6 py-10 sm:rounded-[2rem] sm:px-12 sm:py-16 lg:px-16 lg:py-20"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <ContactNetwork mouse={mouse} />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/55 to-transparent"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 transition-transform duration-300 ease-out will-change-transform"
            style={parallax(-0.6)}
          >
            <div className="animate-orb-a h-[320px] w-[320px] rounded-full bg-[#0071e3]/20 blur-[80px]" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-24 transition-transform duration-300 ease-out will-change-transform"
            style={parallax(0.8)}
          >
            <div className="animate-orb-b h-[320px] w-[320px] rounded-full bg-[#0071e3]/10 blur-[80px]" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[12%] top-[18%] transition-transform duration-300 ease-out will-change-transform"
            style={parallax(1.2)}
          >
            <div className="h-[180px] w-[180px] animate-hero-orb-c rounded-full bg-[#ff791b]/[0.07] blur-[60px]" />
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff791b]">
              Let&apos;s Connect
            </p>
            <h2 className="text-[1.75rem] font-bold leading-[1.1] tracking-tight text-white sm:text-[2rem] lg:text-[2.5rem]">
              Let&apos;s build something together.
            </h2>
            <p className="mt-5 text-[13px] leading-[1.8] text-white/60 lg:text-[15px]">
              I&apos;m always open to discussing product ideas, collaborations, or opportunities
              to create meaningful digital experiences.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-gray-900 shadow-lg transition-all hover:bg-white/90 active:scale-95 lg:px-6 lg:py-3 lg:text-[16px]"
              >
                {copied ? "Copied!" : "Email me"}
              </button>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10 active:scale-95 lg:px-6 lg:py-3 lg:text-[16px]"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
