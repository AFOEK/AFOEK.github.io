import { useRef } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundGlow from "@/components/layout/BackgroundGlow";
import SectionNavigator from "@/components/layout/SectionNavigator";
import DebugPrank from "@/components/layout/DebugPrank";

import Hero from "@/components/portfolio/Hero";
import Research from "@/components/portfolio/Research";
import Publications from "@/components/portfolio/Publications";
import Projects from "@/components/portfolio/Projects";
import Contact from "@/components/portfolio/Contact";

import { useSectionObserver } from "@/hooks/useSectionObserver";

const sectionIds = ["home", "research", "publications", "projects", "contact"];

export default function Home() {
  const scrollRef = useRef(null);
  const activeSection = useSectionObserver(scrollRef, sectionIds);

  return (
    <div className="relative h-dvh overflow-hidden bg-background text-foreground">
      <DebugPrank />
      <BackgroundGlow />
      <Navbar />
      <SectionNavigator activeSection={activeSection} />

      <main ref={scrollRef} className="portfolio-scroll relative z-10 h-dvh overflow-y-auto">
        <Hero />
        <Research />
        <Publications />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}