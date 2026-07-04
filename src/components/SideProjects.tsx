"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sideProjects } from "@/lib/data";

const CARD_W = 480;
const CARD_GAP = 24;

function StatusTag({ status }: { status: "Live" | "Concept" }) {
  if (status === "Live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        Live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[13px] font-semibold text-gray-500">
      Concept
    </span>
  );
}

function ProjectCard({ project }: { project: (typeof sideProjects)[0] }) {
  const [hoverNda, setHoverNda] = useState(false);

  return (
    <div
      className="group flex shrink-0 flex-col overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white transition-shadow duration-300 hover:shadow-lg"
      style={{ width: CARD_W }}
    >
      {/* Gradient placeholder image area */}
      <div
        className="relative overflow-hidden transition-transform duration-500"
        style={{ height: 260, background: project.gradient }}
      >
        {/* subtle inner vignette on hover */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.04]" />
      </div>

      {/* Content — Law of Proximity */}
      <div className="flex flex-1 flex-col p-6">
        {/* Group 1: Title + Description — x = 10px */}
        <h3 className="text-[17px] font-bold leading-snug text-gray-900">{project.title}</h3>
        <p className="mt-2.5 line-clamp-2 text-[14px] leading-[1.7] text-gray-500">{project.description}</p>

        {/* Group 2: Tags — x+4 = 14px, status (coloured) first */}
        <div className="mt-3.5 flex flex-wrap gap-2">
          <StatusTag status={project.status} />
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#e6e6e6] px-3 py-1 text-[13px] font-medium text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA — x+12 = 22px, tertiary text link (no border-t) */}
        <div className="mt-auto pt-5">
          {project.locked ? (
            <div
              className="relative inline-flex"
              onMouseEnter={() => setHoverNda(true)}
              onMouseLeave={() => setHoverNda(false)}
            >
              <button
                type="button"
                className="inline-flex cursor-default items-center gap-2 text-[14px] font-semibold text-gray-400"
              >
                <svg width="13" height="13" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                  <rect x="1" y="6" width="10" height="8" rx="1.5" fill="currentColor" />
                  <path d="M3.5 6V4a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Protected under NDA
              </button>
              {hoverNda && (
                <div className="pointer-events-none absolute bottom-full left-0 mb-2 w-56 rounded-xl bg-gray-900 px-3 py-2.5 shadow-xl">
                  <p className="text-[11px] leading-relaxed text-white/80">
                    Reach out directly for a walkthrough of this project.
                  </p>
                  <div className="absolute -bottom-1.5 left-4 h-3 w-3 rotate-45 rounded-sm bg-gray-900" />
                </div>
              )}
            </div>
          ) : (
            <a
              href={project.href ?? "#"}
              target={project.href ? "_blank" : undefined}
              rel={project.href ? "noopener noreferrer" : undefined}
              className="group/link inline-flex items-center gap-1.5 text-[14px] font-semibold transition-opacity hover:opacity-70"
              style={{ color: "#0071e3" }}
            >
              View Project
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover/link:translate-x-1"
              >
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function SideProjects() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? CARD_W + CARD_GAP : -(CARD_W + CARD_GAP),
      behavior: "smooth",
    });
  };

  return (
    <section id="side-projects" className="py-24 lg:py-32">
      {/* Header — inside max-w-7xl to align with page */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="section-label mb-4">Building Outside the 9–5</p>
        <h2 className="text-[2.5rem] font-bold tracking-tight text-gray-900">
          Side projects and experiments
          <br className="hidden sm:block" /> built outside work.
        </h2>

        {/* Subtext + scroll arrows */}
        <div className="mt-5 flex items-start justify-between gap-6">
          <p className="max-w-md text-[15px] leading-[1.75] text-gray-500">
            A collection of products and concepts where I explore design systems,
            startup ideas, and end-to-end product thinking.
          </p>
          <div className="flex shrink-0 items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e6e6] bg-white shadow-sm transition-all hover:border-[#0071e3]/30 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e6e6] bg-white shadow-sm transition-all hover:border-[#0071e3]/30 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll track — negative margin so it bleeds edge-to-edge,
          padding restores alignment so first card lines up with content */}
      <div className="mx-auto mt-10 max-w-7xl px-6 lg:px-10">
        <div
          ref={scrollRef}
          className="-mx-6 flex gap-6 overflow-x-auto pb-2 lg:-mx-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
        >
          {sideProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {/* Trailing space so last card doesn't touch edge */}
          <div className="w-6 shrink-0 lg:w-10" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
