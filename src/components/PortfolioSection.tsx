import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

import coverMes from "@/assets/Cover_MES.jpg";
import coverIct from "@/assets/Cover_ICT.jpg";
import coverAiCctv from "@/assets/Cover_AI CCTV.jpg";
import coverModen from "@/assets/Cover_Moden.jpg";
import coverCoffee from "@/assets/Cover_Coffee AI.jpg";
import coverGroupware from "@/assets/Cover_Groupware.jpg";  

// Topskill, EUTAS, Intalim olib tashlandi — yangi loyihalar qo‘shish uchun shu yerga qo‘shing
const projects = [
  { name: "Groupware", descKey: "portfolio.groupware", tags: ["Enterprise", "Groupware", "Web App"], cover: coverGroupware },
  { name: "MES", descKey: "portfolio.mes", tags: ["Smart Factory", "IoT", "PLC", "Production"], cover: coverMes },
  { name: "ICT-CO-UP", descKey: "portfolio.analysisDashboard", tags: ["UI/UX", "Dashboard", "Analytics", "Energy"], cover: coverIct },
  { name: "AI-VISION-CCTV", descKey: "portfolio.aivisioncctv", tags: ["AI", "Computer Vision", "CCTV", "Safety"], cover: coverAiCctv },
  { name: "MODEN", descKey: "portfolio.moden", tags: ["Beauty", "Next.js", "Payments"], cover: coverModen },
  { name: "MyCoffee AI", descKey: "portfolio.mycoffee", tags: ["AI", "E-commerce", "ML"], cover: coverCoffee },
];

const TILT_MAX = 8; // max tilt degrees

const SHADOW_OFFSET = 28;
const SHADOW_BLUR = 32;

const PortfolioCard = ({
  project,
  index,
  t,
}: {
  project: (typeof projects)[0];
  index: number;
  t: (key: string) => string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, mouseX: null as number | null, mouseY: null as number | null });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 2 * TILT_MAX;
      const rotateX = (y - 0.5) * -2 * TILT_MAX;
      setTransform({ rotateX, rotateY, mouseX: x, mouseY: y });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0, mouseX: null, mouseY: null });
  }, []);

  const shadowX = transform.mouseX != null ? (transform.mouseX - 0.5) * SHADOW_OFFSET : 0;
  const shadowY = transform.mouseY != null ? (transform.mouseY - 0.5) * SHADOW_OFFSET : 0;
  const boxShadow =
    transform.mouseX != null && transform.mouseY != null
      ? `${shadowX}px ${shadowY}px ${SHADOW_BLUR}px -8px rgba(0,0,0,0.45), ${shadowX * 0.5}px ${shadowY * 0.5}px 20px -10px hsl(250, 85%, 65%, 0.25)`
      : "0 4px 24px -4px rgba(0,0,0,0.2)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="portfolio-liquid-glass group relative overflow-hidden rounded-2xl border border-border bg-card"
      style={{
        transform: `perspective(800px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transformStyle: "preserve-3d",
        transition: "transform 0.15s ease-out, box-shadow 0.2s ease-out",
        boxShadow,
      }}
    >
      {/* Cover / gradient header */}
      <div
        className="relative flex h-44 items-center justify-center overflow-hidden"
        style={project.cover ? undefined : { background: `linear-gradient(135deg, hsl(${250 + index * 15}, 50%, 20%), hsl(${220 + index * 15}, 60%, 12%))` }}
      >
        {project.cover && (
          <img
            src={project.cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
       
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-lg font-semibold">{project.name}</h3>
          <ExternalLink size={16} className="mt-1 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{t(project.descKey)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const PortfolioSection = () => {
  const { t } = useLanguage();

  return (
    <section id="portfolio" className="section-padding relative">
      <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[150px]" />

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-medium tracking-widest text-primary uppercase">
            {t("portfolio.label")}
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            {t("portfolio.title")}
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1200px" }}>
          {projects.map((project, i) => (
            <PortfolioCard key={project.name} project={project} index={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
