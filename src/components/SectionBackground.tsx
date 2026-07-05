"use client";

type Variant = "tools" | "quote";

export function SectionBackground({ variant }: { variant: Variant }) {
  if (variant === "tools") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-b from-[#f5f9ff] via-white to-[#f5f9ff]">
        {/* Soft mesh blobs */}
        <div className="animate-hero-orb-a absolute -left-[10%] top-[15%] h-[480px] w-[480px] rounded-full bg-[#0071e3]/[0.07] blur-[90px]" />
        <div className="animate-hero-orb-b absolute -right-[8%] top-[40%] h-[400px] w-[400px] rounded-full bg-[#0071e3]/[0.05] blur-[80px]" />
        <div className="animate-hero-orb-c absolute bottom-[10%] left-[35%] h-[320px] w-[320px] rounded-full bg-[#0071e3]/[0.04] blur-[70px]" />

        {/* Concentric rings — design-system motif */}
        <svg className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]" viewBox="0 0 600 600">
          <circle cx="300" cy="300" r="80" fill="none" stroke="#0071e3" strokeWidth="1" />
          <circle cx="300" cy="300" r="160" fill="none" stroke="#0071e3" strokeWidth="0.75" strokeDasharray="4 8" />
          <circle cx="300" cy="300" r="240" fill="none" stroke="#0071e3" strokeWidth="0.5" strokeDasharray="2 12" />
        </svg>

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,113,227,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Workflow connector lines */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.08]" preserveAspectRatio="none" viewBox="0 0 1200 400">
          <defs>
            <linearGradient id="tools-flow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0071e3" stopOpacity="0" />
              <stop offset="40%" stopColor="#0071e3" stopOpacity="1" />
              <stop offset="60%" stopColor="#0071e3" stopOpacity="1" />
              <stop offset="100%" stopColor="#0071e3" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 200 H1200" stroke="url(#tools-flow)" strokeWidth="1" className="animate-flow-pulse" />
          <path d="M0 120 Q300 80 600 120 T1200 100" fill="none" stroke="url(#tools-flow)" strokeWidth="1" className="animate-flow-pulse [animation-delay:0.8s]" />
          <path d="M0 280 Q400 320 800 260 T1200 300" fill="none" stroke="url(#tools-flow)" strokeWidth="1" className="animate-flow-pulse [animation-delay:1.6s]" />
          {[150, 400, 650, 900, 1050].map((x) => (
            <circle key={x} cx={x} cy="200" r="3" fill="#0071e3" opacity="0.5" />
          ))}
        </svg>

        {/* Edge vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-80" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-br from-[#fafcff] via-white to-[#fff8f3]">
      {/* Giant watermark quote */}
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 select-none font-serif text-[28rem] leading-none text-[#0071e3]/[0.04]">
        &ldquo;
      </div>
      <div className="absolute -right-12 bottom-[5%] select-none font-serif text-[20rem] leading-none text-[#0071e3]/[0.03] rotate-180">
        &ldquo;
      </div>

      {/* Warm + cool gradient orbs */}
      <div className="animate-hero-orb-a absolute left-[15%] top-[20%] h-[360px] w-[360px] rounded-full bg-[#0071e3]/[0.05] blur-[80px]" />
      <div className="animate-hero-orb-b absolute right-[10%] bottom-[15%] h-[300px] w-[300px] rounded-full bg-[#ff791b]/[0.04] blur-[70px]" />

      {/* Horizontal rules */}
      <div className="absolute left-[10%] right-[10%] top-[30%] h-px bg-gradient-to-r from-transparent via-[#0071e3]/10 to-transparent" />
      <div className="absolute left-[15%] right-[15%] bottom-[28%] h-px bg-gradient-to-r from-transparent via-[#ff791b]/10 to-transparent" />

      {/* Subtle texture dots */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,113,227,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
