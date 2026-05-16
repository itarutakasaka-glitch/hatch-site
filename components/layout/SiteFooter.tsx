import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer
      className="w-full mt-16"
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="tanuki-icon" style={{ width: 28, height: 28, fontSize: 14 }}>
              B
            </span>
            <span className="font-bold">
              Blue<span style={{ color: "var(--color-tanuki)" }}>Tanuki</span>
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
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
            <Link
              href="/privacy"
              style={{ color: "var(--color-text-muted)" }}
              className="hover:!text-[var(--color-tanuki)] transition-colors"
            >
              {t("nav.privacy")}
            </Link>
          </nav>
        </div>

        <div
          className="mt-6 pt-6 text-center text-sm"
          style={{
            borderTop: "1px solid var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          {t("footer.copyright")} · {t("footer.made_with")}
        </div>
      </div>
    </footer>
  );
}
