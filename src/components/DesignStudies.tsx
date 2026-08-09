"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { designStudies } from "@/lib/data";
import { MagneticButton } from "@/components/MagneticButton";
import { AvatarImage } from "@/components/AvatarImage";

type Study = (typeof designStudies)[number];

const LAST_INDEX = designStudies.length - 1;

/** Same page grid as nav/hero: max-w-7xl + px-6 lg:px-10 */
const GUTTER = "px-6 lg:px-10";
/**
 * Full-bleed scroller inset: matches max-w-7xl + gutters so the first/last card
 * aligns with the heading, while cards can scroll to the viewport edges.
 */
const BLEED_INSET =
  "pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]";
const BLEED_SCROLL =
  "scroll-pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] scroll-pr-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:scroll-pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:scroll-pr-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]";

function StudySheet({ study, onClose }: { study: Study; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const sheetRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    sheetRef.current?.focus();
  }, []);

  const scrollToContact = () => {
    onClose();
    window.setTimeout(() => {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    }, 180);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200]">
      <motion.button
        type="button"
        aria-label="Close design study"
        className="absolute inset-0 bg-black/55"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        onClick={onClose}
      />

      {/*
        Close lives in the dark band above the sheet (not the page nav corner).
        Sheet starts at top-12 / top-14 so this sits cleanly in the overlay gap.
      */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-2.5 z-[210] flex h-9 w-9 items-center justify-center text-white transition-opacity hover:opacity-70 sm:right-6 sm:top-3.5 sm:h-10 sm:w-10"
      >
        <X className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2.25} />
      </button>

      <motion.div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="design-study-title"
        tabIndex={-1}
        initial={reduceMotion ? false : { y: "100%" }}
        animate={{ y: 0 }}
        exit={reduceMotion ? undefined : { y: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.9 }}
        className="absolute inset-x-0 bottom-0 top-12 flex w-full flex-col overflow-hidden rounded-t-[20px] bg-white outline-none sm:top-14 sm:rounded-t-[24px]"
      >
        {/* Sticky name + size-2 CTA — matches Dribbble header proportions */}
        <div className="z-20 shrink-0 bg-white">
          <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5 lg:px-12">
            <h3
              id="design-study-title"
              className="min-w-0 truncate text-[17px] font-bold leading-none tracking-tight text-gray-900 sm:text-[19px]"
            >
              {study.title}
            </h3>
            <MagneticButton
              type="button"
              variant="primary"
              size="lg"
              onClick={scrollToContact}
            >
              Let&apos;s Connect
            </MagneticButton>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-hide">
          <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 px-5 pb-16 pt-1 sm:gap-6 sm:px-8 sm:pb-20 lg:gap-7 lg:px-12">
            {study.sections.map((section, i) => (
              <div key={`${study.id}-section-${i}`} className="flex flex-col gap-5 sm:gap-6 lg:gap-7">
                <div
                  className="overflow-hidden rounded-[18px] border border-[#e8e8e8] shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:rounded-[22px]"
                  style={{ background: study.accent }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={section.image}
                    alt={`${study.title} - portion ${i + 1}`}
                    className="block w-full"
                  />
                </div>
                {section.note?.length ? (
                  <div className="flex justify-center px-1 py-4 sm:px-2 sm:py-6">
                    <p className="w-full max-w-[52rem] text-balance text-center text-[17px] font-medium leading-[1.65] tracking-[-0.015em] text-gray-800 sm:max-w-[58rem] sm:text-[19px] sm:leading-[1.7] lg:max-w-none lg:text-[20px]">
                      {section.note.join(" ")}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}

            {/* Creative ending — interrupted divider + avatar + personal CTA */}
            <div className="mt-4 flex flex-col items-center pb-6 pt-8 sm:mt-6 sm:pb-8 sm:pt-10">
              <div className="mb-6 flex w-full items-center gap-8 sm:mb-8 sm:gap-10">
                <span className="h-px min-w-0 flex-1 bg-[#e5e5e5]" aria-hidden="true" />
                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ececee] sm:h-20 sm:w-20">
                  <AvatarImage variant="mark" className="h-[88%] w-[88%]" />
                </div>
                <span className="h-px min-w-0 flex-1 bg-[#e5e5e5]" aria-hidden="true" />
              </div>
              <p className="text-[20px] font-bold tracking-tight text-gray-900 sm:text-[24px]">
                Taha
              </p>
              <p className="mt-2 max-w-sm text-balance text-center text-[13px] leading-relaxed text-gray-500 sm:text-[14px]">
                Designing products people love.
              </p>
              <MagneticButton
                type="button"
                variant="primary"
                size="md"
                onClick={scrollToContact}
                className="mt-6 px-6 py-3"
              >
                Let&apos;s Connect
              </MagneticButton>
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

function scrollPaddingLeft(scroller: HTMLElement) {
  return parseFloat(getComputedStyle(scroller).scrollPaddingLeft) || 0;
}

/**
 * A card's left edge within the scroller's content, independent of current scroll position.
 * `offsetLeft` is unreliable here — it's relative to the nearest *positioned* ancestor, which is
 * rarely the scroller itself, so it drags in unrelated page layout offsets.
 */
function contentLeft(scroller: HTMLElement, card: HTMLElement) {
  return card.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
}

/** Scroll position for a card so its start lands exactly on the snap line (scroll-padding-left). */
function scrollLeftFor(scroller: HTMLElement, card: HTMLElement) {
  const max = scroller.scrollWidth - scroller.clientWidth;
  return Math.min(Math.max(0, contentLeft(scroller, card) - scrollPaddingLeft(scroller)), max);
}

/** Card whose left edge sits closest to the snap line right now — used to resolve where a free scroll/drag actually landed. */
function nearestIndexByPosition(scroller: HTMLElement, cards: HTMLElement[]) {
  const snapX = scroller.getBoundingClientRect().left + scrollPaddingLeft(scroller);
  let best = 0;
  let bestDist = Infinity;
  cards.forEach((card, i) => {
    if (!card) return;
    const dist = Math.abs(card.getBoundingClientRect().left - snapX);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}

export function DesignStudies() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const activeRef = useRef(0);
  const isProgrammaticRef = useRef(false);
  const dragRef = useRef({ dragging: false, moved: false, startX: 0, startScrollLeft: 0, pointerId: -1 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [active, setActive] = useState<Study | null>(null);
  const reduceMotion = useReducedMotion();

  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth") => {
      const scroller = scrollerRef.current;
      const clamped = Math.max(0, Math.min(LAST_INDEX, index));
      const card = cardRefs.current[clamped];
      if (!scroller || !card) return;

      activeRef.current = clamped;
      setActiveIndex(clamped);
      isProgrammaticRef.current = true;
      scroller.scrollTo({ left: scrollLeftFor(scroller, card), behavior });
    },
    [reduceMotion]
  );

  // Detect the active card after any scroll we didn't drive ourselves — native trackpad/touch
  // panning over the carousel itself. We never touch the page's vertical scroll: the scroller
  // only reacts to horizontal gestures made directly on it (drag, touch swipe, trackpad pan,
  // or the arrow buttons), so scrolling the page up/down never moves the carousel.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let debounceTimer: number | undefined;
    const settle = () => {
      if (isProgrammaticRef.current) {
        isProgrammaticRef.current = false;
        return;
      }
      if (dragRef.current.dragging) return;
      const nearest = nearestIndexByPosition(scroller, cardRefs.current);
      if (nearest !== activeRef.current) {
        activeRef.current = nearest;
        setActiveIndex(nearest);
      }
    };

    const onScroll = () => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(settle, 120);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(debounceTimer);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Re-align to the current card after a viewport resize (card widths change across breakpoints).
  useEffect(() => {
    const onResize = () => goTo(activeRef.current, "auto");
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [goTo]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    dragRef.current = { dragging: true, moved: false, startX: e.clientX, startScrollLeft: scroller.scrollLeft, pointerId: e.pointerId };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const scroller = scrollerRef.current;
    if (!drag.dragging || !scroller) return;

    const dx = e.clientX - drag.startX;
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return;
      drag.moved = true;
      setIsDragging(true);
      scroller.style.scrollBehavior = "auto";
      try {
        scroller.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }

    scroller.scrollLeft = drag.startScrollLeft - dx;
  };

  const endDrag = () => {
    const drag = dragRef.current;
    const scroller = scrollerRef.current;
    if (!drag.dragging) return;

    if (scroller && drag.pointerId !== -1) {
      try {
        scroller.releasePointerCapture(drag.pointerId);
      } catch {
        /* ignore */
      }
    }

    const wasDragging = drag.moved;
    drag.dragging = false;

    if (scroller) scroller.style.scrollBehavior = "";
    if (wasDragging && scroller) {
      goTo(nearestIndexByPosition(scroller, cardRefs.current));
      window.setTimeout(() => setIsDragging(false), 0);
    }
  };

  const openStudy = (study: Study) => {
    if (dragRef.current.moved) return;
    setActive(study);
  };

  return (
    <section id="design-studies" className="relative bg-white py-16 sm:py-24 lg:py-32">
      <div className={`mx-auto max-w-7xl ${GUTTER}`}>
        <div className="max-w-2xl">
          <p className="section-label">Design Studies</p>
          <h2 className="mt-3 text-[28px] font-bold tracking-tight text-gray-900 sm:text-[36px] lg:text-[40px]">
            Studying Great Interfaces.
          </h2>
          <p className="mt-4 max-w-xl text-[14px] leading-[1.75] text-gray-500 sm:text-[16px] sm:leading-[1.8]">
            A curated set of landing pages and product interfaces.
            Built to practice craft, explore systems, and sharpen design judgment.
          </p>
        </div>
      </div>

      {/*
        Full-viewport scroller: inset padding matches the heading grid so card 0
        aligns with the title; cards bleed to the screen edges while scrolling.
      */}
      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`scrollbar-hide mt-10 flex w-full cursor-grab gap-8 overflow-x-auto scroll-smooth pb-1 active:cursor-grabbing sm:mt-12 lg:mt-14 ${BLEED_INSET} ${BLEED_SCROLL} ${
          isDragging ? "snap-none" : "snap-x snap-mandatory"
        }`}
      >
        {designStudies.map((study, i) => (
          <article
            key={study.id}
            ref={(el) => {
              if (el) cardRefs.current[i] = el;
            }}
            className="w-[min(85%,390px)] shrink-0 snap-start snap-always sm:w-[442px] lg:w-[494px]"
          >
            <button
              type="button"
              onClick={() => openStudy(study)}
              className="group block w-full text-left focus-visible:outline-none"
            >
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-[#e6e6e6] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)] group-focus-visible:ring-2 group-focus-visible:ring-[#0071e3]/35 group-focus-visible:ring-offset-2"
                style={{ background: study.accent }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={study.cardImage}
                  alt=""
                  draggable={false}
                  className="pointer-events-none h-full w-full object-cover object-top select-none"
                />
              </div>

              <div className="mt-3.5 flex items-center justify-between gap-3 sm:mt-4">
                <span className="min-w-0 truncate text-[15px] font-semibold tracking-tight text-gray-900 sm:text-[16px]">
                  {study.title}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[#0071e3] transition-opacity group-hover:opacity-70 sm:text-[14px]">
                  View
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    <path
                      d="M3 8H13M13 8L9 4M13 8L9 12"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </button>
          </article>
        ))}
      </div>

      <div className={`mx-auto mt-8 flex max-w-7xl justify-end gap-2 sm:mt-10 ${GUTTER}`}>
        <button
          type="button"
          aria-label="Previous study"
          disabled={activeIndex === 0}
          onClick={() => goTo(activeIndex - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6e6e6] bg-white text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#e6e6e6] disabled:hover:text-gray-400"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label="Next study"
          disabled={activeIndex === LAST_INDEX}
          onClick={() => goTo(activeIndex + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6e6e6] bg-white text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#e6e6e6] disabled:hover:text-gray-400"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <AnimatePresence>
        {active ? <StudySheet key={active.id} study={active} onClose={() => setActive(null)} /> : null}
      </AnimatePresence>
    </section>
  );
}
