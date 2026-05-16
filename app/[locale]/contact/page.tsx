import { setRequestLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site-config";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <article className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("nav.contact")}</h1>
      <div className="space-y-4" style={{ color: "var(--color-text-muted)" }}>
        <p>
          For questions, feedback, or feature requests, please contact us:
        </p>
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: "var(--color-accent-soft)",
            border: "1px solid var(--color-border)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {siteConfig.contactEmail.replace("@", " [at] ")}
        </div>
      </div>
    </article>
  );
}
