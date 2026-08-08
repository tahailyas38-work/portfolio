"use client";

import { useEffect, useRef } from "react";

const clientAvatars = [
  { initials: "AM", tone: "#E8F1FF", ink: "#3B6FB8" },
  { initials: "SK", tone: "#FFF0E8", ink: "#C46A3A" },
  { initials: "JR", tone: "#EEF8F1", ink: "#3D8A5A" },
  { initials: "NL", tone: "#F3EEFF", ink: "#6B5BA8" },
  { initials: "TH", tone: "#EEF2F7", ink: "#4A5568" },
] as const;

const barLogos = [
  { name: "Zameen", src: "/brands/zameen.svg", className: "h-[18px] sm:h-5" },
  { name: "Bayut", src: "/brands/bayut.svg", className: "h-[18px] sm:h-5" },
  { name: "Investors Hub", src: "/brands/investors-hub.svg", className: "h-[18px] sm:h-5" },
  { name: "OLX", src: "/brands/olx.svg", className: "h-4 sm:h-[18px]" },
  { name: "Hatla2ee", src: "/brands/hatla2ee.png", className: "h-5 sm:h-6" },
  { name: "dubizzle", src: "/brands/dubizzle.svg", className: "h-3.5 sm:h-4" },
  { name: "SMD", src: "/brands/smd.png", className: "h-5 sm:h-6" },
] as const;

function Star() {
  return (
    <svg
      viewBox="0 0 256 256"
      className="h-[11px] w-[11px] sm:h-3 sm:w-3"
      fill="#0071e3"
      aria-hidden="true"
    >
      <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
    </svg>
  );
}

/**
 * Flat social-proof strip:
 * avatars + stars + label on the left, muted logo ticker on the right —
 * stacks cleanly on mobile.
 */
export function HeroClientBar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const measure = () => {
      loopWidthRef.current = track.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    if (reduce) {
      return () => ro.disconnect();
    }

    let raf = 0;
    const tick = () => {
      const loop = loopWidthRef.current;
      if (loop > 0) {
        offsetRef.current -= 0.75;
        if (offsetRef.current <= -loop) offsetRef.current += loop;
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const logos = [...barLogos, ...barLogos];

  return (
    <div className="w-full border-y border-[#eaeaea] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-0 sm:flex-row sm:items-center sm:gap-8 sm:px-6 sm:py-6 lg:gap-10 lg:px-10">
        {/* Happy clients */}
        <div className="flex w-full shrink-0 items-center justify-center gap-3 px-6 pt-4 pb-0 sm:w-auto sm:justify-start sm:gap-3.5 sm:px-0 sm:py-0">
          <div className="flex items-center" aria-hidden="true">
            {clientAvatars.map((a, i) => (
              <div
                key={a.initials}
                className="relative flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold tracking-tight ring-[2px] ring-white sm:h-[34px] sm:w-[34px]"
                style={{
                  backgroundColor: a.tone,
                  color: a.ink,
                  marginLeft: i === 0 ? 0 : -11,
                  zIndex: clientAvatars.length - i,
                }}
              >
                {a.initials}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} />
              ))}
            </div>
            <p className="whitespace-nowrap text-[13px] font-medium tracking-tight text-[#8a8a8a]">
              99+ Happy clients
            </p>
          </div>
        </div>

        {/* Logos */}
        <div className="hero-client-logos relative min-h-[52px] w-full min-w-0 flex-1 overflow-hidden py-4 sm:min-h-0 sm:w-auto sm:py-0">
          <div
            ref={trackRef}
            className="flex h-full w-max items-center gap-10 sm:gap-14 lg:gap-[57px]"
            style={{ willChange: "transform" }}
          >
            {logos.map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex shrink-0 items-center opacity-[0.45] grayscale"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  draggable={false}
                  className={`w-auto select-none object-contain object-center ${logo.className}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
