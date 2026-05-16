import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import "../globals.css";

// 自前のロケール判定（next-intl v3にはhasLocaleなし）
function isValidLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

// 全言語をstatic生成
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  const localeUrls: Record<string, string> = {};
  routing.locales.forEach((l) => {
    localeUrls[l] = l === routing.defaultLocale ? siteConfig.url : `${siteConfig.url}/${l}`;
  });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${t("name")} — ${t("tagline")}`,
      template: `%s | ${t("name")}`,
    },
    description: t("description"),
    alternates: {
      canonical: locale === routing.defaultLocale ? "/" : `/${locale}`,
      languages: localeUrls,
    },
    openGraph: {
      type: "website",
      locale,
      url: localeUrls[locale],
      title: `${t("name")} — ${t("tagline")}`,
      description: t("description"),
      siteName: t("name"),
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("name")} — ${t("tagline")}`,
      description: t("description"),
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  // Static rendering を有効化
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        {/* Google Analytics 4 */}
        {siteConfig.gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${siteConfig.gaId}');
              `}
            </Script>
          </>
        )}
        {/* Google AdSense */}
        {siteConfig.adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>
        <NextIntlClientProvider>
          <div className="min-h-screen flex flex-col">
            <SiteHeader />
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
              {children}
            </main>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
