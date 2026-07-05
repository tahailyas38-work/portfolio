"use client";

import { useEffect, useRef } from "react";

export function useCaseStudySnap(onSnapComplete?: () => void) {
  const lastSnapTime = useRef(0);
  const rafId = useRef(0);
  const isSnapping = useRef(false);
  const onSnapCompleteRef = useRef(onSnapComplete);
  const COOLDOWN = 680;

  useEffect(() => {
    onSnapCompleteRef.current = onSnapComplete;
  });

  useEffect(() => {
    const easeExpoOut = (t: number) =>
      t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

    function animateTo(target: number) {
      cancelAnimationFrame(rafId.current);
      isSnapping.current = true;

      const start = window.scrollY;
      const delta = target - start;

      if (Math.abs(delta) < 1) {
        isSnapping.current = false;
        onSnapCompleteRef.current?.();
        return;
      }

      const duration = 720;
      const startTime = performance.now();

      function tick(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        window.scrollTo(0, Math.round(start + delta * easeExpoOut(t)));
        if (t < 1) {
          rafId.current = requestAnimationFrame(tick);
        } else {
          isSnapping.current = false;
          onSnapCompleteRef.current?.();
        }
      }

      rafId.current = requestAnimationFrame(tick);
    }

    function getTargets(): number[] {
      const steps = document.querySelectorAll<HTMLElement>(".case-study-step");
      return Array.from(steps).map((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        return top + el.offsetHeight / 2 - window.innerHeight / 2;
      });
    }

    function isInZone(): boolean {
      const steps = document.querySelectorAll<HTMLElement>(".case-study-step");
      if (!steps.length) return false;
      const vh = window.innerHeight;
      return Array.from(steps).some((el) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        return center > vh * 0.1 && center < vh * 0.9;
      });
    }

    function onWheel(e: WheelEvent) {
      if (!isInZone()) return;
      const dy = e.deltaY;
      if (Math.abs(dy) < 8) return;

      const dir: 1 | -1 = dy > 0 ? 1 : -1;
      const targets = getTargets();
      if (!targets.length) return;

      const y = window.scrollY;
      const DEAD = 36;
      const hasNext = targets.some((t) => t > y + DEAD);
      const hasPrev = targets.some((t) => t < y - DEAD);

      if (dir > 0 && !hasNext) return;
      if (dir < 0 && !hasPrev) return;

      const now = Date.now();
      if (now - lastSnapTime.current < COOLDOWN) {
        e.preventDefault();
        return;
      }

      const target =
        dir > 0
          ? targets.find((t) => t > y + DEAD)!
          : [...targets].reverse().find((t) => t < y - DEAD)!;

      e.preventDefault();
      lastSnapTime.current = now;
      animateTo(target);
    }

    let touchStartY = 0;

    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }

    function onTouchEnd(e: TouchEvent) {
      if (!isInZone()) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 50) return;

      const dir: 1 | -1 = dy > 0 ? 1 : -1;
      const targets = getTargets();
      if (!targets.length) return;

      const y = window.scrollY;
      const DEAD = 36;
      if (dir > 0 && !targets.some((t) => t > y + DEAD)) return;
      if (dir < 0 && !targets.some((t) => t < y - DEAD)) return;

      const now = Date.now();
      if (now - lastSnapTime.current < COOLDOWN) return;
      lastSnapTime.current = now;

      const target =
        dir > 0
          ? targets.find((t) => t > y + DEAD)!
          : [...targets].reverse().find((t) => t < y - DEAD)!;

      animateTo(target);
    }

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return { isSnapping };
}
