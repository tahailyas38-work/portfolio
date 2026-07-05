"use client";

import React, { useEffect, useState } from "react";
import { workflowTools } from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function WorkflowTools() {
  const { ref, visible } = useScrollReveal();
  const [activeFlow, setActiveFlow] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setActiveFlow((prev) => (prev + 1) % workflowTools.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <section id="workflow-tools" className="snap-section py-24 lg:py-32">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="mx-auto max-w-7xl px-6 lg:px-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <p className="section-label mb-4">Current Workflow</p>
        <h2 className="text-[2.5rem] font-bold tracking-tight text-gray-900">
          How I work today
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-[1.75] text-gray-500">
          A connected stack — each tool feeds the next in my design-to-ship process.
        </p>

        {/* Flow diagram */}
        <div className="relative mt-16 overflow-x-auto pb-4">
          <div className="flex min-w-[640px] items-center justify-between gap-2 lg:min-w-0">
            {workflowTools.map((tool, i) => (
              <div key={tool.name} className="relative flex flex-1 flex-col items-center">
                {/* Connector line */}
                {i < workflowTools.length - 1 && (
                  <div
                    className="absolute left-[calc(50%+28px)] top-7 hidden h-0.5 lg:block"
                    style={{ width: "calc(100% - 3.5rem)", right: "auto" }}
                  >
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        background: activeFlow >= i
                          ? "repeating-linear-gradient(90deg, #0071e3 0, #0071e3 6px, transparent 6px, transparent 10px)"
                          : "repeating-linear-gradient(90deg, #e6e6e6 0, #e6e6e6 6px, transparent 6px, transparent 10px)",
                        opacity: activeFlow === i ? 1 : 0.6,
                      }}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onMouseEnter={() => setActiveFlow(i)}
                  className="group relative flex flex-col items-center gap-3 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border bg-white shadow-sm transition-all duration-300 ${
                      activeFlow === i
                        ? "border-[#0071e3]/40 shadow-md shadow-[#0071e3]/10 scale-110"
                        : "border-[#e6e6e6] group-hover:border-[#0071e3]/20"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tool.icon} alt={tool.name} className="h-8 w-8 object-contain" />
                  </div>
                  <div className="text-center">
                    <p className={`text-[13px] font-semibold transition-colors ${activeFlow === i ? "text-[#0071e3]" : "text-gray-900"}`}>
                      {tool.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-400">{tool.role}</p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active tool description */}
        <div className="mt-10 rounded-2xl border border-[#e6e6e6] bg-[#f5f9ff]/50 px-6 py-5 text-center transition-all duration-500">
          <p className="text-[14px] text-gray-500">
            <span className="font-semibold text-gray-900">{workflowTools[activeFlow].name}</span>
            {" — "}
            {workflowTools[activeFlow].role}
          </p>
        </div>
      </div>
    </section>
  );
}
