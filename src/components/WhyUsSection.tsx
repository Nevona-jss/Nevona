import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Globe2, Cpu, Layers, MapPin } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const ICONS = [Globe2, Cpu, Layers, MapPin];

const CARD_KEYS = [
  { title: "why.card1.title", subtitle: "why.card1.subtitle", desc: "why.card1.desc", tags: "why.card1.tags" },
  { title: "why.card2.title", subtitle: "why.card2.subtitle", desc: "why.card2.desc", tags: "why.card2.tags" },
  { title: "why.card3.title", subtitle: "why.card3.subtitle", desc: "why.card3.desc", tags: "why.card3.tags" },
  { title: "why.card4.title", subtitle: "why.card4.subtitle", desc: "why.card4.desc", tags: "why.card4.tags" },
];

const WhyUsSection = () => {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <section id="why-us" className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            {t("why.label")}
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            {t("why.title")}
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {t("why.subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {CARD_KEYS.map((keys, i) => {
            const Icon = ICONS[i];
            const num = String(i + 1).padStart(2, "0");
            const isActive = activeId === i;
            const tags = t(keys.tags).split(",").map((s) => s.trim()).filter(Boolean);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setActiveId(isActive ? null : i)}
                className={`relative cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                  isActive
                    ? "border-primary/60 bg-primary/5 shadow-[0_0_30px_-8px_hsl(var(--primary)/0.35)]"
                    : "border-border/50 bg-card hover:border-primary/30 hover:bg-card/80"
                }`}
              >
                {/* Top row */}
                <div className="mb-5 flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300 ${
                    isActive ? "border-primary/40 bg-primary/10 text-primary" : "border-border/60 bg-secondary text-muted-foreground"
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className="font-mono text-sm font-semibold text-muted-foreground/50">
                    {num}
                  </span>
                </div>

                {/* Title & subtitle */}
                <h3 className="font-display text-xl font-bold leading-snug text-foreground">
                  {t(keys.title)}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t(keys.subtitle)}
                </p>

                {/* Expanded content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 border-t border-border/50 pt-4">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {t(keys.desc)}
                        </p>
                        {tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-primary/30 px-3 py-0.5 text-xs font-medium text-primary/80"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Toggle button */}
                <div className="mt-5 flex justify-end">
                  <button
                    aria-label={isActive ? "Collapse" : "Expand"}
                    onClick={(e) => { e.stopPropagation(); setActiveId(isActive ? null : i); }}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors duration-200 ${
                      isActive
                        ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                        : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {isActive ? <X size={13} /> : <Plus size={13} />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
