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
          <p className="text-xs text-muted-foreground">
            © {year} NEVONA. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
