import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const ContactSection = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would send to backend
    console.log("Form submitted:", form);
  };

  return (
    <section id="contact" className="section-padding relative">
  
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-medium tracking-widest text-primary uppercase">
            {t("contact.label")}
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            {t("contact.title")}
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-stretch">
          {/* Form — chap section */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-5"
          >
            {[
              { key: "name", type: "text" },
              { key: "company", type: "text" },
              { key: "email", type: "email" },
            ].map((field) => (
              <div key={field.key}>
                <label className="mb-1.5 block text-sm text-muted-foreground">
                  {t(`contact.${field.key}`)}
                </label>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            ))}
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">
                {t("contact.message")}
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full resize-none rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="gradient-bg  justify-center glow-hover inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-primary-foreground"
            >
              {t("contact.send")}
              <Send size={16} />
            </button>
          </motion.form>

          {/* Right section — xarita tepada, manzil kartasi pastda; balandlik chapga teng */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex h-full min-h-0 flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card"
          >
            {/* Xarita — tepada */}
            <div className="min-h-[240px] flex-1">
              <iframe
                title={t("contact.mapTitle")}
                src="https://www.openstreetmap.org/export/embed.html?bbox=69.258%2C41.278%2C69.292%2C41.314&layer=mapnik&marker=41.295925%2C69.275002"
                className="h-full min-h-[240px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {/* Manzil kartasi — pastda */}
            <div className="shrink-0 rounded-b-2xl border-t border-border bg-card p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-bg">
                    <MapPin size={18} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{t("contact.address")}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {t("contact.addressDesc")}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("contact.addressLine")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-3 sm:flex-col">
                  <a
                    href="https://t.me/nevona"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gradient-bg-hover flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-secondary/80 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary-foreground sm:flex-initial sm:px-5"
                  > 
                    <Send size={16} />
                    {t("contact.telegram")}
                  </a>
                  <a
                    href="https://uz.linkedin.com/company/nevona-jss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gradient-bg-hover flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-secondary/80 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary-foreground sm:flex-initial sm:px-5"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    {t("contact.linkedin")}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
