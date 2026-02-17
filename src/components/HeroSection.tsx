import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCountUp } from "@/hooks/useCountUp";
import ParticleCanvas from "@/components/ParticleCanvas";
import GlobeCanvas from "@/components/GlobeCanvas";
import heroBg from "@/assets/hero-bg.jpg";

const StatCounter = ({ end, suffix, label, duration = 2200 }: { end: number; suffix: string; label: string; duration?: number }) => {
  const { ref, display } = useCountUp({ end, suffix, duration });
  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-3xl font-bold gradient-text">{display}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

const HeroSection = () => {
  const { t } = useLanguage();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const onScroll = () => setShowScrollIndicator(window.scrollY < 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-background/50" />
      </div>

      {/* Particle constellation */}
      <div className="absolute inset-0 z-[1]">
        <ParticleCanvas />
      </div>

      {/* Bright gradient orbs */}
      <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[150px]" />
      <div className="absolute -right-32 bottom-1/3 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[150px]" />
      <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[hsl(200,80%,50%)]/10 blur-[120px]" />

      <div className="container relative z-[2] mx-auto px-4 pt-20">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          {/* Text content */}
          <div className="flex-1">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-widest text-primary uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl"
            >
              {t("hero.title")}
              <br />
              <span className="gradient-text">{t("hero.titleHighlight")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a href="#contact" className="gradient-bg glow-hover inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25">
                {t("hero.cta")}
                <ArrowRight size={16} />
              </a>
              <a href="#portfolio" className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary/60 hover:bg-primary/5">
                {t("hero.ctaSecondary")}
              </a>
            </motion.div>
          </div>

          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="relative min-w-0 flex-1"
          >
            <div className="relative mx-auto aspect-square w-full max-w-[520px]">
              <GlobeCanvas markerKorea={t("globe.markerKorea")} markerUz={t("globe.markerUz")} />
              {/* Glow behind globe */}
              <div className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-[80px]" />
            </div>
          </motion.div>
        </div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 gap-8 rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm md:grid-cols-4"
        >
          <StatCounter end={7} suffix="+" label={t("hero.stats.team")} />
          <StatCounter end={10} suffix="+" label={t("hero.stats.projects")} />
          <StatCounter end={5} suffix="+" label={t("hero.stats.techStacks")} />
          <StatCounter end={2024} suffix="" label={t("hero.stats.founded")} duration={2500} />
        </motion.div>
      </div>

      {/* Scroll indicator — hidden after user scrolls down */}
      <AnimatePresence>
        {showScrollIndicator && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 z-[2] -translate-x-1/2 md:bottom-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ChevronDown className="text-muted-foreground" size={24} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
