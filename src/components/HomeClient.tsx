"use client";

import { useState, useCallback, useEffect } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { Journey } from "@/components/Journey";
import { FeaturedWork } from "@/components/FeaturedWork";
import { SideProjects } from "@/components/SideProjects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export function HomeClient() {
  const [splashDone, setSplashDone] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const handleSplashDone = useCallback(() => {
    setSplashDone(true);
    setTimeout(() => {
      setNavVisible(true);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }, 1400);
  }, []);

  return (
    <>
      <SplashScreen onDone={handleSplashDone} />
      <Navigation visible={navVisible} />
      <main className="relative z-10">
        <Hero splashDone={splashDone} />
        <About />
        <ToolsMarquee />
        <Journey />
        <FeaturedWork />
        <SideProjects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
