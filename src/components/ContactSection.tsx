import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
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
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t("contact.subtitle")}
          </p>
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
            <div className="min-h-[240px] flex-1">
              <iframe
                title={t("contact.mapTitle")}
                src="https://yandex.ru/map-widget/v1/?ll=69.275002%2C41.295925&z=15&pt=69.275002%2C41.295925%2Cpm2rdl"
                className="h-full min-h-[240px] w-full rounded-2xl border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
