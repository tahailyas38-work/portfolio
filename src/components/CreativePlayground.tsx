"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playgroundCategories, type PlaygroundSlide } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

type Category = (typeof playgroundCategories)[number];

const STACK_GAP = 36;
const BASE_SCALE = 0.88;
const SCALE_STEP = 0.04;
const CAROUSEL_MS = 3200;

function slideSrc(slide: PlaygroundSlide) {
  return typeof slide === "string" ? slide : slide.src;
}

function slideBg(slide: PlaygroundSlide | undefined) {
  if (!slide || typeof slide === "string") return undefined;
  return slide.bg;
}

function isLightHex(hex: string) {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return true;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

const CARD_THEMES = [
  {
    bg: "bg-white",
    border: "border-[#e6e6e6]",
    chip: "bg-[#0071e3] text-white",
    title: "text-gray-900",
    body: "text-gray-500",
    media: "bg-[#e8f1fb]",
    dot: "bg-black/25",
    dotActive: "bg-black/80",
  },
  {
    bg: "bg-[#0a0a0a]",
    border: "border-white/10",
    chip: "bg-white/15 text-white",
    title: "text-white",
    body: "text-white/60",
    media: "bg-[#0071e3]",
    dot: "bg-white/35",
    dotActive: "bg-white",
  },
  {
    bg: "bg-[#0071e3]",
    border: "border-[#0071e3]",
    chip: "bg-white/20 text-white",
    title: "text-white",
    body: "text-white/75",
    media: "bg-[#0a0a0a]",
    dot: "bg-white/35",
    dotActive: "bg-white",
  },
] as const;

function MediaCarousel({
  slides,
  mediaClass,
  dotClass,
  dotActiveClass,
  fit = "cover",
  pause,
}: {
  slides: PlaygroundSlide[];
  mediaClass: string;
  dotClass: string;
  dotActiveClass: string;
  fit?: "cover" | "contain";
  pause?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [underlay, setUnderlay] = useState(0);
  const [incomingOn, setIncomingOn] = useState(true);
  const activeRef = useRef(0);
  const swapLock = useRef(false);
  const swapTimer = useRef<number | null>(null);
  const goToRef = useRef<(next: number) => void>(() => {});
  const isContain = fit === "contain";
  const activeBg = slideBg(slides[active]);
  const lightDots = activeBg ? isLightHex(activeBg) : true;
  const hasSlideBgs = slides.some((s) => slideBg(s));

  activeRef.current = active;

  const finishSwap = (index: number) => {
    if (swapTimer.current != null) {
      window.clearTimeout(swapTimer.current);
      swapTimer.current = null;
    }
    setUnderlay(index);
    swapLock.current = false;
  };

  const goTo = (next: number) => {
    if (next === activeRef.current || swapLock.current) return;

    if (reduceMotion) {
      setActive(next);
      setUnderlay(next);
      setIncomingOn(true);
      return;
    }

    swapLock.current = true;
    setUnderlay(activeRef.current);
    setActive(next);
    setIncomingOn(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIncomingOn(true));
    });

    if (swapTimer.current != null) window.clearTimeout(swapTimer.current);
    swapTimer.current = window.setTimeout(() => finishSwap(next), 780);
  };

  goToRef.current = goTo;

  useEffect(() => {
    return () => {
      if (swapTimer.current != null) window.clearTimeout(swapTimer.current);
    };
  }, []);

  useEffect(() => {
    if (pause || reduceMotion || slides.length < 2) return;
    const id = window.setInterval(() => {
      goToRef.current((activeRef.current + 1) % slides.length);
    }, CAROUSEL_MS);
    return () => window.clearInterval(id);
  }, [pause, reduceMotion, slides.length]);

  if (slides.length === 0) {
    return (
      <div
        className={`relative h-full min-h-[11rem] overflow-hidden rounded-[18px] sm:min-h-0 sm:rounded-[20px] lg:rounded-[22px] ${mediaClass}`}
      />
    );
  }

  return (
    <div
      className={`relative h-full min-h-[11rem] overflow-hidden rounded-[18px] sm:min-h-0 sm:rounded-[20px] lg:rounded-[22px] ${
        hasSlideBgs ? "" : mediaClass
      }`}
    >
      {slides.map((slide, i) => {
        const src = slideSrc(slide);
        const bg = slideBg(slide);
        const on = i === active;
        const isUnder = i === underlay && i !== active;
        const show = on ? incomingOn : isUnder;
        return (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              on ? "z-[1]" : "z-0"
            } ${show ? "opacity-100" : "opacity-0"}`}
            style={bg ? { backgroundColor: bg } : undefined}
            aria-hidden={!on}
            onTransitionEnd={
              on
                ? (e) => {
                    if (e.propertyName !== "opacity" || !incomingOn) return;
                    finishSwap(active);
                  }
                : undefined
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className={`box-border h-full w-full object-center ${
                isContain ? "object-contain p-3 sm:p-5" : "object-cover"
              }`}
            />
          </div>
        );
      })}

      <div
        className="absolute inset-y-0 right-2.5 z-[2] flex flex-col items-center justify-center gap-1.5 sm:right-3 sm:gap-2"
        role="tablist"
        aria-label="Design previews"
      >
        {slides.map((_, i) => {
          const on = i === active;
          const dotTone = activeBg
            ? lightDots
              ? on
                ? "bg-black/80 scale-125"
                : "bg-black/25"
              : on
                ? "bg-white scale-125"
                : "bg-white/40"
            : on
              ? `${dotActiveClass} scale-125`
              : dotClass;

          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={on}
              aria-label={`Show design ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
              className={`h-1.5 w-1.5 rounded-full transition-[transform,background-color] duration-300 sm:h-2 sm:w-2 ${dotTone}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function CardFace({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const slides: PlaygroundSlide[] = category.slides?.length
    ? category.slides
    : category.cover
      ? [category.cover]
      : [];
  const fit = category.mediaFit ?? "cover";

  return (
    <div
      className={`absolute inset-0 overflow-hidden rounded-[22px] border shadow-[0_18px_40px_rgba(15,23,42,0.1)] sm:rounded-[26px] ${theme.bg} ${theme.border}`}
    >
      <div className="grid h-full grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-3 p-4 pb-5 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] sm:grid-rows-none sm:gap-5 sm:p-5 lg:gap-6 lg:p-6">
        <div className="flex min-w-0 flex-col justify-between gap-4 py-0.5 sm:gap-6 sm:py-2 lg:py-3">
          <span
            className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] sm:text-[12px] ${theme.chip}`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div>
            <h3
              className={`text-[1.65rem] font-bold tracking-tight sm:text-[1.9rem] lg:text-[2.15rem] ${theme.title}`}
            >
              {category.title}
            </h3>
            <p
              className={`mt-2.5 max-w-md text-[14px] leading-relaxed sm:mt-3 sm:text-[15px] sm:leading-[1.7] lg:text-[16px] ${theme.body}`}
            >
              {category.description}
            </p>
          </div>
        </div>

        <div className="min-h-0">
          <MediaCarousel
            slides={slides}
            fit={fit}
            mediaClass={theme.media}
            dotClass={theme.dot}
            dotActiveClass={theme.dotActive}
          />
        </div>
      </div>
    </div>
  );
}

export function CreativePlayground({ ready = true }: { ready?: boolean }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const count = playgroundCategories.length;

  useEffect(() => {
    if (!ready || reduceMotion) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!section || !pin || cards.length === 0) return;

    const applyProgress = (p: number) => {
      const revealed = 1 + p * (count - 1);
      const frame = pin.querySelector("[data-stack-frame]") as HTMLElement | null;
      const cardH = frame?.offsetHeight ?? 420;

      cards.forEach((card, i) => {
        const targetScale = BASE_SCALE + i * SCALE_STEP;
        const stackY = i * STACK_GAP;

        if (revealed <= i) {
          gsap.set(card, {
            y: cardH + 48,
            scale: 1,
            opacity: revealed > i - 0.4 ? 1 : 0,
            zIndex: i + 1,
            transformOrigin: "top center",
          });
        } else if (revealed < i + 1) {
          const t = revealed - i;
          gsap.set(card, {
            y: gsap.utils.interpolate(cardH + 48, stackY, t),
            scale: gsap.utils.interpolate(1, targetScale, t),
            opacity: 1,
            zIndex: i + 1,
            transformOrigin: "top center",
          });
        } else {
          gsap.set(card, {
            y: stackY,
            scale: targetScale,
            opacity: 1,
            zIndex: i + 1,
            transformOrigin: "top center",
          });
        }
      });
    };

    applyProgress(0);

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${Math.round(window.innerHeight * count * 0.9)}`,
      pin: pin,
      scrub: 0.45,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => applyProgress(self.progress),
    });

    const onResize = () => {
      applyProgress(st.progress);
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      st.kill();
      cards.forEach((card) => gsap.set(card, { clearProps: "all" }));
    };
  }, [ready, reduceMotion, count]);

  return (
    <section id="creative-playground" ref={sectionRef} className="relative">
      <div
        ref={pinRef}
        className="flex min-h-screen flex-col justify-start pt-4 pb-10 sm:pb-12 lg:pb-14"
      >
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="section-label">Creative Playground</p>
            <h2 className="mt-2 max-w-2xl text-[1.75rem] font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-[2rem] lg:text-[2.5rem]">
              Beyond Product Design.
            </h2>
            <p className="mt-3 max-w-xl text-[13px] leading-[1.75] text-gray-500 lg:text-[15px]">
              A collection of visual experiments, illustrations, graphic design, and creative work
              I&apos;ve explored outside of product design.
            </p>
          </div>

          <div className="relative mt-8 sm:mt-10 lg:mt-12">
            {reduceMotion || !ready ? (
              <div className="flex flex-col gap-4 sm:gap-5">
                {playgroundCategories.map((cat, i) => (
                  <div
                    key={cat.id}
                    className="relative h-[min(24rem,56vh)] overflow-hidden rounded-[22px] sm:h-[min(26rem,56vh)] sm:rounded-[26px]"
                  >
                    <CardFace category={cat} index={i} />
                  </div>
                ))}
              </div>
            ) : (
              <div
                data-stack-frame
                className="relative mx-auto w-full"
                style={{ height: "min(26rem, 56vh)" }}
              >
                {playgroundCategories.map((cat, i) => (
                  <div
                    key={cat.id}
                    ref={(el) => {
                      cardsRef.current[i] = el;
                    }}
                    className="absolute inset-x-0 top-0 will-change-transform"
                    style={{ height: "100%" }}
                  >
                    <CardFace category={cat} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
