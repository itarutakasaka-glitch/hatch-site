import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import GalaxyHub from "@/components/galaxy/GalaxyHub";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Blue Tanuki — A galaxy of useful tools for professionals",
    ja: "Blue Tanuki — ビジネスパーソンのための便利ツール百貨店",
    es: "Blue Tanuki — Una galaxia de herramientas utiles para profesionales",
    "pt-BR": "Blue Tanuki — Uma galaxia de ferramentas uteis para profissionais",
    fr: "Blue Tanuki — Une galaxie d'outils utiles pour les pros",
    de: "Blue Tanuki — Eine Galaxie nutzlicher Tools fur Profis",
    ko: "Blue Tanuki — 전문가를 위한 유용한 도구의 은하",
    "zh-CN": "Blue Tanuki — 为专业人士打造的实用工具星系",
  };

  const descriptions: Record<string, string> = {
    en: "Free useful tools for everyday work: salary calculator, BMI, QR codes, word counter and more. No signup, no install — runs in your browser.",
    ja: "毎日の仕事で使える無料ツール:給与計算、BMI、QRコード、文字数カウントなど。登録不要・インストール不要、ブラウザですぐ使えます。",
    es: "Herramientas utiles gratuitas para el trabajo diario.",
    "pt-BR": "Ferramentas uteis gratis para o dia a dia.",
    fr: "Outils utiles gratuits pour le travail quotidien.",
    de: "Kostenlose Tools fur den Arbeitsalltag.",
    ko: "일상 업무에서 쓰는 무료 도구.",
    "zh-CN": "免费日常办公工具。",
  };

  const title = titles[locale] || titles.en;
  const description = descriptions[locale] || descriptions.en;

  const localeUrls: Record<string, string> = {};
  routing.locales.forEach((l) => {
    const prefix = l === routing.defaultLocale ? "" : `/${l}`;
    localeUrls[l] = `${siteConfig.url}${prefix}`;
  });

  const canonical = locale === routing.defaultLocale ? "/" : `/${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: localeUrls,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GalaxyHub locale={locale} />;
}