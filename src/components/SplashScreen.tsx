"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Phase = "black" | "logo-in" | "hold" | "fade-out";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("black");
  const [gone, setGone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    // Runs once on mount — stable timers, no re-firing on prop change
    const t0 = setTimeout(() => setPhase("logo-in"), 120);
    const t1 = setTimeout(() => setPhase("hold"), 850);
    const t2 = setTimeout(() => setPhase("fade-out"), 1550);
    const t3 = setTimeout(() => {
      setGone(true);
      onDoneRef.current();
    }, 2250);
    return () => [t0, t1, t2, t3].forEach(clearTimeout);
  }, []); // intentionally empty — runs once

  if (gone) return null;

  const fading = phase === "fade-out";
  const logoVisible = phase === "logo-in" || phase === "hold";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        backgroundColor: "#080808",
        opacity: fading ? 0 : 1,
        transition: fading ? "opacity 0.7s cubic-bezier(0.4,0,0.2,1)" : "none",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <div
        style={{
          opacity: logoVisible ? 1 : 0,
          transform: logoVisible ? "scale(1)" : phase === "black" ? "scale(0.84)" : "scale(1.08)",
          transition: "opacity 0.55s ease, transform 0.6s ease",
        }}
      >
        <Image
          src="/logo-white.png"
          alt="Taha"
          width={200}
          height={50}
          className="h-12 w-auto"
          priority
        />
      </div>
    </div>
  );
}
