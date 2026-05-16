"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useTransition } from "react";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "es", name: "Español" },
  { code: "pt-BR", name: "Português" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ko", name: "한국어" },
  { code: "zh-CN", name: "中文" },
] as const;

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, {
        locale: newLocale as (typeof LANGUAGES)[number]["code"],
      });
    });
  };

  return (
    <select
      value={currentLocale}
      onChange={handleChange}
      disabled={isPending}
      className="text-sm border rounded-lg px-3 py-1.5 bg-white cursor-pointer"
      style={{ borderColor: "var(--color-border)" }}
      aria-label="Language"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
