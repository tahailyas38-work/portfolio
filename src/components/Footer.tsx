"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/data";

const pages = [
  { label: "My Work", href: "#featured-work" },
  { label: "Side Projects", href: "#side-projects" },
  { label: "Experience", href: "#experience" },
];

const contact = [
  { label: "Email", href: `mailto:${siteConfig.email}` },
  { label: "LinkedIn", href: siteConfig.linkedin },
];

export function Footer() {
  const scrollTo = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="overflow-hidden border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Main footer body */}
        <div className="grid gap-12 pt-16 pb-8 lg:grid-cols-[1fr_auto_auto] lg:gap-24 lg:pt-20 lg:pb-10">

          {/* Brand */}
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-block transition-opacity hover:opacity-60"
              aria-label="Back to top"
            >
              <Image src="/logo-black.png" alt="Taha" width={80} height={20} className="h-5 w-auto" />
            </button>
            <p className="max-w-[220px] text-sm leading-relaxed text-muted">
              Product Designer at Dubizzle Labs — crafting meaningful digital experiences.
            </p>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Available for freelance
            </p>
          </div>

          {/* Pages */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted/60">Pages</p>
            <ul className="space-y-3">
              {pages.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted/60">Get in touch</p>
            <ul className="space-y-3">
              {contact.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Big logo watermark — inside the same max-w-7xl + padding as the content above */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div aria-hidden="true" className="pointer-events-none overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-black.png"
            alt=""
            className="block w-full opacity-[0.065]"
            style={{ height: "auto" }}
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-2 border-t border-border py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">© 2026 {siteConfig.name}</p>
          <p className="text-xs text-muted">Designing thoughtful experiences and building ideas into products.</p>
        </div>
      </div>
    </footer>
  );
}
