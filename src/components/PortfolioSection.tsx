import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
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
  onOpenModal,
}: {
  project: (typeof projects)[0];
  index: number;
  t: (key: string) => string;
  onOpenModal: (project: (typeof projects)[0]) => void;
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
      className="portfolio-liquid-glass group relative overflow-hidden rounded-2xl border border-border bg-card cursor-pointer"
      style={{
        transform: `perspective(800px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transformStyle: "preserve-3d",
        transition: "transform 0.15s ease-out, box-shadow 0.2s ease-out",
        boxShadow,
      }}
    >
      {/* Click overlay — 3D transform ostida click ishlamasligi uchun alohida qatlam */}
      <div
        className="absolute inset-0 z-10"
        onClick={() => onOpenModal(project)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenModal(project); } }}
        role="button"
        tabIndex={0}
        aria-label={project.name}
      />
      {/* Cover / gradient header */}
      <div
        className="relative flex h-44 items-center justify-center overflow-hidden pointer-events-none"
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

      <div className="relative z-20 p-6 pointer-events-none">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-lg font-semibold">{project.name}</h3>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpenModal(project); }}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 pointer-events-auto"
            aria-label={t("services.moreInfo")}
          >
            <ExternalLink size={16} />
          </button>
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
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);

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
            <PortfolioCard
              key={project.name}
              project={project}
              index={i}
              t={t}
              onOpenModal={setSelectedProject}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              key={`overlay-${selectedProject.name}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              key={`modal-${selectedProject.name}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl md:p-8 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  {selectedProject.cover && (
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <img src={selectedProject.cover} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="ml-auto rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-label={t("services.modalClose")}
                  >
                    <X size={22} />
                  </button>
                </div>
                <h3 className="font-display text-xl font-semibold">{selectedProject.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {t(selectedProject.descKey)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {t("services.modalClose")}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioSection;
