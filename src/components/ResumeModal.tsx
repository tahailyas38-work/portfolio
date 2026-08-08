"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { siteConfig } from "@/lib/data";

export function ResumeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) sheetRef.current?.focus();
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[200]">
          <motion.button
            type="button"
            aria-label="Close resume"
            className="absolute inset-0 bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={onClose}
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-2.5 z-[210] flex h-9 w-9 items-center justify-center text-white transition-opacity hover:opacity-70 sm:right-6 sm:top-3.5"
          >
            <X className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2.25} />
          </button>

          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Resume"
            tabIndex={-1}
            initial={reduceMotion ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reduceMotion ? undefined : { y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.9 }}
            className="absolute inset-x-0 bottom-0 top-12 flex w-full flex-col overflow-hidden rounded-t-[20px] bg-white outline-none sm:top-14 sm:rounded-t-[24px]"
          >
            <div className="z-20 flex shrink-0 items-center justify-between border-b border-[#efefef] bg-white px-5 py-3.5 sm:px-8">
              <p className="text-[15px] font-semibold text-gray-900 sm:text-[16px]">
                Resume - {siteConfig.fullName}
              </p>
              <a
                href={siteConfig.cv}
                download
                className="text-[13px] font-semibold text-[#0071e3] hover:opacity-70"
              >
                Download
              </a>
            </div>
            <div className="min-h-0 flex-1">
              <iframe
                src={`${siteConfig.cv}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                title="Resume"
                className="block h-full w-full border-0 bg-white"
              />
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
