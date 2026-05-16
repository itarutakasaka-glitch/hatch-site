import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <article className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("nav.about")}</h1>
      <div className="space-y-4" style={{ color: "var(--color-text-muted)" }}>
        <p>
          {t("site.name")} — {t("site.description")}
        </p>
      </div>
    </article>
  );
}
