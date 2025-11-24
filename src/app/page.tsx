import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text overflow-x-hidden">
      <Hero />
      <RevealOnScroll width="100%">
        <About />
      </RevealOnScroll>
      <RevealOnScroll width="100%">
        <Projects />
      </RevealOnScroll>
      <RevealOnScroll width="100%">
        <Skills />
      </RevealOnScroll>
      <RevealOnScroll width="100%">
        <Contact />
      </RevealOnScroll>
      <Footer />
    </main>
  );
}
