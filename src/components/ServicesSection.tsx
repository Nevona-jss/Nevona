import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Factory, Globe, Palette, Brain, LayoutGrid, Info, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const services = [
  { icon: Building2, titleKey: "services.enterprise.title", descKey: "services.enterprise.desc" },
  { icon: Factory, titleKey: "services.factory.title", descKey: "services.factory.desc" },
  { icon: Globe, titleKey: "services.web.title", descKey: "services.web.desc" },
  { icon: Palette, titleKey: "services.uiux.title", descKey: "services.uiux.desc" },
  { icon: Brain, titleKey: "services.ai.title", descKey: "services.ai.desc" },
  { icon: LayoutGrid, titleKey: "services.mvp.title", descKey: "services.mvp.desc" },
];

const ServicesSection = () => {
  const { t } = useLanguage();
  const [selectedServiceKey, setSelectedServiceKey] = useState<string | null>(null);
  const selectedService = selectedServiceKey
    ? services.find((s) => s.titleKey === selectedServiceKey)
    : null;
  const detailKey = (titleKey: string) => titleKey.replace(".title", ".detail");

  return (
    <section id="services" className="section-padding relative">
      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]" />

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-medium tracking-widest text-primary uppercase">
            {t("services.label")}
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            {t("services.title")}
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/30 glow-hover"
            >
              <button
                type="button"
                onClick={() => setSelectedServiceKey(service.titleKey)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label={t("services.moreInfo")}
              >
                <Info size={20} />
              </button>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl gradient-bg">
                <service.icon size={22} className="text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold">
                {t(service.titleKey)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(service.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedService && (
          <motion.div
            key={`overlay-${selectedServiceKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedServiceKey(null)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
        {selectedService && (
          <motion.div
            key={`modal-${selectedServiceKey}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl md:p-10 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-bg">
                  <selectedService.icon size={22} className="text-primary-foreground" />
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedServiceKey(null)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label={t("services.modalClose")}
                >
                  <X size={22} />
                </button>
              </div>
              <h3 className="font-display text-xl font-semibold">
                {t(selectedService.titleKey)}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                {t(detailKey(selectedService.titleKey))}
              </p>
              {/* <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedServiceKey(null)}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {t("services.modalClose")}
                </button>
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServicesSection;
