import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/portfolio/Hero";
import Research from "@/components/portfolio/Research";
import Publications from "@/components/portfolio/Publications";
import Projects from "@/components/portfolio/Projects";
import Contact from "@/components/portfolio/Contact";
import BackgroundGlow from "@/components/layout/BackgroundGlow";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <BackgroundGlow />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Research />
        <Publications />
        <Projects />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}