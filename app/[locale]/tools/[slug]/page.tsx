import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { tools, getTool, toolComponents } from "@/lib/tools-registry";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const tool of tools) {
      params.push({ locale, slug: tool.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  const name = tool.names[locale] || tool.names.en || slug;
  const desc = tool.descriptions[locale] || tool.descriptions.en || "";

  const localeUrls: Record<string, string> = {};
  routing.locales.forEach((l) => {
    const prefix = l === routing.defaultLocale ? "" : `/${l}`;
    localeUrls[l] = `${siteConfig.url}${prefix}/tools/${slug}`;
  });

  const canonical =
    locale === routing.defaultLocale
      ? `/tools/${slug}`
      : `/${locale}/tools/${slug}`;

  return {
    title: name,
    description: desc,
    alternates: {
      canonical,
      languages: localeUrls,
    },
    openGraph: {
      title: name,
      description: desc,
      type: "website",
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tool = getTool(slug);
  if (!tool) notFound();

  const componentLoader = toolComponents[slug];
  if (!componentLoader) notFound();

  const ToolComponent = (await componentLoader()).default;

  const name = tool.names[locale] || tool.names.en || slug;
  const tagline = tool.taglines?.[locale] || tool.taglines?.en || "";
  const desc = tool.descriptions[locale] || tool.descriptions.en || "";

  return (
    <>
      {/* body にツールテーマを適用 */}
      <Script id={`tool-theme-${slug}`} strategy="beforeInteractive">
        {`document.body.setAttribute("data-tool-theme", "${tool.theme}");`}
      </Script>

      <article className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
              style={{
                background: `${tool.accentColor}15`,
                border: `3px solid ${tool.accentColor}40`,
              }}
            >
              {tool.icon}
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{name}</h1>
          {tagline && (
            <p
              className="text-lg font-semibold mb-2"
              style={{ color: tool.accentColor }}
            >
              {tagline}
            </p>
          )}
          <p
            className="max-w-2xl mx-auto"
            style={{ color: "var(--color-text-muted)" }}
          >
            {desc}
          </p>
        </header>

        <div className="card">
          <ToolComponent locale={locale} />
        </div>
      </article>
    </>
  );
}
