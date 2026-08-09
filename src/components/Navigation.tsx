"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { navLinks } from "@/lib/data";
import { MagneticButton } from "@/components/MagneticButton";
import { AvatarImage } from "@/components/AvatarImage";

/** Soft ease for height / fade — no layout thrash */
const softEase = [0.22, 1, 0.36, 1] as const;

function BrandMark({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back to top"
      className="flex shrink-0 items-center gap-2 sm:gap-2.5 transition-opacity hover:opacity-70"
    >
      <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ececee] sm:size-10">
        <AvatarImage variant="mark" className="h-[92%] w-[92%]" />
      </span>
      <span className="font-brand text-[19px] font-semibold leading-none tracking-tight text-[#0a0a0a] sm:text-[22px]">
        Taha
      </span>
    </button>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {open ? (
        <path
          d="M5 5L17 17M17 5L5 17"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7H18M4 11H18M4 15H18"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
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

  /** Compact shrink is desktop-only — mobile width stays full and stable. */
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

  const backdrop =
    mounted
      ? createPortal(
          <AnimatePresence>
            {mobileOpen ? (
              <motion.button
                key="nav-backdrop"
                type="button"
                aria-label="Dismiss menu"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3, ease: softEase }}
                className="fixed inset-0 z-[45] bg-black/45 md:hidden"
                onClick={() => setMobileOpen(false)}
              />
            ) : null}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <>
      {backdrop}
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:pt-5 ${
          visible ? "nav-header--visible" : "nav-header"
        }`}
      >
        <div className="relative z-[1] w-full max-w-3xl">
          <motion.div
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
            initial={false}
            animate={{
              borderRadius: mobileOpen ? 22 : 999,
            }}
            transition={{
              borderRadius: reduceMotion ? { duration: 0 } : { duration: 0.42, ease: softEase },
              width: layoutTween,
            }}
            className={`pointer-events-auto relative overflow-hidden border border-[#e6e6e6] bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.1)] backdrop-blur-xl ${
              mobileOpen ? "bg-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]" : ""
            } ${compact ? "w-full md:w-[240px]" : "w-full"}`}
          >
            {/*
              Top row padding is IDENTICAL open/closed so brand + icon never jump.
              pl-1.5 pr-1.5 py-1 + h-12 matches the closed pill.
            */}
            <div
              className={`flex h-12 items-center pl-1.5 pr-1.5 sm:h-14 sm:pl-2 ${
                mobileOpen ? "border-b border-[#eee]" : ""
              } ${compact ? "justify-between sm:pr-2" : "justify-between gap-2 sm:gap-5 sm:pr-4"}`}
            >
              <div className="shrink-0">
                <BrandMark onClick={backToTop} />
              </div>

              {/* Desktop expanded: links + CTA */}
              <motion.div
                initial={false}
                animate={{
                  opacity: expanded && !mobileOpen ? 1 : 0,
                  maxWidth: expanded && !mobileOpen ? 720 : 0,
                  flexGrow: expanded && !mobileOpen ? 1 : 0,
                }}
                transition={{
                  maxWidth: layoutTween,
                  flexGrow: layoutTween,
                  opacity: expanded && !mobileOpen ? fadeIn : fadeOut,
                }}
                className="hidden min-w-0 items-center justify-end overflow-hidden md:flex"
                style={{ pointerEvents: expanded && !mobileOpen ? "auto" : "none" }}
                aria-hidden={!expanded || mobileOpen}
              >
                <nav className="flex items-center">
                  {navLinks.map((link) => {
                    const id = link.href.slice(1);
                    const isActive = activeId === id;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        tabIndex={expanded && !mobileOpen ? undefined : -1}
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
                  tabIndex={expanded && !mobileOpen ? undefined : -1}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#contact");
                  }}
                  className="!shadow-sm ml-1 shrink-0"
                >
                  Let&apos;s Connect
                </MagneticButton>
              </motion.div>

              {/* Mobile toggle — same slot open/closed */}
              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((o) => !o)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#6b7280] transition-colors hover:bg-gray-100 hover:text-[#0a0a0a] md:hidden"
              >
                <MenuIcon open={mobileOpen} />
              </button>

              {/* Desktop compact hamburger */}
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
                aria-label="Expand navigation"
                aria-hidden={!compact}
                tabIndex={compact ? 0 : -1}
                onClick={() => setHovered(true)}
                className={
                  compact
                    ? "hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6b7280] hover:bg-gray-100 hover:text-[#0a0a0a] md:flex"
                    : "pointer-events-none absolute right-4 top-1/2 hidden h-0 w-0 -translate-y-1/2 overflow-hidden opacity-0 md:block"
                }
                style={{ pointerEvents: compact ? "auto" : "none" }}
              >
                <MenuIcon open={false} />
              </motion.button>
            </div>

            {/* Panel expands below the stable top row — CSS grid is smoother than height:auto */}
            <div
              className={`grid md:hidden ${
                reduceMotion ? "" : "transition-[grid-template-rows] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              } ${mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <ul
                  className={`flex flex-col px-1.5 pb-2 pt-1 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    mobileOpen ? "opacity-100 delay-75" : "opacity-0"
                  }`}
                >
                  {navLinks.map((link) => {
                    const id = link.href.slice(1);
                    const isActive = activeId === id;
                    return (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          tabIndex={mobileOpen ? undefined : -1}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollTo(link.href);
                          }}
                          className={`flex h-12 items-center rounded-xl px-3 text-[15px] transition-colors ${
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
                  <li className="mt-1 border-t border-[#e6e6e6] px-1.5 pb-1 pt-3">
                    <MagneticButton
                      href="#contact"
                      size="lg"
                      tabIndex={mobileOpen ? undefined : -1}
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
            </div>
          </motion.div>
        </div>
      </header>
    </>
  );
}
