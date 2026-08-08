"use client";

import { useState, useRef, type ReactNode, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/data";
import RotatingText from "@/components/RotatingText";
import SpecularEdge from "@/components/SpecularEdge";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
  ssr: false,
});

const BUILD_WORDS = ["build", "design", "craft", "ship", "create"];

type ContactSpecularProps = {
  children: ReactNode;
  className: string;
  lineColor: string;
  baseColor: string;
} & (
  | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
);

function ContactSpecularCta({
  children,
  className,
  lineColor,
  baseColor,
  href,
  ...rest
}: ContactSpecularProps) {
  const hostRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const cls = `relative inline-flex items-center justify-center overflow-visible rounded-full ${className}`;

  const edge = (
    <SpecularEdge
      hostRef={hostRef}
      radius={999}
      lineColor={lineColor}
      baseColor={baseColor}
      intensity={1.1}
      shineSize={12}
      shineFade={36}
      thickness={1}
      proximity={220}
    />
  );

  if (href) {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a ref={hostRef} href={href} className={cls} {...anchorRest}>
        {edge}
        <span className="relative z-[2]">{children}</span>
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button ref={hostRef} type="button" className={cls} {...buttonRest}>
      {edge}
      <span className="relative z-[2]">{children}</span>
    </button>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${siteConfig.email}`;
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-[#0a0a0a] sm:rounded-[2rem]">
          {/* Ambient orbs + gradient veil (non-interactive) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="contact-orb contact-orb-a absolute -left-[12%] -top-[28%] h-[55%] w-[55%] rounded-full bg-[#1a4a8a]/35 blur-[100px]" />
            <div className="contact-orb contact-orb-b absolute -bottom-[30%] -right-[8%] h-[60%] w-[50%] rounded-full bg-[#2a3a7a]/30 blur-[110px]" />
            <div className="contact-orb contact-orb-c absolute right-[18%] top-[8%] h-[38%] w-[32%] rounded-full bg-[#0071e3]/18 blur-[90px]" />
            <div className="contact-spotlight absolute inset-y-0 right-0 w-[55%] bg-[radial-gradient(ellipse_at_70%_55%,rgba(255,255,255,0.06)_0%,transparent_55%)]" />
          </div>

          {/* Antigravity particle field */}
          <div aria-hidden="true" className="absolute inset-0 z-[1] opacity-40">
            <Antigravity
              count={320}
              magnetRadius={10}
              ringRadius={6}
              waveSpeed={0.3}
              waveAmplitude={1}
              particleSize={1.15}
              lerpSpeed={0.06}
              color="#9a9a9a"
              autoAnimate
              particleVariance={1}
              rotationSpeed={0.15}
              depthFactor={1}
              pulseSpeed={2.5}
              particleShape="capsule"
              fieldStrength={10}
            />
          </div>

          {/* Soft veil — light enough that Antigravity stays visible across the banner */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.28) 42%, rgba(10,10,10,0.1) 68%, transparent 100%)",
            }}
          />

          <div className="pointer-events-none relative z-10 px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div className="pointer-events-auto max-w-lg lg:max-w-xl">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff791b]">
                Let&apos;s Connect
              </p>
              <h2 className="text-[1.75rem] font-bold leading-[1.2] tracking-tight text-white sm:text-[2rem] lg:text-[2.5rem]">
                <span className="block whitespace-nowrap">
                  Let&apos;s{" "}
                  <RotatingText
                    texts={BUILD_WORDS}
                    mainClassName="!inline-flex align-middle overflow-hidden rounded-lg bg-[#0071e3] px-2 py-0.5 text-white sm:px-2.5 sm:py-1"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2200}
                  />
                </span>
                <span className="block">something together.</span>
              </h2>
              <p className="mt-5 max-w-md text-[13px] leading-[1.8] text-white/55 lg:text-[15px]">
                I&apos;m always open to discussing product ideas, collaborations, or opportunities
                to create meaningful digital experiences.
              </p>
              <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
                <ContactSpecularCta
                  onClick={copyEmail}
                  lineColor="#0071e3"
                  baseColor="#d4d4d4"
                  className="bg-white px-5 py-2.5 text-[14px] font-semibold text-[#0a0a0a] transition-colors hover:bg-white/90 active:scale-[0.98] lg:px-6 lg:py-3 lg:text-[16px]"
                >
                  {copied ? "Copied!" : "Email me"}
                </ContactSpecularCta>
                <ContactSpecularCta
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  lineColor="#ffffff"
                  baseColor="#6b7280"
                  className="border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/[0.06] active:scale-[0.98] lg:px-6 lg:py-3 lg:text-[16px]"
                >
                  LinkedIn
                </ContactSpecularCta>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
