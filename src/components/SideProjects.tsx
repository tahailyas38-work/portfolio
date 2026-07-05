"use client";

import { useCallback, useEffect, useState } from "react";
import { sideProjects } from "@/lib/data";

const PROJECTS = sideProjects;
const AUTO_DELAY = 5500;

function StatusTag({ status }: { status: "Live" | "Concept" }) {
  if (status === "Live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        Live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[12px] font-semibold text-gray-500">
      Concept
    </span>
  );
}

function ProjectImage({ project, mobile = false }: { project: (typeof PROJECTS)[0]; mobile?: boolean }) {
  return (
    <div
      className={`relative w-full shrink-0 overflow-hidden ${
        mobile ? "h-52 rounded-2xl sm:h-56" : "h-full rounded-2xl lg:h-full"
      }`}
      style={{ background: project.gradient }}
    >
      {project.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.image}
          alt={`${project.title} preview`}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      )}
    </div>
  );
}

function ProjectContent({ project, mobile = false }: { project: (typeof PROJECTS)[0]; mobile?: boolean }) {
  return (
    <div className={`flex flex-col justify-between ${mobile ? "pt-4" : "p-5 sm:p-6 lg:p-8"}`}>
      <div>
        <StatusTag status={project.status} />
        <h3 className={`font-bold leading-snug tracking-tight text-gray-900 ${mobile ? "mt-3 text-[20px]" : "mt-4 text-[20px] sm:mt-4 sm:text-[24px]"}`}>
          {project.title}
        </h3>
        <p className={`leading-[1.75] text-gray-500 ${mobile ? "mt-2 text-[13px]" : "mt-2.5 text-[13px] sm:mt-3 lg:text-[14px]"}`}>
          {project.description}
        </p>
        <div className={`flex flex-wrap gap-2 ${mobile ? "mt-3" : "mt-3 sm:mt-4"}`}>
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[#e6e6e6] px-3 py-1 text-[12px] font-medium text-gray-500">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={mobile ? "mt-5" : "mt-5 sm:mt-6"}>
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0071e3] transition-opacity hover:opacity-70 lg:text-[15px]"
          >
            Visit Site
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        ) : null}
      </div>
    </div>
  );
}

function CarouselControls({
  current,
  playing,
  onGo,
  onTogglePlay,
  onPrev,
  onNext,
}: {
  current: number;
  playing: boolean;
  onGo: (i: number) => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6e6e6] px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2.5">
        {PROJECTS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onGo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              height: 8,
              width: i === current ? 28 : 8,
              borderRadius: 99,
              backgroundColor: i === current ? "#0071e3" : "#d1d5db",
              flexShrink: 0,
            }}
          />
        ))}
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-[#e6e6e6] text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50"
        >
          {playing ? (
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden="true">
              <rect x="0.5" y="0.5" width="3" height="12" rx="1.5" fill="currentColor" />
              <rect x="7.5" y="0.5" width="3" height="12" rx="1.5" fill="currentColor" />
            </svg>
          ) : (
            <svg width="12" height="13" viewBox="0 0 12 13" fill="none" aria-hidden="true">
              <path d="M1.5 1.5L10.5 6.5L1.5 11.5V1.5Z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={onPrev} aria-label="Previous" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e6e6] text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" onClick={onNext} aria-label="Next" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e6e6] text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function SideProjects() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [timerKey, setTimerKey] = useState(0);

  const go = useCallback((index: number) => {
    setCurrent(((index % PROJECTS.length) + PROJECTS.length) % PROJECTS.length);
    setTimerKey((k) => k + 1);
  }, []);

  const prev = useCallback(() => go(current - 1), [current, go]);
  const next = useCallback(() => go(current + 1), [current, go]);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => {
      setCurrent((c) => (c + 1) % PROJECTS.length);
      setTimerKey((k) => k + 1);
    }, AUTO_DELAY);
    return () => clearTimeout(id);
  }, [playing, timerKey]);

  const project = PROJECTS[current];

  return (
    <section id="side-projects" className="py-16 sm:py-24 lg:py-32" style={{ backgroundColor: "#f0f4f8" }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">

        <p className="section-label">Building Outside the 9&ndash;5</p>
        <h2 className="mt-2 max-w-2xl text-[1.75rem] font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-[2rem] lg:text-[2.5rem]">
          Side projects and experiments built outside work.
        </h2>
        <p className="mt-2 max-w-md text-[13px] leading-[1.75] text-gray-500 lg:text-[15px]">
          A collection of products and concepts where I explore design systems,
          startup ideas, and end-to-end product thinking.
        </p>

        <div className="mt-8 rounded-3xl border border-[#e6e6e6] bg-white shadow-sm sm:mt-10">

          {/* Mobile — stacked layout */}
          <div className="p-4 lg:hidden">
            <ProjectImage project={project} mobile />
            <ProjectContent project={project} mobile />
          </div>

          {/* Desktop — horizontal slide carousel */}
          <div className="hidden p-4 lg:block">
            <div className="relative h-[360px] overflow-hidden rounded-2xl">
              {PROJECTS.map((p, i) => (
                <div
                  key={p.id}
                  aria-hidden={i !== current}
                  className="absolute inset-0 grid grid-cols-[55%_45%] transition-transform duration-500 will-change-transform"
                  style={{
                    transform: `translateX(${(i - current) * 100}%)`,
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <ProjectImage project={p} />
                  <ProjectContent project={p} />
                </div>
              ))}
            </div>
          </div>

          <CarouselControls
            current={current}
            playing={playing}
            onGo={go}
            onTogglePlay={() => setPlaying((p) => !p)}
            onPrev={prev}
            onNext={next}
          />
        </div>

      </div>
    </section>
  );
}
