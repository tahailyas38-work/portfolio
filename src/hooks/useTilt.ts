"use client";

import { useCallback, useRef, useState } from "react";

export function useTilt(maxTilt = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [pressed, setPressed] = useState(false);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el || pressed) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - y) * maxTilt * 2;
      setTransform(
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`
      );
      setGlow({ x: x * 100, y: y * 100 });
    },
    [maxTilt, pressed]
  );

  const onPointerLeave = useCallback(() => {
    if (pressed) return;
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
    setGlow({ x: 50, y: 50 });
  }, [pressed]);

  const onPointerDown = useCallback(() => {
    setPressed(true);
    setTransform("perspective(900px) rotateX(4deg) rotateY(0deg) scale3d(0.97,0.97,0.97) translateZ(-12px)");
  }, []);

  const onPointerUp = useCallback(() => {
    setPressed(false);
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
  }, []);

  return { ref, transform, glow, onPointerMove, onPointerLeave, onPointerDown, onPointerUp };
}
