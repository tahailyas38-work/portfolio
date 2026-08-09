"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MagneticButton } from "@/components/MagneticButton";
import { TalkToTahaCTA } from "@/components/TalkToTaha";
import { AvatarImage } from "@/components/AvatarImage";
import { HeroClientBar } from "@/components/HeroClientBar";
import StrokeText from "@/components/StrokeText";

const SplashCursor = dynamic(() => import("@/components/SplashCursor"), {
  ssr: false,
});

/**
 * Reference composition (light theme):
 * - One centered stack filling the viewport
 * - Giant THINK / CREATIVELY with memoji floating over the center
 * - Subtext LEFT + CTAs RIGHT on the same row, tucked under the type
 * - Same page grid as the navbar: max-w-7xl + px-6 lg:px-10
 *
 * Entrance: heading stroke→fill → subtext+CTAs → avatar → top nav
 */
export function Hero({
  splashDone,
  onReady,
}: {
  splashDone: boolean;
  onReady?: () => void;
}) {
  const [showBackground, setShowBackground] = useState(false);
  const [showHeading, setShowHeading] = useState(false);
  const [headingComplete, setHeadingComplete] = useState(false);
  const [showFace, setShowFace] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);
  const [showCtas, setShowCtas] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const stageRef = useRef<HTMLElement>(null);
  const faceLayerRef = useRef<HTMLDivElement>(null);
  const faceInnerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(false);
  const hoverAmtRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!splashDone) return;
    document.documentElement.classList.add("scroll-locked");

    // 1) Background + heading stroke animation
    const tBg = setTimeout(() => setShowBackground(true), 40);
    const tHeading = setTimeout(() => setShowHeading(true), 120);
    const tClients = setTimeout(() => setShowClients(true), 800);
    // Fallback if stroke measurement/animation never completes
    const tFallback = setTimeout(() => setHeadingComplete(true), 4200);

    return () => {
      [tBg, tHeading, tClients, tFallback].forEach(clearTimeout);
      document.documentElement.classList.remove("scroll-locked");
    };
  }, [splashDone]);
  // After heading stroke→fill: subtext+CTAs → avatar → nav
  useEffect(() => {
    if (!headingComplete) return;

    const tCopy = setTimeout(() => {
      setShowSubtext(true);
      setShowCtas(true);
    }, 180);
    const tFace = setTimeout(() => setShowFace(true), 720);
    const tNav = setTimeout(() => onReady?.(), 1280);
    const tUnlock = setTimeout(() => {
      document.documentElement.classList.remove("scroll-locked");
    }, 1600);

    return () => {
      [tCopy, tFace, tNav, tUnlock].forEach(clearTimeout);
    };
  }, [headingComplete, onReady]);

  const onHeadingComplete = useCallback(() => {
    setHeadingComplete(true);
  }, []);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const desktopMq = window.matchMedia("(min-width: 640px)");

    const tick = () => {
      const cur = currentRef.current;
      const target = targetRef.current;
      cur.x += (target.x - cur.x) * 0.1;
      cur.y += (target.y - cur.y) * 0.1;

      hoverAmtRef.current += ((hoverRef.current ? 1 : 0) - hoverAmtRef.current) * 0.12;

      const hover = hoverAmtRef.current;
      const move = 1 + hover * 0.85;
      const scale = 1 + hover * 0.07;

      const el = faceLayerRef.current;
      if (el) {
        if (desktopMq.matches) {
          el.style.transform = [
            `translate3d(calc(-50% + ${cur.x * 28 * move}px), calc(-50% + ${cur.y * 18 * move}px), 0)`,
            `rotateX(${cur.y * -9 * move}deg)`,
            `rotateY(${cur.x * 12 * move}deg)`,
            `scale(${scale})`,
          ].join(" ");
        } else {
          el.style.transform = "";
        }
      }

      const inner = faceInnerRef.current;
      if (inner) {
        inner.style.filter = desktopMq.matches
          ? `drop-shadow(0 ${24 + hover * 16}px ${36 + hover * 20}px rgba(15, 23, 42, ${0.18 + hover * 0.14}))`
          : "drop-shadow(0 16px 28px rgba(15, 23, 42, 0.16))";
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    targetRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  }, []);

  const onLeave = useCallback(() => {
    targetRef.current = { x: 0, y: 0 };
    hoverRef.current = false;
  }, []);

  const onFaceEnter = useCallback(() => {
    hoverRef.current = true;
  }, []);

  const onFaceLeave = useCallback(() => {
    hoverRef.current = false;
  }, []);

  const onFaceMove = useCallback((e: React.MouseEvent) => {
    const el = faceInnerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    targetRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2.4,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2.4,
    };
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={stageRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="snap-section-hero relative overflow-hidden bg-white"
    >
      {/* First viewport only — client bar lives just below the fold */}
      <div className="relative flex min-h-[100svh] flex-col">
        {splashDone && !reduceMotion ? (
          <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
            <SplashCursor COLOR="#0071e3" RAINBOW_MODE={false} />
          </div>
        ) : null}

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-0 ${showBackground ? "hero-bg-enter" : "opacity-0"}`}
        >
          <div className="absolute inset-0 bg-white" />
          <div
            className="absolute left-1/2 top-[42%] h-[min(55vmin,440px)] w-[min(55vmin,440px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(0,113,227,0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 pb-8 pt-[88px] sm:pt-[88px] lg:px-10 lg:pb-10 lg:pt-[96px]">
          <div className="relative mx-auto flex w-full flex-col items-center sm:-translate-y-[min(3vh,1.75rem)]">
            {/* Type + face lockup — stacked on mobile, overlapping on sm+ */}
            <div className="relative flex w-full flex-col items-center">
              <h1
                className="pointer-events-none relative z-0 w-full select-none text-center font-hero font-bold uppercase [--hero-creatively-size:clamp(5.25rem,21vw,8.75rem)] [--hero-think-size:clamp(7.25rem,28vw,12rem)] sm:[--hero-creatively-size:clamp(6.825rem,22.1vw,16.9rem)] sm:[--hero-think-size:clamp(9.425rem,28.6vw,21.45rem)]"
              >
                {showHeading ? (
                  <>
                    <StrokeText
                      text="THINK"
                      strokeColor="#0a0a0a"
                      fillColor="#0a0a0a"
                      strokeWidth={1.8}
                      drawDuration={1.35}
                      fillDelay={0.12}
                      stagger={0.045}
                      ease="power2.out"
                      trigger="mount"
                      fillMode="wipe"
                      fontSize={343}
                      fontWeight={700}
                      letterSpacing={-17}
                      className="hero-stroke-think"
                      style={
                        {
                          "--stroke-text-height": "var(--hero-think-size)",
                        } as React.CSSProperties
                      }
                    />
                    <StrokeText
                      text="CREATIVELY"
                      strokeColor="#0071e3"
                      fillColor="#0071e3"
                      fillGradient={["#005bb8", "#0071e3", "#3d9bff"]}
                      strokeWidth={1.7}
                      drawDuration={1.45}
                      fillDelay={0.15}
                      stagger={0.04}
                      ease="power2.out"
                      trigger="mount"
                      fillMode="wipe"
                      fontSize={270}
                      fontWeight={700}
                      letterSpacing={-8}
                      className="hero-stroke-creatively"
                      style={
                        {
                          "--stroke-text-height": "var(--hero-creatively-size)",
                        } as React.CSSProperties
                      }
                      onComplete={onHeadingComplete}
                    />
                  </>
                ) : (
                  <span
                    className="block"
                    style={{
                      minHeight:
                        "calc(var(--hero-think-size) * 0.76 + var(--hero-creatively-size) * 0.76)",
                    }}
                    aria-hidden="true"
                  />
                )}
              </h1>

              {/* Memoji — in-flow below heading on mobile; absolute overlay on sm+ */}
              <div
                ref={faceLayerRef}
                className="pointer-events-none relative z-10 -mt-1 will-change-transform [perspective:900px] sm:absolute sm:left-1/2 sm:top-[80%] sm:mt-0"
                style={{
                  opacity: showFace ? 1 : 0,
                  transition: "opacity 0.7s ease 0.05s",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  ref={faceInnerRef}
                  onMouseEnter={onFaceEnter}
                  onMouseLeave={onFaceLeave}
                  onMouseMove={onFaceMove}
                  className="hero-face-float pointer-events-auto relative mx-auto h-[min(78vw,300px)] w-[min(64vw,250px)] sm:h-[380px] sm:w-[300px] lg:h-[450px] lg:w-[350px] xl:h-[500px] xl:w-[390px]"
                >
                  <AvatarImage
                    variant="hero"
                    alt="Taha Madni"
                    priority
                    className="hero-face-bust pointer-events-none absolute inset-0 select-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex w-full flex-col items-center gap-4 text-center sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:text-left lg:mt-12">
              <p
                className="mx-auto max-w-[300px] text-[15px] leading-[1.55] text-gray-500 sm:mx-0 sm:max-w-[340px] sm:text-[16px] sm:leading-[1.55] lg:text-[17px]"
                style={{
                  opacity: showSubtext ? 1 : 0,
                  transform: showSubtext ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 0.6s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                I create enterprise systems, consumer products, and AI-powered experiences that make
                complexity feel simple.
              </p>

              <div
                className="flex flex-wrap items-center justify-center gap-3 sm:shrink-0 sm:justify-end"
                style={{
                  opacity: showCtas ? 1 : 0,
                  transform: showCtas ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 0.6s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <MagneticButton
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#contact");
                  }}
                  variant="primary"
                  className="px-6 py-3 lg:px-7 lg:py-3.5"
                >
                  Let&apos;s Connect
                </MagneticButton>
                <TalkToTahaCTA />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative z-10 w-full"
        style={{
          opacity: showClients ? 1 : 0,
          transform: showClients ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <HeroClientBar />
      </div>
    </section>
  );
}
