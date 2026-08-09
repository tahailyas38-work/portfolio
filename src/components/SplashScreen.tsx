"use client";

import { useEffect, useRef, useState } from "react";
import { AvatarImage } from "@/components/AvatarImage";

/**
 * Splash: avatar color-fills top → bottom over ~2s, then fades into the site.
 */
export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fill, setFill] = useState(0);
  const [phase, setPhase] = useState<"fill" | "hold" | "out">("fill");
  const [gone, setGone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Ease-out so the last bits of color land softly
      const eased = 1 - Math.pow(1 - t, 2.4);
      setFill(eased * 100);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase("hold");
        window.setTimeout(() => setPhase("out"), 280);
        window.setTimeout(() => {
          setGone(true);
          onDoneRef.current();
        }, 280 + 650);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;

  const fading = phase === "out";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#080808]"
      style={{
        opacity: fading ? 0 : 1,
        transition: fading ? "opacity 0.65s cubic-bezier(0.4,0,0.2,1)" : "none",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <div className="relative h-[88px] w-[72px] sm:h-[100px] sm:w-[82px]">
        {/* Desaturated base — “empty” waiting to fill */}
        <AvatarImage
          variant="splash"
          priority
          className="absolute inset-0 opacity-25 grayscale"
        />
        {/* Full-color reveal, clipped top → bottom */}
        <AvatarImage
          variant="splash"
          priority
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 0 ${100 - fill}% 0)`,
            WebkitClipPath: `inset(0 0 ${100 - fill}% 0)`,
          }}
        />
      </div>
    </div>
  );
}
