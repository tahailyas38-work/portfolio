export function BackgroundDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Soft curvy lines — primary blue at very low opacity */}
        <path
          d="M -80 200 Q 360 20 720 220 Q 1080 420 1520 180"
          stroke="#0071e3"
          strokeWidth="1.5"
          fill="none"
          opacity="0.06"
          strokeLinecap="round"
        />
        <path
          d="M -80 420 Q 280 260 640 440 Q 1000 620 1520 380"
          stroke="#0071e3"
          strokeWidth="1"
          fill="none"
          opacity="0.04"
          strokeLinecap="round"
        />
        <path
          d="M -80 680 Q 400 500 800 700 Q 1100 860 1520 620"
          stroke="#0071e3"
          strokeWidth="1.5"
          fill="none"
          opacity="0.05"
          strokeLinecap="round"
        />
        <path
          d="M 200 -40 Q 360 300 180 600 Q 40 850 300 980"
          stroke="#0071e3"
          strokeWidth="1"
          fill="none"
          opacity="0.04"
          strokeLinecap="round"
        />
        <path
          d="M 1100 -40 Q 1300 200 1200 500 Q 1080 780 1360 960"
          stroke="#0071e3"
          strokeWidth="1"
          fill="none"
          opacity="0.035"
          strokeLinecap="round"
        />
        {/* Subtle closed arcs */}
        <ellipse cx="200" cy="150" rx="280" ry="120" stroke="#0071e3" strokeWidth="1" fill="none" opacity="0.03" />
        <ellipse cx="1240" cy="750" rx="240" ry="100" stroke="#0071e3" strokeWidth="1" fill="none" opacity="0.03" />
      </svg>
    </div>
  );
}
