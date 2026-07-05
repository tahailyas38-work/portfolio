"use client";

import { useState, useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import { navLinks } from "@/lib/data";
import { ResumeModal } from "@/components/ResumeModal";

export function Navigation({ visible = true }: { visible?: boolean }) {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
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
    if (!mobileOpen) return;
    document.documentElement.classList.add("scroll-locked");
    return () => { document.documentElement.classList.remove("scroll-locked"); };
  }, [mobileOpen]);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const openResume = () => {
    setMobileOpen(false);
    setResumeOpen(true);
  };

  return (
    <>
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />

      <header
        className={`nav-header fixed inset-x-0 top-0 z-50 border-b border-[#e6e6e6] bg-white/96 backdrop-blur-[20px] transition-all duration-500 ease-out ${visible ? "nav-header--visible" : ""}`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-stretch justify-between px-6 lg:px-10">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="flex items-center transition-opacity hover:opacity-60"
          >
            <Logo className="h-[22px] w-auto" />
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const id = link.href.slice(1);
              const isActive = activeId === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className={`relative flex h-full items-center px-4 text-[14px] transition-colors ${
                    isActive ? "font-semibold text-[#0a0a0a]" : "font-medium text-[#6b7280] hover:text-[#0a0a0a]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-[#0071e3] transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              );
            })}

            <div className="mx-3 my-4 w-px self-stretch bg-[#e6e6e6]" />

            {/* Tertiary: Resume — opens viewer */}
            <button
              type="button"
              onClick={openResume}
              className="flex h-full items-center gap-1.5 px-3 text-[14px] font-medium text-[#6b7280] transition-colors hover:text-[#0a0a0a]"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 2h8l4 4v10H2V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M10 2v4h4M5 9h6M5 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Resume
            </button>

            <div className="mx-2 my-4 w-px self-stretch bg-[#e6e6e6]" />

            {/* Primary CTA */}
            <div className="flex items-center">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
                className="inline-flex items-center rounded-full px-5 py-2.5 text-[14px] font-semibold text-white transition-all hover:opacity-85"
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

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-[#e6e6e6] bg-white/90 px-5 py-5 shadow-xl backdrop-blur-[20px] md:hidden max-h-[calc(100svh-72px)] overflow-y-auto">
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
              <li>
                <button
                  type="button"
                  onClick={openResume}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 2h8l4 4v10H2V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                    <path d="M10 2v4h4M5 9h6M5 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  Resume
                </button>
              </li>
              <li className="mt-3 border-t border-[#e6e6e6] pt-4">
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
                  className="inline-flex rounded-full px-5 py-2.5 text-[14px] font-semibold text-white lg:text-[16px]"
                  style={{ backgroundColor: "#0071e3" }}
                >
                  Let&apos;s Connect
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
