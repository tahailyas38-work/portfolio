"use client";

import {
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import SpecularEdge from "@/components/SpecularEdge";

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  /** `md` = section CTA (size 1). `lg` = sticky/header CTA (size 2 — compact). */
  size?: "md" | "lg";
};

type AsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type AsAnchor = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

type Props = AsButton | AsAnchor;

export function MagneticButton(props: Props) {
  const {
    children,
    className = "",
    variant = "primary",
    size = "md",
    ...rest
  } = props;

  const hostRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  const base =
    variant === "primary"
      ? "bg-[#0071e3] text-white shadow-md shadow-[#0071e3]/25 hover:shadow-lg hover:shadow-[#0071e3]/35"
      : "border border-gray-200 bg-white text-gray-700 shadow-sm hover:border-gray-300 hover:shadow-md";

  const sizeCls =
    size === "lg"
      ? // Size 2 — sticky/header CTA (compact)
        "px-4 py-1.5 text-[12.5px] font-semibold sm:px-[18px] sm:py-2 sm:text-[13px]"
      : // Size 1 — section CTAs (padding usually via className)
        "text-[14px] lg:text-[16px]";

  const cls = `relative inline-flex shrink-0 items-center justify-center gap-1.5 overflow-visible rounded-full font-semibold transition-[box-shadow,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]/35 focus-visible:ring-offset-2 ${sizeCls} ${base} ${className}`;

  const edge =
    variant === "primary" ? (
      <SpecularEdge
        hostRef={hostRef}
        radius={999}
        lineColor="#ffffff"
        baseColor="#3d9bff"
        intensity={1.15}
        shineSize={12}
        shineFade={36}
        thickness={1.1}
        proximity={220}
      />
    ) : (
      <SpecularEdge
        hostRef={hostRef}
        radius={999}
        lineColor="#0071e3"
        baseColor="#c8c8c8"
        intensity={1}
        shineSize={12}
        shineFade={36}
        thickness={1}
        proximity={220}
      />
    );

  if ("href" in props && props.href) {
    const { href, onClick, ...anchorRest } = rest as AsAnchor;
    return (
      <a
        ref={hostRef as Ref<HTMLAnchorElement>}
        href={href}
        className={cls}
        onClick={onClick}
        {...anchorRest}
      >
        {edge}
        <span className="relative z-[2] inline-flex items-center gap-1.5">
          {children}
        </span>
      </a>
    );
  }

  const { onClick, type = "button", ...buttonRest } = rest as AsButton;
  return (
    <button
      ref={hostRef as Ref<HTMLButtonElement>}
      type={type}
      className={cls}
      onClick={onClick}
      {...buttonRest}
    >
      {edge}
      <span className="relative z-[2] inline-flex items-center gap-1.5">
        {children}
      </span>
    </button>
  );
}
