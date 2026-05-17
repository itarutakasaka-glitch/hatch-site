import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";

export default async function SiteHeader() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <header
      className="w-full sticky top-0 z-50 backdrop-blur"
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-lg"
          style={{ color: "var(--color-text)" }}
        >
          <span className="tanuki-icon">B</span>
          <span>
            Blue<span style={{ color: "var(--color-tanuki)" }}>Tanuki</span>
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-5 text-sm font-medium">
          <Link
            href="/"
            style={{ color: "var(--color-text-muted)" }}
            className="hover:!text-[var(--color-tanuki)] transition-colors"
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/about"
            style={{ color: "var(--color-text-muted)" }}
            className="hover:!text-[var(--color-tanuki)] transition-colors"
          >
            {t("nav.about")}
          </Link>
          <Link
            href="/contact"
            style={{ color: "var(--color-text-muted)" }}
            className="hover:!text-[var(--color-tanuki)] transition-colors"
          >
            {t("nav.contact")}
          </Link>
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
