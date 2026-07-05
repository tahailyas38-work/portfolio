"use client";

import { useEffect, useRef, useState } from "react";
import { howIWorkSteps } from "@/lib/data";

export function HowIWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(el);

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const sectionH = el.offsetHeight - window.innerHeight;
      if (sectionH <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), sectionH);
      setProgress(scrolled / sectionH);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const activeIndex = Math.min(
    Math.floor(progress * howIWorkSteps.length),
    howIWorkSteps.length - 1
  );

  return (
    <section id="how-i-work" ref={sectionRef} className="snap-section py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="section-label mb-4">How I Work</p>
        <h2 className="text-[2.5rem] font-bold tracking-tight text-gray-900">
          From research to ship
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-[1.75] text-gray-500">
          A repeatable process that keeps work focused, fast, and user-centred.
        </p>

        <div className="relative mt-16">
          {/* Progress line — desktop */}
          <div className="absolute left-0 top-6 hidden h-0.5 w-full bg-[#e6e6e6] lg:block">
            <div
              className="h-full bg-[#0071e3] transition-all duration-300 ease-out"
              style={{ width: `${(activeIndex / (howIWorkSteps.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {howIWorkSteps.map((item, i) => {
              const isActive = visible && i <= activeIndex;
              return (
                <div
                  key={item.step}
                  className="relative transition-all duration-500"
                  style={{
                    opacity: isActive ? 1 : 0.35,
                    transform: isActive ? "translateY(0)" : "translateY(8px)",
                  }}
                >
                  {/* Step dot */}
                  <div className="mb-4 flex items-center gap-3 lg:flex-col lg:items-start lg:gap-0">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold transition-all duration-500 ${
                        isActive
                          ? "border-[#0071e3] bg-[#0071e3] text-white shadow-md shadow-[#0071e3]/25"
                          : "border-[#e6e6e6] bg-white text-gray-400"
                      }`}
                    >
                      {i + 1}
                    </div>
                    {i < howIWorkSteps.length - 1 && (
                      <div className="h-px flex-1 bg-[#e6e6e6] lg:hidden" />
                    )}
                  </div>
                  <h3 className="text-[17px] font-bold text-gray-900">{item.step}</h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-gray-500">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
