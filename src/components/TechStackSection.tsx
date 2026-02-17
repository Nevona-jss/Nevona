import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const techCategories = [
  { labelKey: "tech.backend", items: ["Java","Spring Boot", "Python", "FastAPI", "Node.js", "Express", "REST API", "PostgreSQL"] },
  { labelKey: "tech.frontend", items: [ "JavaScript", "React", "Next.js", "TypeScript", "Tailwind CSS", "Bootstrap", "Material UI"] },
  { labelKey: "tech.aiiot", items: ["AI Vision", "MLB", "OLP", "PTT", "VDC", "VDR"] },
  { labelKey: "tech.devops", items: ["Docker", "GitHub Actions", "Nginx", "Linux", "CI/CD"] },
];

const TechStackSection = () => {
  const { t } = useLanguage();

  return (
    <section id="tech" className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-medium tracking-widest text-primary uppercase">
            {t("tech.label")}
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            {t("tech.title")}
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {techCategories.map((cat, i) => (
            <motion.div
              key={cat.labelKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="mb-4 font-display text-sm font-semibold tracking-wider text-primary uppercase">
                {t(cat.labelKey)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
