import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <article className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("nav.privacy")}</h1>
      <div className="space-y-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
        <h2 className="text-lg font-semibold mt-6" style={{ color: "var(--color-text)" }}>
          1. Data Collection
        </h2>
        <p>
          This site uses Google Analytics 4 to understand how visitors use our tools.
          Anonymous usage data (page views, browser info, country) may be collected.
          No personal information is required or collected.
        </p>

        <h2 className="text-lg font-semibold mt-6" style={{ color: "var(--color-text)" }}>
          2. Advertising
        </h2>
        <p>
          This site uses Google AdSense to display advertisements. Google may use
          cookies to serve ads based on a user&apos;s prior visits to this site or
          other sites on the Internet. Users may opt out of personalized advertising
          by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline">
            Google Ads Settings
          </a>.
        </p>

        <h2 className="text-lg font-semibold mt-6" style={{ color: "var(--color-text)" }}>
          3. Tools Data
        </h2>
        <p>
          All tool calculations happen in your browser. No input data is sent to
          our servers.
        </p>

        <h2 className="text-lg font-semibold mt-6" style={{ color: "var(--color-text)" }}>
          4. Contact
        </h2>
        <p>
          For questions about this privacy policy, please use our contact page.
        </p>
      </div>
    </article>
  );
}
