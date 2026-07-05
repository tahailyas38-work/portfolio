"use client";

import { useState, useCallback, useEffect } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { FeaturedWork } from "@/components/FeaturedWork";
import { SideProjects } from "@/components/SideProjects";
import { FeaturedThought } from "@/components/FeaturedThought";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export function HomeClient() {
  const [splashDone, setSplashDone] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("scroll-locked");
    const safety = setTimeout(() => {
      document.documentElement.classList.remove("scroll-locked");
    }, 5000);
    return () => {
      clearTimeout(safety);
      document.documentElement.classList.remove("scroll-locked");
    };
  }, []);

  const handleSplashDone = useCallback(() => {
    setSplashDone(true);
    // Hero.tsx owns the scroll lock from here — it unlocks after animation
  }, []);

  const handleHeroReady = useCallback(() => {
    setNavVisible(true);
  }, []);

  return (
    <>
      <SplashScreen onDone={handleSplashDone} />
      <Navigation visible={navVisible} />
      <main className="relative z-10 pb-8">
        <Hero splashDone={splashDone} onReady={handleHeroReady} />
        <About />
        <ToolsMarquee />
        <FeaturedWork />
        <SideProjects />
        <FeaturedThought />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
