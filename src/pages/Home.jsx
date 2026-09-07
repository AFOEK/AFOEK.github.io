import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/portfolio/Hero";
import Research from "@/components/portfolio/Research";
import Publications from "@/components/portfolio/Publications";
import Projects from "@/components/portfolio/Projects";


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Research />
        <Publications />
        <Projects />
        <section id="contact" className="min-h-screen"></section>
      </main>
      <Footer />
    </div>
  );
}