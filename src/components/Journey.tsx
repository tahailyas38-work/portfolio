"use client";

import { useEffect, useRef } from "react";
import { journey } from "@/lib/data";

function JourneyRow({
  item,
  index,
  isCurrent,
}: {
  item: (typeof journey)[0];
  index: number;
  isCurrent: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className="group relative"
      style={{
        opacity: 0,
        transform: "translateY(28px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 w-[2px] rounded-full transition-all duration-500 ease-out group-hover:h-full"
        style={{ height: 0, backgroundColor: "#0071e3" }}
        ref={(el) => {
          if (!el) return;
          const li = el.parentElement;
          if (!li) return;
          const enter = () => { el.style.height = "100%"; };
          const leave = () => { el.style.height = "0"; };
          li.addEventListener("mouseenter", enter);
          li.addEventListener("mouseleave", leave);
        }}
      />

      <div className="grid grid-cols-1 gap-5 border-b border-[#e6e6e6] py-10 pl-6 transition-all lg:grid-cols-[200px_1fr_1fr] lg:gap-x-12 lg:py-12">
        {/* Period */}
        <div>
          <p className="text-sm font-medium text-gray-400 transition-colors duration-300 group-hover:text-[#0071e3]">
            {item.period}
          </p>
          {isCurrent && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#0071e3]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0071e3]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0071e3] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0071e3]" />
              </span>
              Now
            </span>
          )}
        </div>

        {/* Role + Company */}
        <div className="transition-transform duration-300 group-hover:translate-x-1">
          <p className="text-base font-bold text-gray-900">{item.role}</p>
          <p className="mt-0.5 text-sm font-medium text-gray-500">{item.company}</p>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-gray-500 lg:pt-0.5">{item.description}</p>
      </div>
    </li>
  );
}

export function Journey() {
  return (
    <section id="experience" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="section-label mb-4">Experience</p>
        <h2 className="mb-12 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.5rem]">
          My journey so far
        </h2>

        <ol className="border-t border-[#e6e6e6]">
          {journey.map((item, index) => (
            <JourneyRow
              key={`${item.company}-${item.period}`}
              item={item}
              index={index}
              isCurrent={index === 0}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
