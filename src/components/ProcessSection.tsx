import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowDown } from "lucide-react";
import manufacturingImage from "@/assets/manifacturing.png";

const STEPS = 6;

const ProcessSection = () => {
  const { t } = useLanguage();

  return (
    <section id="process" className="section-padding relative overflow-hidden">
      <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-accent/5 blur-[100px]" />

      <div className="container relative mx-auto">
        <div className="grid gap-1 lg:grid-cols-[40%_60%] lg:items-center">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative hidden lg:flex lg:items-center lg:justify-center w-full"
          >
            <div className="process-right-image-wrap w-full">
              <img
                src={manufacturingImage}
                alt=""
                className="process-right-image object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
