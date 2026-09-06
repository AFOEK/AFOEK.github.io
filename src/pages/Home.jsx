import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/portfolio/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <section id="research" className="min-h-screen"></section>
        <section id="publications" className="min-h-screen"></section>
        <section id="projects" className="min-h-screen"></section>
        <section id="contact" className="min-h-screen"></section>
      </main>
      <Footer />
    </div>
  );
}