"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { featuredQuote } from "@/lib/data";

/** Word-stagger indices per line — 3 forced lines on sm+ */
const linedWords = (() => {
  let offset = 0;
  return featuredQuote.lines.map((line) => {
    const words = line.split(" ").map((word, i) => ({ word, index: offset + i }));
    offset += words.length;
    return words;
  });
})();

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

  return (
    <section
      id="featured-thought"
      ref={ref}
      className="relative overflow-hidden pb-20 pt-14 sm:pb-28 sm:pt-20 lg:pb-36 lg:pt-24"
    >
      <div className="relative z-[1] mx-auto max-w-7xl px-6 lg:px-10">
        <p className="section-label mb-10 text-center sm:mb-12">Design Philosophy</p>

        <blockquote className="mx-auto max-w-3xl text-center sm:max-w-5xl lg:max-w-6xl">
          {/* True typographic opening quotes — Unicode “ in Georgia/serif */}
          <div
            className="-mb-6 flex justify-center select-none sm:-mb-8"
            aria-hidden="true"
          >
            <span
              className="block text-[8rem] leading-[0.55] text-[#0071e3]/[0.28] sm:text-[9rem] lg:text-[10rem]"
              style={{
                fontFamily: "Georgia, 'Times New Roman', Times, serif",
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
              }}
            >
              “
            </span>
          </div>

          <p className="text-[1.35rem] font-bold leading-[1.5] tracking-tight text-gray-900 sm:text-[1.85rem] sm:leading-[1.48] lg:text-[2.1rem] lg:leading-[1.45]">
            {linedWords.map((words, lineIdx) => (
              <span
                key={lineIdx}
                className="sm:block sm:whitespace-nowrap"
              >
                {words.map(({ word, index }) => (
                  <span
                    key={`${lineIdx}-${index}`}
                    className="mr-[0.28em] inline-block last:mr-0"
                    style={{
                      opacity: revealed ? 1 : 0,
                      transform: revealed ? "translateY(0)" : "translateY(16px)",
                      filter: revealed ? "blur(0)" : "blur(4px)",
                      transition: `opacity 0.5s ease ${index * 0.04}s, transform 0.5s ease ${index * 0.04}s, filter 0.5s ease ${index * 0.04}s`,
                    }}
                  >
                    {word}
                  </span>
                ))}
                {lineIdx < linedWords.length - 1 && (
                  <span className="sm:hidden"> </span>
                )}
              </span>
            ))}
          </p>
        </blockquote>

        <div
          className="mx-auto mt-10 flex max-w-sm flex-col items-center justify-center gap-3 sm:mt-12"
          style={{ opacity: revealed ? 1 : 0, transition: "opacity 0.8s ease 0.6s" }}
        >
          <Image
            src={featuredQuote.image}
            alt={featuredQuote.author}
            width={128}
            height={128}
            quality={95}
            className="h-14 w-14 rounded-full object-cover object-top ring-1 ring-black/5 sm:h-16 sm:w-16"
          />
          <div className="text-center">
            <p className="text-[13px] font-semibold text-gray-900 lg:text-[15px]">
              {featuredQuote.author}
            </p>
            <p className="mt-0.5 text-[12px] text-gray-400 lg:text-[13px]">
              {featuredQuote.role}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
