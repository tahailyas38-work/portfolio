"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/data";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${siteConfig.email}`;
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0a0a0a] px-8 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">

          {/* Dot grid texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Animated blue orbs */}
          <div aria-hidden="true" className="animate-orb-a absolute -left-48 -top-40 h-[500px] w-[500px] rounded-full bg-[#0071e3]/30 blur-[80px]" />
          <div aria-hidden="true" className="animate-orb-b absolute -bottom-40 -right-48 h-[560px] w-[560px] rounded-full bg-[#0071e3]/20 blur-[80px]" />
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0071e3]/10 blur-[60px]" />

          <div className="relative z-10 max-w-xl">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff791b]">
              Let&apos;s Connect
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Let&apos;s build something together.
            </h2>

            <p className="mt-5 text-base leading-[1.8] text-white/60 sm:text-lg">
              I&apos;m always open to discussing product ideas, collaborations, or opportunities
              to create meaningful digital experiences.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-white/90 active:scale-95"
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M2 4a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M2 5l6 4.5L14 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    Email me
                  </>
                )}
              </button>

              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/8 active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
