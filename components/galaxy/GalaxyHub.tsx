"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import translations from "./galaxy-translations.json";

type Genre = {
  id: string;
  color: string;
  glow: string;
  angle: number;
  toolSlug?: string;
  comingSoon?: boolean;
};

const GENRES: Genre[] = [
  { id: "vital",     color: "#10B981", glow: "rgba(16, 185, 129, 0.4)",  angle: 270, toolSlug: "bmi" },
  { id: "parchment", color: "#F59E0B", glow: "rgba(245, 158, 11, 0.4)",  angle: 342, toolSlug: "word-counter" },
  { id: "signal",    color: "#8B5CF6", glow: "rgba(139, 92, 246, 0.4)",  angle: 54,  toolSlug: "qr-code" },
  { id: "vault",     color: "#B8923D", glow: "rgba(184, 146, 61, 0.4)",  angle: 126, toolSlug: "salary" },
  { id: "forge",     color: "#FF6B35", glow: "rgba(255, 107, 53, 0.4)",  angle: 198, comingSoon: true },
];

export default function GalaxyHub({ locale }: { locale: string }) {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const t = (key: keyof (typeof translations)["en"]) => {
    const dict = (translations as Record<string, Record<string, string>>)[locale] || translations.en;
    return dict[key] || translations.en[key];
  };

  const localePrefix = locale === "en" ? "" : `/${locale}`;

  return (
    <main className="galaxy-main">
      <div className="galaxy-stars" aria-hidden="true" />

      <div className="galaxy-wrap">
        <header className="galaxy-header">
          <h1 className="galaxy-h1">
            <span className="galaxy-h1-pre">{t("welcome_to")}</span>
            <span className="galaxy-h1-main">Blue Tanuki</span>
          </h1>
          <p className="galaxy-tagline">{t("tagline")}</p>
        </header>

        <div className="galaxy-stage">
          <div className="galaxy-orbit-wrap">
            <svg className="galaxy-orbit" viewBox="0 0 640 640" aria-hidden="true">
              <circle
                cx="320" cy="320" r="240"
                fill="none"
                stroke="rgba(94, 168, 255, 0.18)"
                strokeWidth="1"
                strokeDasharray="2 6"
              />
              <circle
                cx="320" cy="320" r="240"
                fill="none"
                stroke="rgba(94, 168, 255, 0.05)"
                strokeWidth="60"
              />
            </svg>

            {/* Central Tanuki */}
            <Link href={`${localePrefix}/about`} className="galaxy-tanuki" aria-label={t("about_link")}>
              <svg width="140" height="140" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <ellipse cx="26" cy="30" rx="13" ry="17" fill="#fff" transform="rotate(-22 26 30)"/>
                  <ellipse cx="74" cy="30" rx="13" ry="17" fill="#fff" transform="rotate(22 74 30)"/>
                  <ellipse cx="50" cy="55" rx="36" ry="34" fill="#fff"/>
                </g>
                <ellipse cx="26" cy="30" rx="10" ry="14" fill="#5EA8FF" transform="rotate(-22 26 30)"/>
                <ellipse cx="74" cy="30" rx="10" ry="14" fill="#5EA8FF" transform="rotate(22 74 30)"/>
                <ellipse cx="27" cy="32" rx="5" ry="8" fill="#FFB3D0" transform="rotate(-22 27 32)"/>
                <ellipse cx="73" cy="32" rx="5" ry="8" fill="#FFB3D0" transform="rotate(22 73 32)"/>
                <ellipse cx="50" cy="55" rx="33" ry="31" fill="#5EA8FF"/>
                <ellipse cx="38" cy="58" rx="11" ry="10" fill="#fff"/>
                <ellipse cx="62" cy="58" rx="11" ry="10" fill="#fff"/>
                <ellipse cx="24" cy="65" rx="5" ry="3" fill="#FF6BC5" opacity="0.6"/>
                <ellipse cx="76" cy="65" rx="5" ry="3" fill="#FF6BC5" opacity="0.6"/>
                <ellipse cx="38" cy="60" rx="4.5" ry="6" fill="#0A1428"/>
                <circle cx="40" cy="58" r="1.5" fill="#fff"/>
                <ellipse cx="62" cy="60" rx="4.5" ry="6" fill="#0A1428"/>
                <circle cx="64" cy="58" r="1.5" fill="#fff"/>
                <ellipse cx="50" cy="73" rx="4.5" ry="4" fill="#FF6B6B"/>
                <ellipse cx="48" cy="72" rx="1.5" ry="1" fill="rgba(255,255,255,0.7)"/>
                <path d="M 40 82 Q 50 90 60 82" stroke="#0A1428" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </Link>

            {/* Planets */}
            {GENRES.map((genre) => {
              const rad = (genre.angle * Math.PI) / 180;
              const distance = 240;
              const x = 50 + (Math.cos(rad) * distance / 6.4);
              const y = 50 + (Math.sin(rad) * distance / 6.4);
              const href = genre.comingSoon
                ? `${localePrefix}/#${genre.id}`
                : `${localePrefix}/tools/${genre.toolSlug}`;

              return (
                <div
                  key={genre.id}
                  className={`galaxy-planet ${hoveredGenre === genre.id ? "is-hover" : ""} ${genre.comingSoon ? "is-coming-soon" : ""}`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                  onMouseEnter={() => setHoveredGenre(genre.id)}
                  onMouseLeave={() => setHoveredGenre(null)}
                >
                  <Link href={href} className="galaxy-planet-link" aria-label={t(`${genre.id}_name` as keyof typeof translations.en)}>
                    <div
                      className="galaxy-planet-orb"
                      style={{
                        background: `radial-gradient(circle at 32% 32%, ${genre.color}, ${genre.color}cc 45%, ${genre.color}33)`,
                        boxShadow: `0 0 32px ${genre.glow}, 0 0 80px ${genre.glow}, inset 0 -10px 20px rgba(0,0,0,0.4)`,
                      }}
                    >
                      {genre.comingSoon && (
                        <span className="galaxy-soon-tag">{t("coming_soon")}</span>
                      )}
                    </div>
                    <div className="galaxy-planet-label">
                      <span className="galaxy-planet-name">{t(`${genre.id}_name` as keyof typeof translations.en)}</span>
                      <span className="galaxy-planet-desc">{t(`${genre.id}_desc` as keyof typeof translations.en)}</span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <section className="galaxy-tools-list" aria-label={t("all_tools")}>
          <h2 className="galaxy-tools-h">{t("all_tools")}</h2>
          <div className="galaxy-tools-grid">
            {GENRES.filter((g) => !g.comingSoon).map((genre) => (
              <Link
                key={genre.id}
                href={`${localePrefix}/tools/${genre.toolSlug}`}
                className="galaxy-tool-card"
              >
                <div
                  className="galaxy-tool-orb"
                  style={{ background: genre.color }}
                  aria-hidden="true"
                />
                <div>
                  <div className="galaxy-tool-genre">{t(`${genre.id}_name` as keyof typeof translations.en)}</div>
                  <div className="galaxy-tool-name">{t(`${genre.id}_tool` as keyof typeof translations.en)}</div>
                </div>
                <svg
                  className="galaxy-tool-arrow"
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        <footer className="galaxy-footnote">
          <p>{t("footnote")}</p>
        </footer>
      </div>
    </main>
  );
}
