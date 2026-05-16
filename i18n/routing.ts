import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // v1.0で対応する8言語
  locales: ["en", "es", "pt-BR", "fr", "de", "ja", "ko", "zh-CN"],

  // デフォルト言語（URLにロケールがないとき）
  defaultLocale: "en",

  // 言語表示の有無
  // "as-needed": 英語(デフォルト)はURLからロケール省略、他は /ja/, /es/ 等
  // "always": 全ての言語でロケールをURLに含める
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

// Navigation helpers (next-intl)
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
