import type { CSSProperties } from "react";

/**
 * Right-sized avatar assets — visually identical on screen, ~100–700× smaller than the master PNG.
 * Master was 6732×8412 (~13MB); these match real CSS display sizes at up to 3× DPR.
 */
export const avatarAssets = {
  hero: {
    webp: "/avatars/hero.webp",
    png: "/avatars/hero.png",
    width: 960,
    height: 1200,
  },
  splash: {
    webp: "/avatars/splash.webp",
    png: "/avatars/splash.png",
    width: 320,
    height: 400,
  },
  mark: {
    webp: "/avatars/mark.webp",
    png: "/avatars/mark.png",
    width: 205,
    height: 256,
  },
} as const;

export type AvatarVariant = keyof typeof avatarAssets;

type AvatarImageProps = {
  variant: AvatarVariant;
  /** Applied to the <picture> wrapper (positioning, size). */
  className?: string;
  alt?: string;
  /** High priority for splash / LCP */
  priority?: boolean;
  /** Applied to the inner <img> (e.g. clipPath). */
  style?: CSSProperties;
  draggable?: boolean;
};

export function AvatarImage({
  variant,
  className,
  alt = "",
  priority = false,
  style,
  draggable = false,
}: AvatarImageProps) {
  const asset = avatarAssets[variant];

  return (
    <picture className={className}>
      <source srcSet={asset.webp} type="image/webp" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.png}
        alt={alt}
        width={asset.width}
        height={asset.height}
        className="h-full w-full object-contain object-center"
        style={style}
        draggable={draggable}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
