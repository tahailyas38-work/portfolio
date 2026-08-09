"use client";

import { useState } from "react";
import {
  siteConfig,
  footerPageLinks,
} from "@/lib/data";
import ParticleText from "@/components/ParticleText";
import { ResumeModal } from "@/components/ResumeModal";

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

const iconBtn =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors hover:border-white/30 hover:text-white";

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

export function Footer() {
  const [resumeOpen, setResumeOpen] = useState(false);

  const scrollTo = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="footer" className="overflow-hidden bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="pb-8 pt-16 lg:pb-10 lg:pt-20">
          {/* Brand + nav */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 max-w-2xl space-y-5">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-block transition-opacity hover:opacity-60"
                aria-label="Back to top"
              >
                <span className="font-brand text-[22px] font-semibold leading-none tracking-tight text-white sm:text-[24px]">
                  Taha
                </span>
              </button>
              <nav aria-label="Footer pages">
                <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5 sm:gap-x-6">
                  {footerPageLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollTo(link.href);
                        }}
                        className="text-sm text-white/50 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-3 sm:pt-0.5">
              <p className="text-[13px] font-medium tracking-wide text-white/50">Socials</p>
              <div className="flex items-center gap-2.5">
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={iconBtn}
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
                <span
                  aria-label="Instagram (coming soon)"
                  title="Coming soon"
                  className={`${iconBtn} cursor-default hover:border-white/15 hover:text-white/50`}
                >
                  <InstagramIcon className="h-4 w-4" />
                </span>
                <button
                  type="button"
                  aria-label="Resume"
                  className={iconBtn}
                  onClick={() => setResumeOpen(true)}
                >
                  <ResumeIcon className="h-4 w-4" />
                </button>
                <a
                  href={`mailto:${siteConfig.email}`}
                  aria-label="Email"
                  className={iconBtn}
                >
                  <EmailIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watermark with stickers — full-bleed within page grid */}
      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div
          className="font-brand relative w-full"
          style={{
            containerType: "inline-size",
            height: "min(48cqi, 26rem)",
          }}
        >
          <ParticleText
            text="Taha"
            particleSize={2}
            density={3}
            color="#2a2a2a"
            highlightColor="#363636"
            scatter={160}
            gatherDuration={1600}
            stagger={360}
            pointerRepel={36}
            repelRadius={110}
            idleDrift={0.55}
            trigger="hover"
            fontSize="min(90cqi, 48rem)"
            fontWeight={600}
            fontFamily="inherit"
            glow={false}
            className="!min-h-0"
            style={{ width: "100%", height: "100%", minHeight: 0 }}
          />
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
          <p className="text-xs text-white/25">
            Designing thoughtful experiences and building ideas into products.
          </p>
        </div>
      </div>

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </footer>
  );
}
