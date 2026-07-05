"use client";

import { useEffect, useRef } from "react";

type Mouse = { x: number; y: number };

const PRIMARY = { r: 0, g: 113, b: 227 };
const ACCENT = { r: 255, g: 121, b: 27 };
const NODE_COUNT = 32;
const CONNECT_DIST = 150;
const MOUSE_RADIUS = 200;

type Node = {
  x: number;
  y: number;
  bx: number;
  by: number;
  vx: number;
  vy: number;
  radius: number;
  accent: boolean;
  phase: number;
};

function initNodes(w: number, h: number): Node[] {
  return Array.from({ length: NODE_COUNT }, (_, i) => {
    const bx = ((i * 73 + 17) % 1000) / 1000;
    const by = ((i * 131 + 41) % 1000) / 1000;
    return {
      x: bx * w,
      y: by * h,
      bx,
      by,
      vx: (Math.sin(i * 2.1) * 0.35),
      vy: (Math.cos(i * 1.7) * 0.35),
      radius: 1.8 + (i % 3) * 0.6,
      accent: i % 9 === 0,
      phase: i * 0.65,
    };
  });
}

export function ContactNetwork({ mouse }: { mouse: Mouse }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef(mouse);
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let time = 0;
    let frameId = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (nodesRef.current.length === 0) {
        nodesRef.current = initNodes(w, h);
      } else {
        for (const node of nodesRef.current) {
          node.x = node.bx * w;
          node.y = node.by * h;
        }
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    const draw = () => {
      const nodes = nodesRef.current;
      const { x: mxPct, y: myPct } = mouseRef.current;
      const mx = (mxPct / 100) * w;
      const my = (myPct / 100) * h;

      ctx.clearRect(0, 0, w, h);

      if (!reducedMotion) time += 0.007;

      for (const node of nodes) {
        if (reducedMotion) {
          node.x = node.bx * w;
          node.y = node.by * h;
        } else {
          node.x += node.vx + Math.sin(time + node.phase) * 0.18;
          node.y += node.vy + Math.cos(time * 0.85 + node.phase) * 0.14;

          if (node.x < 8 || node.x > w - 8) node.vx *= -1;
          if (node.y < 8 || node.y > h - 8) node.vy *= -1;
          node.x = Math.max(8, Math.min(w - 8, node.x));
          node.y = Math.max(8, Math.min(h - 8, node.y));

          const dx = mx - node.x;
          const dy = my - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_RADIUS && dist > 1) {
            const pull = (1 - dist / MOUSE_RADIUS) * 1.1;
            node.x += (dx / dist) * pull;
            node.y += (dy / dist) * pull;
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist >= CONNECT_DIST) continue;

          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const mouseDist = Math.hypot(midX - mx, midY - my);
          const nearMouse = mouseDist < MOUSE_RADIUS ? (1 - mouseDist / MOUSE_RADIUS) * 0.35 : 0;
          const alpha = (1 - dist / CONNECT_DIST) * 0.28 + nearMouse;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${PRIMARY.r}, ${PRIMARY.g}, ${PRIMARY.b}, ${alpha})`;
          ctx.lineWidth = nearMouse > 0.1 ? 1.25 : 0.75;
          ctx.stroke();
        }
      }

      const nearest = [...nodes]
        .sort((a, b) => Math.hypot(a.x - mx, a.y - my) - Math.hypot(b.x - mx, b.y - my))
        .slice(0, 4);

      for (const node of nearest) {
        const dist = Math.hypot(node.x - mx, node.y - my);
        if (dist >= MOUSE_RADIUS * 1.15) continue;
        const alpha = 0.22 * (1 - dist / (MOUSE_RADIUS * 1.15));
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = `rgba(${PRIMARY.r}, ${PRIMARY.g}, ${PRIMARY.b}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 7]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const glow = ctx.createRadialGradient(mx, my, 0, mx, my, MOUSE_RADIUS * 1.1);
      glow.addColorStop(0, "rgba(0, 113, 227, 0.14)");
      glow.addColorStop(0.45, "rgba(0, 113, 227, 0.05)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const accentGlow = ctx.createRadialGradient(mx, my, 0, mx, my, MOUSE_RADIUS * 0.45);
      accentGlow.addColorStop(0, "rgba(255, 121, 27, 0.06)");
      accentGlow.addColorStop(1, "transparent");
      ctx.fillStyle = accentGlow;
      ctx.fillRect(0, 0, w, h);

      for (const node of nodes) {
        const dist = Math.hypot(node.x - mx, node.y - my);
        const highlight = dist < MOUSE_RADIUS ? (1 - dist / MOUSE_RADIUS) : 0;
        const pulse = reducedMotion ? 0 : Math.sin(time * 2 + node.phase) * 0.08;
        const rgb = node.accent ? ACCENT : PRIMARY;
        const alpha = 0.32 + highlight * 0.5 + pulse;
        const r = node.radius + highlight * 2;

        if (highlight > 0.3) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2);
          ctx.fillStyle = node.accent
            ? `rgba(255, 121, 27, ${highlight * 0.15})`
            : `rgba(0, 113, 227, ${highlight * 0.2})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        ctx.fill();
      }

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
