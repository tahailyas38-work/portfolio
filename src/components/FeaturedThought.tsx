"use client";

import { useEffect, useRef, useState } from "react";
import { featuredQuote } from "@/lib/data";

export function FeaturedThought() {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = featuredQuote.text.split(" ");

  return (
    <section id="featured-thought" ref={ref} className="relative overflow-hidden pb-20 pt-24 sm:pb-32 sm:pt-32 lg:pb-40 lg:pt-60">

      <div className="relative z-[1] mx-auto max-w-7xl px-6 lg:px-10">
        <p className="section-label mb-5 text-center">Design Philosophy</p>
        <blockquote className="mx-auto max-w-4xl text-center">

          {/* Smaller quotation mark, tight negative margin */}
          <div className="flex justify-center">
            <span
              className="block text-[2.5rem] leading-none text-[#0071e3]/20 sm:text-[3.5rem] lg:text-[4rem]"
              aria-hidden="true"
            >
              &ldquo;
            </span>
          </div>

          <p className="-mt-3 text-[1.35rem] font-bold leading-[1.35] tracking-tight text-gray-900 sm:text-[2rem] lg:text-[2.25rem]">
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="inline-block mr-[0.28em]"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(16px)",
                  filter: revealed ? "blur(0)" : "blur(4px)",
                  transition: `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s, filter 0.5s ease ${i * 0.04}s`,
                }}
              >
                {word}
              </span>
            ))}
          </p>
        </blockquote>
        <div
          className="mx-auto mt-8 max-w-sm text-center"
          style={{ opacity: revealed ? 1 : 0, transition: "opacity 0.8s ease 0.6s" }}
        >
          <p className="text-[13px] font-semibold text-gray-900 lg:text-[15px]">{featuredQuote.author}</p>
          <p className="mt-1 text-[12px] text-gray-400 lg:text-[13px]">{featuredQuote.role}</p>
        </div>
      </div>
    </section>
  );
}
