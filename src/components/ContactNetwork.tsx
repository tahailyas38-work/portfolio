"use client";

/**
 * Sparse ambient dots for the Contact card.
 * Intentionally minimal — soft glow points, no mesh or connections.
 */
const DOTS = [
  { left: "58%", top: "22%", size: 3, delay: "0s", duration: "9s", opacity: 0.55 },
  { left: "72%", top: "38%", size: 2, delay: "1.2s", duration: "11s", opacity: 0.4 },
  { left: "84%", top: "28%", size: 2.5, delay: "2.4s", duration: "10s", opacity: 0.5 },
  { left: "64%", top: "58%", size: 2, delay: "0.6s", duration: "12s", opacity: 0.35 },
  { left: "78%", top: "68%", size: 3.5, delay: "3s", duration: "8.5s", opacity: 0.45 },
  { left: "90%", top: "52%", size: 2, delay: "1.8s", duration: "13s", opacity: 0.3 },
  { left: "54%", top: "74%", size: 2.5, delay: "2.1s", duration: "10.5s", opacity: 0.38 },
] as const;

export function ContactNetwork() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {DOTS.map((dot, i) => (
        <span
          key={i}
          className="contact-dot absolute rounded-full"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
            animationDelay: dot.delay,
            animationDuration: dot.duration,
            boxShadow: `0 0 ${dot.size * 4}px ${dot.size}px rgba(120, 160, 255, 0.35)`,
            background: "rgba(186, 214, 255, 0.9)",
          }}
        />
      ))}
    </div>
  );
}
