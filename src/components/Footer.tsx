import { Send } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import logo from "@/assets/logo.svg";

const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="NEVONA" className="h-8 w-8" />
            <span className="font-display text-lg font-bold">NEVONA</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            {t("footer.branch")}
          </p>
          <div className="flex gap-3">
            <a
              href="https://t.me/nevona"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-bg-hover flex items-center gap-2 rounded-lg border border-border bg-secondary/80 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary-foreground"
            >
              <Send size={16} />
              {t("contact.telegram")}
            </a>
            <a
              href="https://uz.linkedin.com/company/nevona-jss"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-bg-hover flex items-center gap-2 rounded-lg border border-border bg-secondary/80 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary-foreground"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              {t("contact.linkedin")}
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {year} NEVONA. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
