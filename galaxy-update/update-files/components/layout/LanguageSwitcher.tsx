"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

type Locale = {
  code: string;
  native: string;     // 表示用ネイティブ名
  english: string;    // サブテキスト用英語名
  dir?: "ltr" | "rtl";
};

const LOCALES: Locale[] = [
  { code: "en", native: "English", english: "English" },
  { code: "ja", native: "日本語", english: "Japanese" },
  { code: "es", native: "Español", english: "Spanish" },
  { code: "pt-BR", native: "Português", english: "Portuguese (Brazil)" },
  { code: "fr", native: "Français", english: "French" },
  { code: "de", native: "Deutsch", english: "German" },
  { code: "ko", native: "한국어", english: "Korean" },
  { code: "zh-CN", native: "简体中文", english: "Chinese (Simplified)" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  const filtered = LOCALES.filter((l) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      l.native.toLowerCase().includes(q) ||
      l.english.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (code: string) => {
    if (code === currentLocale) {
      setOpen(false);
      return;
    }
    // Replace locale prefix in path
    // pathname might be /ja/tools/salary or /tools/salary (default locale = en)
    let newPath = pathname || "/";

    // Strip current locale prefix if present
    const localePattern = new RegExp(`^/(${LOCALES.map((l) => l.code).join("|")})(/|$)`);
    newPath = newPath.replace(localePattern, "/");

    // For default locale (en), don't add prefix; for others, add /{code}
    if (code === "en") {
      router.push(newPath);
    } else {
      router.push(`/${code}${newPath === "/" ? "" : newPath}`);
    }
    setOpen(false);
  };

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        type="button"
        className="lang-trigger"
        onClick={() => setOpen(!open)}
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="lang-trigger-label">{current.native}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`lang-chev ${open ? "lang-chev-open" : ""}`}
          aria-hidden="true"
        >
          <path d="M1 1.5L6 6.5L11 1.5" />
        </svg>
      </button>

      {open && (
        <div className="lang-menu" role="listbox">
          <div className="lang-search">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search language…"
              aria-label="Search language"
            />
          </div>
          <ul className="lang-list">
            {filtered.length === 0 && (
              <li className="lang-empty">No language matches.</li>
            )}
            {filtered.map((l) => (
              <li
                key={l.code}
                className={`lang-item ${l.code === currentLocale ? "lang-item-current" : ""}`}
                role="option"
                aria-selected={l.code === currentLocale}
                onClick={() => handleSelect(l.code)}
              >
                <span className="lang-native">{l.native}</span>
                <span className="lang-english">{l.english}</span>
                {l.code === currentLocale && (
                  <svg
                    className="lang-check"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
