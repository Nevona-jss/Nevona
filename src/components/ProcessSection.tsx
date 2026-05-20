import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowDown } from "lucide-react";
import mesScreen1 from "@/assets/mes-screen-1.webp";
import mesScreen2 from "@/assets/mes-screen-2.webp";
import mesScreen3 from "@/assets/mes-screen-3.webp";

const STEPS = 6;
const SLIDES = [mesScreen1, mesScreen2, mesScreen3];
const INTERVAL = 4000;

// front = center; back-left/right peek from sides, mostly behind front
const ORBIT = [
  { left: "50%", top: "54%", width: "66%", opacity: 1,    zIndex: 10 }, // front (large, center)
  { left: "14%", top: "28%", width: "47%", opacity: 0.42, zIndex: 5  }, // back-left (low opacity)
  { left: "69%", top: "28%", width: "47%", opacity: 0.68, zIndex: 6  }, // back-right (~10% right peek)
];

const ProcessCarousel = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((p) => (p + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full overflow-hidden select-none" style={{ paddingBottom: "86%" }}>
      {SLIDES.map((slide, i) => {
        const posIndex = (i - step + SLIDES.length) % SLIDES.length;
        const pos = ORBIT[posIndex];
        const isFront = posIndex === 0;

        return (
          <motion.div
            key={i}
            className={`absolute overflow-hidden rounded-xl transition-shadow duration-700 ${
              isFront
                ? "ring-2 ring-primary/60 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]"
                : "ring-1 ring-white/10 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)]"
            }`}
            style={{ x: "-50%", y: "-50%" }}
            animate={{
              left: pos.left,
              top: pos.top,
              width: pos.width,
              opacity: pos.opacity,
              zIndex: pos.zIndex,
              clipPath: isFront
                ? "inset(0% 0% 0% 0% round 12px)"
                : "inset(0% 0% 15% 0% round 12px)",
            }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <img
              src={slide}
              alt={`MES screen ${i + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-xl pointer-events-none"
              draggable={false}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

const ProcessSection = () => {
  const { t } = useLanguage();

  return (
    <section id="process" className="section-padding relative overflow-hidden">
      <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-accent/5 blur-[100px]" />

      <div className="container relative mx-auto">
        <div className="grid gap-1 lg:grid-cols-[40%_60%] lg:items-center">
          {/* Left — steps */}
          <div className="lg:pr-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <span className="inline-block rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
                {t("process.label")}
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl lg:text-[2.75rem]">
                {t("process.title")}
              </h2>
            </motion.div>

            <div className="relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />
              <ul className="space-y-8">
                {Array.from({ length: STEPS }, (_, i) => i + 1).map((stepNum, i) => (
                  <motion.li
                    key={stepNum}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="relative flex gap-6"
                  >
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-card text-sm font-bold text-primary shadow-lg shadow-primary/20">
                      {stepNum}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                        {t(`process.step${stepNum}`)}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-10"
            >
              
                <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-primary/15 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/25"
              >
                <span>{t("process.cta")}</span>
                <ArrowDown size={16} className="rotate-[-90deg]" />
              </a>
            </motion.div>
          </div>

          {/* Right — animated carousel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative hidden lg:flex lg:items-center lg:justify-center w-full"
          >
            <ProcessCarousel />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;