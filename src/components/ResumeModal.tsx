"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/data";

export function ResumeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const focusTrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("scroll-locked");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("scroll-locked");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={focusTrapRef}
        className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ height: "min(90svh, 880px)" }}
      >
        {/* Header bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#e6e6e6] bg-white px-5 py-3.5">
          <span className="text-[14px] font-semibold text-gray-700">Resume — Muhammad Taha Madni</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close resume"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* PDF iframe */}
        <div className="relative min-h-0 flex-1">
          <iframe
            src={`${siteConfig.cv}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
            title="Resume"
            className="block h-full w-full border-0 bg-white"
            style={{
              margin: 0,
              width: "100%",
              height: "100%",
              borderRadius: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
