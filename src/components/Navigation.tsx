"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { navLinks } from "@/lib/data";

export function Navigation({ visible = true }: { visible?: boolean }) {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const detect = () => {
      const scrollY = window.scrollY + 100;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => { detect(); ticking.current = false; });
        ticking.current = true;
      }
    };
    detect();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-[#e6e6e6] bg-white/96"
      style={{
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-6px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        pointerEvents: visible ? "all" : "none",
      }}
    >
      {/* Inner content aligned with max-w-7xl page sections */}
      <div className="mx-auto flex h-[72px] max-w-7xl items-stretch justify-between px-6 lg:px-10">

        {/* Logo */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="flex items-center transition-opacity hover:opacity-60"
        >
          <Image src="/logo-black.png" alt="Taha" width={80} height={20} className="h-[18px] w-auto" priority />
        </button>

        {/* Desktop nav + CTA */}
        <div className="hidden items-stretch gap-1 md:flex">
          {navLinks.map((link) => {
            const id = link.href.slice(1);
            const isActive = activeId === id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="relative flex items-center px-4 text-[14px] transition-colors"
                style={{ color: isActive ? "#0a0a0a" : "#6b7280" }}
              >
                <span className={isActive ? "font-semibold" : "font-medium"}>
                  {link.label}
                </span>
                <span
                  className="absolute inset-x-4 bottom-0 h-[2px] rounded-full transition-opacity duration-200"
                  style={{ opacity: isActive ? 1 : 0, backgroundColor: "#0071e3" }}
                />
              </a>
            );
          })}

          <div className="my-4 mx-3 w-px bg-[#e6e6e6]" />

          <div className="flex items-center">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
              className="inline-flex items-center rounded-full px-5 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
              style={{ backgroundColor: "#0071e3" }}
            >
              Let&apos;s Connect
            </a>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-center md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="M5 5L17 17M17 5L5 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M3 7H19M3 11H19M3 15H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-[#e6e6e6] bg-white px-6 py-5 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const id = link.href.slice(1);
              const isActive = activeId === id;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                    className={`flex items-center rounded-lg px-3 py-3 text-sm transition-colors ${
                      isActive ? "bg-blue-50 font-semibold text-[#0071e3]" : "font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
            <li className="mt-3 border-t border-[#e6e6e6] pt-4">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
                className="inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: "#0071e3" }}
              >
                Let&apos;s Connect
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
