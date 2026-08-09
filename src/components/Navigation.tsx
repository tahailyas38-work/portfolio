"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { navLinks } from "@/lib/data";
import { MagneticButton } from "@/components/MagneticButton";

/** Soft, slow ease — decelerates into place */
const softEase = [0.16, 1, 0.3, 1] as const;

function BrandMark({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back to top"
      className="flex shrink-0 items-center gap-2 sm:gap-2.5 transition-opacity hover:opacity-70"
    >
      <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ececee] sm:size-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Avatar.png" alt="" className="h-[92%] w-[92%] object-contain object-center" />
      </span>
      <span className="font-brand text-[19px] font-semibold leading-none tracking-tight text-[#0a0a0a] sm:text-[22px]">
        Taha
      </span>
    </button>
  );
}

export function Navigation({ visible = true }: { visible?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [scrollUp, setScrollUp] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const clearLeaveTimer = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  const onScrollFrame = useCallback(() => {
    const y = window.scrollY;
    const dy = y - lastY.current;

    if (y < 56) {
      setScrolledPast(false);
      setScrollUp(false);
    } else {
      setScrolledPast(true);
      if (dy < -8) setScrollUp(true);
      else if (dy > 8) setScrollUp(false);
    }

    lastY.current = y;
    ticking.current = false;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(onScrollFrame);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScrollFrame]);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const detect = () => {
      const scrollY = window.scrollY + 120;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActiveId(current);
    };
    detect();
    window.addEventListener("scroll", detect, { passive: true });
    return () => window.removeEventListener("scroll", detect);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.documentElement.classList.add("scroll-locked");
    return () => document.documentElement.classList.remove("scroll-locked");
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => () => clearLeaveTimer(), []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const backToTop = () => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * State 1: at top → full
   * State 2: scrolled down → compact; hover → full
   * State 3: scrolling up → full
   */
  const compact = scrolledPast && !scrollUp && !hovered && !mobileOpen;
  const expanded = !compact;

  const layoutTween = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 70, damping: 18, mass: 1.1 };

  const fadeIn = reduceMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: softEase, delay: 0.28 };

  const fadeOut = reduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: softEase };

  const mobileMenu =
    mounted && mobileOpen
      ? createPortal(
          <div className="fixed inset-0 z-[80] md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
            <button
              type="button"
              aria-label="Dismiss menu"
              className="absolute inset-0 bg-black/45"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-x-4 top-[max(0.75rem,env(safe-area-inset-top))] overflow-hidden rounded-[22px] border border-[#e6e6e6] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
              <div className="flex items-center justify-between gap-3 border-b border-[#eee] px-3 py-2.5">
                <BrandMark onClick={backToTop} />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#6b7280] transition-colors hover:bg-gray-100 hover:text-[#0a0a0a]"
                >
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    <path
                      d="M5 5L17 17M17 5L5 17"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <ul className="flex flex-col p-2">
                {navLinks.map((link) => {
                  const id = link.href.slice(1);
                  const isActive = activeId === id;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollTo(link.href);
                        }}
                        className={`flex min-h-12 items-center rounded-xl px-3.5 text-[15px] transition-colors ${
                          isActive
                            ? "bg-gray-100 font-semibold text-[#0a0a0a]"
                            : "font-medium text-[#6b7280] active:bg-gray-50 active:text-[#0a0a0a]"
                        }`}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
                <li className="mt-1.5 border-t border-[#e6e6e6] px-1.5 pb-1.5 pt-3">
                  <MagneticButton
                    href="#contact"
                    size="lg"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo("#contact");
                    }}
                    className="w-full justify-center !py-2.5 !text-[14px]"
                  >
                    Let&apos;s Connect
                  </MagneticButton>
                </li>
              </ul>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:pt-5 ${
          visible ? "nav-header--visible" : "nav-header"
        }`}
      >
        <div
          ref={shellRef}
          className={`relative z-[1] flex w-full max-w-3xl flex-col items-center ${
            mobileOpen ? "invisible md:visible" : ""
          }`}
        >
          <motion.div
            layout
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              clearLeaveTimer();
              setHovered(true);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== "mouse") return;
              clearLeaveTimer();
              leaveTimer.current = setTimeout(() => {
                setHovered(false);
              }, 280);
            }}
            transition={{ layout: layoutTween }}
            className={`pointer-events-auto relative flex h-[48px] items-center overflow-hidden rounded-full border border-[#e6e6e6] bg-white/95 py-1 pl-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:h-[56px] sm:py-1.5 sm:pl-2 ${
              compact
                ? "w-[min(100%,220px)] justify-between pr-1.5 sm:w-[240px] sm:pr-2"
                : "w-full gap-2 pr-1.5 sm:gap-5 sm:pr-4"
            }`}
          >
            <motion.div layout="position" transition={{ layout: layoutTween }} className="shrink-0">
              <BrandMark onClick={backToTop} />
            </motion.div>

            <motion.div
              initial={false}
              animate={{
                opacity: expanded ? 1 : 0,
                maxWidth: expanded ? 720 : 0,
                flexGrow: expanded ? 1 : 0,
              }}
              transition={{
                maxWidth: layoutTween,
                flexGrow: layoutTween,
                opacity: expanded ? fadeIn : fadeOut,
              }}
              className="flex min-w-0 items-center justify-end overflow-hidden"
              style={{ pointerEvents: expanded ? "auto" : "none" }}
              aria-hidden={!expanded}
            >
              <nav className="hidden items-center md:flex">
                {navLinks.map((link) => {
                  const id = link.href.slice(1);
                  const isActive = activeId === id;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      tabIndex={expanded ? undefined : -1}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(link.href);
                      }}
                      className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] transition-colors sm:px-4 ${
                        isActive
                          ? "font-semibold text-[#0a0a0a]"
                          : "font-medium text-[#6b7280] hover:text-[#0a0a0a]"
                      }`}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </nav>

              <MagneticButton
                href="#contact"
                size="lg"
                tabIndex={expanded ? undefined : -1}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#contact");
                }}
                className="!shadow-sm !hidden shrink-0 md:!inline-flex"
              >
                Let&apos;s Connect
              </MagneticButton>

              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                tabIndex={expanded ? undefined : -1}
                onClick={() => setMobileOpen(true)}
                className="ml-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#6b7280] transition-colors hover:bg-gray-100 hover:text-[#0a0a0a] md:hidden"
              >
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path
                    d="M4 7H18M4 11H18M4 15H18"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </motion.div>

            <motion.button
              type="button"
              initial={false}
              animate={{
                opacity: compact ? 1 : 0,
                scale: compact ? 1 : 0.92,
              }}
              transition={{
                opacity: compact ? fadeIn : fadeOut,
                scale: layoutTween,
              }}
              aria-label="Open menu"
              aria-hidden={!compact}
              tabIndex={compact ? 0 : -1}
              onClick={() => setMobileOpen(true)}
              className={
                compact
                  ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#6b7280] hover:bg-gray-100 hover:text-[#0a0a0a] md:h-9 md:w-9"
                  : "pointer-events-none absolute right-4 top-1/2 h-0 w-0 -translate-y-1/2 overflow-hidden opacity-0"
              }
              style={{ pointerEvents: compact ? "auto" : "none" }}
            >
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path
                  d="M4 7H18M4 11H18M4 15H18"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}
