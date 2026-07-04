"use client";

import React, { useEffect, useRef, useState } from "react";
import { caseStudies } from "@/lib/data";

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

function LockTooltip() {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {/* Matches "View Case Study →" style exactly — same font, same colour, lock replaces arrow */}
      <button
        type="button"
        className="group inline-flex cursor-default items-center gap-2 text-[14px] font-semibold text-gray-400 transition-colors hover:text-gray-600"
      >
        Case Study Locked
        <svg width="13" height="13" viewBox="0 0 12 14" fill="none" aria-hidden="true">
          <rect x="1" y="6" width="10" height="8" rx="1.5" fill="currentColor" />
          <path d="M3.5 6V4a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {visible && (
        <div className="pointer-events-none absolute bottom-full left-0 mb-3 w-64 rounded-xl bg-gray-900 px-4 py-3 shadow-xl">
          <p className="text-[12px] leading-relaxed text-white/80">
            This case study is under NDA. Reach out directly for access or a walkthrough.
          </p>
          <div className="absolute -bottom-1.5 left-5 h-3 w-3 rotate-45 rounded-sm bg-gray-900" />
        </div>
      )}
    </div>
  );
}

function CaseStudyCard({
  project,
  index,
}: {
  project: (typeof caseStudies)[0];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.07 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref as unknown as React.RefObject<HTMLElement>}
      className="grid items-center gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16 xl:gap-24"
      style={{
        opacity: 0,
        transform: "translateY(40px)",
        transition: `opacity 0.7s ease ${index * 0.08}s, transform 0.7s ease ${index * 0.08}s`,
      }}
    >
      {/* Text — Law of Proximity grouping */}
      <div>
        {/* Group 1: Heading + Description — x = 12px */}
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-3 text-base leading-[1.75] text-gray-500">{project.description}</p>

        {/* Group 2: Tags — x + 4 = 16px gap from description */}
        {/* Status (coloured) tag always first */}
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusPill status={project.status} />
          {project.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>

        {/* CTA — x + 12 = 24px gap from tags */}
        <div className="mt-6">
          {project.locked ? (
            <LockTooltip />
          ) : (
            <a
              href={`/work#${project.id}`}
              className="group inline-flex w-fit items-center gap-2 text-[14px] font-semibold transition-colors"
              style={{ color: "#0071e3" }}
            >
              View Case Study
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Visual — image or gradient placeholder */}
      <div
        className="group relative min-h-[400px] w-full overflow-hidden rounded-2xl lg:min-h-[480px]"
        style={{ background: project.gradient }}
      >
        {project.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.04]" />
      </div>
    </article>
  );
}

export function FeaturedWork() {
  return (
    <section id="featured-work" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="section-label mb-4">Selected Work</p>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.5rem]">
          Products and experiences I&apos;ve designed
        </h2>
        <p className="mt-4 max-w-xl text-base leading-[1.75] text-gray-500">
          Enterprise platforms, mobile experiences, and products designed to solve real business problems.
        </p>

        <div className="mt-20 space-y-20">
          {caseStudies.map((project, i) => (
            <CaseStudyCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
