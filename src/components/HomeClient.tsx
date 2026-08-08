"use client";

import { useState, useCallback, useEffect } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { FeaturedWork } from "@/components/FeaturedWork";
import { DesignStudies } from "@/components/DesignStudies";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { SideProjects } from "@/components/SideProjects";
import { CreativePlayground } from "@/components/CreativePlayground";
import { FeaturedThought } from "@/components/FeaturedThought";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export function HomeClient() {
  const [splashDone, setSplashDone] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("scroll-locked");
    const safety = setTimeout(() => {
      document.documentElement.classList.remove("scroll-locked");
    }, 9000);
    return () => {
      clearTimeout(safety);
      document.documentElement.classList.remove("scroll-locked");
    };
  }, []);

  const handleSplashDone = useCallback(() => {
    setSplashDone(true);
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
        <FeaturedWork />
        <DesignStudies />
        <ToolsMarquee />
        <SideProjects />
        <CreativePlayground ready={splashDone} />
        <FeaturedThought />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
