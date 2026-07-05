"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { caseStudies, siteConfig } from "@/lib/data";

const VISIBLE = caseStudies.slice(0, 3);

// ── NDA Modal ────────────────────────────────────────────────────────────────
function NdaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword(""); setError(false); setUnlocked(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("scroll-locked");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("scroll-locked");
    };
  }, [isOpen, onClose]);

  const handleUnlock = () => {
    if (password === siteConfig.ndaPassword) {
      setUnlocked(true);
      setTimeout(onClose, 1400);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className="mb-7 text-center">
          <span className="text-4xl">🔒</span>
          <h3 className="mt-4 text-[20px] font-bold leading-snug text-gray-900">
            This work is protected under NDA
          </h3>
          <p className="mt-2.5 text-[14px] leading-[1.7] text-gray-500">
            I&apos;d love to share more, but some projects contain confidential information
            that can only be viewed through private access.
          </p>
        </div>

        {!unlocked ? (
          <>
            <input
              ref={inputRef}
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleUnlock(); }}
              className="w-full rounded-xl border border-[#e6e6e6] px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10"
            />
            {error && (
              <p className="mt-2 text-[13px] text-red-500">Incorrect password. Please try again.</p>
            )}
            <button
              type="button"
              onClick={handleUnlock}
              className="mt-4 w-full rounded-full bg-[#0071e3] px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Unlock Case Study
            </button>
            <p className="mt-5 text-center text-[13px] text-gray-400">
              For access requests,{" "}
              <a href="#contact" onClick={onClose} className="text-[#0071e3] underline-offset-2 hover:underline">
                feel free to reach out.
              </a>
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <span className="text-3xl">✓</span>
            <p className="text-[15px] font-semibold text-emerald-600">Access granted!</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// ── Pills ────────────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: "Live" | "Designed" }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700">
      {status === "Live" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
      )}
      {status}
    </span>
  );
}

function TagPill({ tag }: { tag: string }) {
  return (
    <span className="rounded-full border border-[#e6e6e6] px-3 py-1 text-[13px] font-medium text-gray-500">
      {tag}
    </span>
  );
}

// ── Sticky visual ────────────────────────────────────────────────────────────
function ProjectVisual({
  project,
  isActive,
}: {
  project: (typeof caseStudies)[0];
  isActive: boolean;
}) {
  return (
    <div
      className="absolute inset-0 transition-opacity duration-700 ease-out"
      style={{
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      <div className="relative h-full w-full" style={{ background: project.gradient }}>
        {project.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ndaOpen, setNdaOpen] = useState(false);

  const updateActive = useCallback(() => {
    const steps = sectionRef.current?.querySelectorAll<HTMLElement>(".case-study-step");
    if (!steps?.length) return;

    const viewportCenter = window.innerHeight / 2;
    let closest = 0;
    let closestDist = Infinity;

    steps.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    updateActive();
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { updateActive(); ticking = false; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActive, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActive);
    };
  }, [updateActive]);

  return (
    <>
      <NdaModal isOpen={ndaOpen} onClose={() => setNdaOpen(false)} />

      <section id="featured-work" ref={sectionRef}>

        {/* Header */}
        <div className="mx-auto max-w-7xl px-5 pt-16 text-center sm:px-6 lg:px-10 lg:pt-28">
          <p className="section-label">Selected Work</p>
          <h2 className="mt-2 text-[1.75rem] font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-4xl lg:text-[52px]">
            Products and Experiences I&apos;ve Designed
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-[1.75] text-gray-500 lg:text-[18px]">
            Enterprise platforms, mobile experiences, and products designed to solve real
            business problems.
          </p>
        </div>

        {/* Grid — left scrolls, right sticky */}
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
          <div className="featured-work-grid lg:grid lg:grid-cols-[minmax(0,34%)_minmax(0,66%)] lg:gap-8">

            {/* Left — case study steps */}
            <div className="min-w-0">
              {VISIBLE.map((project, i) => {
                const isActive = activeIndex === i;
                return (
                  <div key={project.id} className="case-study-step">
                    {/* Mobile — image above content */}
                    <div className="relative mb-5 h-[320px] w-full shrink-0 overflow-hidden rounded-2xl sm:mb-6 lg:hidden">
                      <div className="relative h-full w-full" style={{ background: project.gradient }}>
                        {project.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.image}
                            alt={`${project.title} preview`}
                            className="absolute inset-0 h-full w-full object-cover object-center"
                          />
                        )}
                      </div>
                    </div>

                    <article
                      className={`w-full transition-[opacity,transform] duration-500 ease-out lg:pr-4 max-lg:opacity-100 max-lg:translate-y-0 ${
                        isActive ? "lg:opacity-100 lg:translate-y-0" : "lg:opacity-[0.22] lg:translate-y-[6px]"
                      }`}
                      style={{ willChange: "opacity, transform" }}
                    >
                      <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        {project.title}
                      </h3>
                      <p className="mt-2.5 text-[13px] leading-[1.75] text-gray-500 lg:text-[15px]">
                        {project.description}
                      </p>
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        <StatusPill status={project.status} />
                        {project.tags.map((tag) => <TagPill key={tag} tag={tag} />)}
                      </div>

                      <div className="mt-5 pt-5">
                        <button
                          type="button"
                          onClick={() => setNdaOpen(true)}
                          className="group inline-flex items-center gap-1.5 text-[14px] font-semibold transition-opacity hover:opacity-70 lg:text-[16px]"
                          style={{ color: "#0071e3" }}
                        >
                          View Case Study
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>

            {/* Right — sticky visual column (no overflow-hidden — breaks sticky) */}
            <div className="featured-work-visual-column relative hidden lg:block">
              <div className="featured-work-visual-sticky">
                <div className="featured-work-visual-frame">
                  {VISIBLE.map((project, i) => (
                    <ProjectVisual key={project.id} project={project} isActive={activeIndex === i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-24 lg:h-32" aria-hidden="true" />
      </section>
    </>
  );
}
