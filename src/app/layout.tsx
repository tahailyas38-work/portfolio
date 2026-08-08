import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope, Space_Grotesk, Fredoka } from "next/font/google";
import "./globals.css";
import { TalkToTahaProvider } from "@/components/TalkToTaha";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-hero",
  display: "swap",
  weight: ["500", "600", "700"],
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Taha — Product Designer",
  description:
    "Product designer, entrepreneur, and creative strategist turning complexity into clarity across enterprise, consumer, and AI products.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${manrope.variable} ${spaceGrotesk.variable} ${fredoka.variable}`}
    >
      <body className="antialiased">
        <TalkToTahaProvider>{children}</TalkToTahaProvider>
      </body>
    </html>
  );
}
