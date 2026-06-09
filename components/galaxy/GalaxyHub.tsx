"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import translations from "./galaxy-translations.json";

type Genre = {
  id: string;
  color: string;
  glow: string;
  angle: number;
  toolSlug?: string;
  comingSoon?: boolean;
  floatDelay: number;
};

const GENRES: Genre[] = [
  { id: "vital",     color: "#10B981", glow: "rgba(16, 185, 129, 0.5)",  angle: 270, toolSlug: "bmi",          floatDelay: 0 },
  { id: "parchment", color: "#F59E0B", glow: "rgba(245, 158, 11, 0.5)",  angle: 342, toolSlug: "word-counter", floatDelay: 1.4 },
  { id: "signal",    color: "#8B5CF6", glow: "rgba(139, 92, 246, 0.5)",  angle: 54,  toolSlug: "qr-code",      floatDelay: 2.8 },
  { id: "vault",     color: "#B8923D", glow: "rgba(184, 146, 61, 0.5)",  angle: 126, toolSlug: "salary",       floatDelay: 4.2 },
  { id: "forge",     color: "#FF6B35", glow: "rgba(255, 107, 53, 0.5)",  angle: 198, comingSoon: true,         floatDelay: 5.6 },
];

// Deterministic star field — seeded so SSR matches client
function generateStars(count: number) {
  const stars = [];
  let seed = 31337;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 2 ** 32;
    return seed / 2 ** 32;
  };
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      size: 0.3 + rand() * 1.7,
      opacity: 0.3 + rand() * 0.7,
      twinkleDelay: rand() * 5,
      twinkleDuration: 2 + rand() * 4,
    });
  }
  return stars;
}

export default function GalaxyHub({ locale }: { locale: string }) {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const stars = useMemo(() => generateStars(280), []);

  const t = (key: keyof (typeof translations)["en"]) => {
    const dict = (translations as Record<string, Record<string, string>>)[locale] || translations.en;
    return dict[key] || translations.en[key];
  };

  const localePrefix = locale === "en" ? "" : `/${locale}`;

  return (
    <main className="galaxy-main">
      {/* Multi-layer space background */}
      <div className="galaxy-bg-deep" aria-hidden="true" />
      <div className="galaxy-nebula" aria-hidden="true" />

      {/* Star field */}
      <svg className="galaxy-stars-svg" aria-hidden="true">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.size}
            fill="white"
            opacity={s.opacity}
            style={{
              animation: `gx-twinkle ${s.twinkleDuration}s ease-in-out ${s.twinkleDelay}s infinite`,
            }}
          />
        ))}
      </svg>

      {/* Shooting stars */}
      <div className="galaxy-shoot galaxy-shoot-1" aria-hidden="true" />
      <div className="galaxy-shoot galaxy-shoot-2" aria-hidden="true" />
      <div className="galaxy-shoot galaxy-shoot-3" aria-hidden="true" />

      <div className="galaxy-wrap">
        <header className="galaxy-header">
          <p className="galaxy-eyebrow">{t("welcome_to")}</p>
          <h1 className="galaxy-h1">Blue Tanuki</h1>
          <p className="galaxy-tagline">{t("tagline")}</p>
        </header>

        <div className="galaxy-stage">
          <div className="galaxy-orbit-wrap">
            {/* Multiple orbit rings */}
            <svg className="galaxy-orbit" viewBox="0 0 640 640" aria-hidden="true">
              <defs>
                <radialGradient id="orbit-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(94, 168, 255, 0.15)" />
                  <stop offset="55%" stopColor="rgba(94, 168, 255, 0.06)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <circle cx="320" cy="320" r="280" fill="url(#orbit-glow)" />
              <circle cx="320" cy="320" r="240" fill="none" stroke="rgba(94, 168, 255, 0.25)" strokeWidth="1" strokeDasharray="2 6" />
              <circle cx="320" cy="320" r="170" fill="none" stroke="rgba(94, 168, 255, 0.08)" strokeWidth="1" strokeDasharray="1 8" />
              <circle cx="320" cy="320" r="100" fill="none" stroke="rgba(94, 168, 255, 0.06)" strokeWidth="1" />
            </svg>

            {/* Tanuki halo */}
            <div className="galaxy-tanuki-halo" aria-hidden="true" />

            {/* Central Tanuki */}
            <Link href={`${localePrefix}/about`} className="galaxy-tanuki" aria-label={t("about_link")}>
              <svg width="160" height="160" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
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

            {/* Planets with float animation */}
            {GENRES.map((genre) => {
              const rad = (genre.angle * Math.PI) / 180;
              // Round to a fixed precision so the inline-style strings are
              // byte-identical between SSR (Node V8) and client (browser V8).
              // Math.cos/sin can differ by 1 ULP across V8 builds, which would
              // otherwise produce a React hydration mismatch on these planets.
              const x = (50 + (Math.cos(rad) * 240) / 6.4).toFixed(4);
              const y = (50 + (Math.sin(rad) * 240) / 6.4).toFixed(4);
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
                    animationDelay: `${genre.floatDelay}s`,
                  }}
                  onMouseEnter={() => setHoveredGenre(genre.id)}
                  onMouseLeave={() => setHoveredGenre(null)}
                >
                  <Link href={href} className="galaxy-planet-link" aria-label={t(`${genre.id}_name` as keyof typeof translations.en)}>
                    <div className="galaxy-planet-aura" style={{ background: `radial-gradient(circle, ${genre.glow} 0%, transparent 65%)` }} aria-hidden="true" />
                    <div
                      className="galaxy-planet-orb"
                      style={{
                        background: `radial-gradient(circle at 32% 30%, ${genre.color} 0%, ${genre.color}cc 38%, ${genre.color}44 75%, ${genre.color}11)`,
                        boxShadow: `0 0 32px ${genre.glow}, 0 0 80px ${genre.glow}, inset -10px -16px 32px rgba(0,0,0,0.45), inset 6px 8px 18px rgba(255,255,255,0.18)`,
                      }}
                    >
                      {genre.comingSoon && (
                        <span className="galaxy-soon-tag">{t("coming_soon")}</span>
                      )}
                      <span className="galaxy-planet-shine" aria-hidden="true" />
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

        {/* Tool list (SEO + mobile) */}
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
                  style={{ background: genre.color, boxShadow: `0 0 14px ${genre.glow}` }}
                  aria-hidden="true"
                />
                <div className="galaxy-tool-text">
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
