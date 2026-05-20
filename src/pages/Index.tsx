import { useRef, useState, useCallback, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const TechStackSection = lazy(() => import("@/components/TechStackSection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

const Index = () => {
  const sectionsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = sectionsRef.current;
      const glow = glowRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!visible) setVisible(true);
      if (glow) {
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
      }
    },
    [visible]
  );

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div
        ref={sectionsRef}
        className="sections-animated-bg"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={glowRef}
          className="mouse-light"
          style={{ opacity: visible ? 1 : 0 }}
          aria-hidden
        />
        <Suspense fallback={null}>
          <ServicesSection />
          <PortfolioSection />
          <TechStackSection />
          <ProcessSection />
          <ContactSection />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
