type LogoProps = {
  variant?: "black" | "white";
  className?: string;
};

export function Logo({ variant = "black", className = "h-5 w-auto" }: LogoProps) {
  const src = variant === "white" ? "/logo-white.png" : "/logo-black.png";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="Taha" className={`object-contain ${className}`} draggable={false} />
  );
}
