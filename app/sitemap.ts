import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { tools } from "@/lib/tools-registry";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // ロケール別URL生成ヘルパー
  const getLocalePath = (locale: string, path: string) => {
    const localePart = locale === routing.defaultLocale ? "" : `/${locale}`;
    return `${base}${localePart}${path}`;
  };

  // 静的ページ
  const staticPaths = ["/", "/about", "/contact", "/privacy"];
  for (const path of staticPaths) {
    // hreflang alternates
    const alternates: Record<string, string> = {};
    routing.locales.forEach((l) => {
      alternates[l] = getLocalePath(l, path);
    });

    // 全ロケール分エントリ作成
    for (const locale of routing.locales) {
      entries.push({
        url: getLocalePath(locale, path),
        lastModified,
        changeFrequency: path === "/" ? "daily" : "monthly",
        priority: path === "/" ? 1.0 : 0.5,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  // ツールページ
  for (const tool of tools) {
    const alternates: Record<string, string> = {};
    routing.locales.forEach((l) => {
      alternates[l] = getLocalePath(l, `/tools/${tool.slug}`);
    });

    for (const locale of routing.locales) {
      entries.push({
        url: getLocalePath(locale, `/tools/${tool.slug}`),
        lastModified: new Date(tool.publishedAt),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return entries;
}
