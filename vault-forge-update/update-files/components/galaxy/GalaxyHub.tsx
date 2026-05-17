"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

const GENRES = [
  {
    id: "vital",
    nameKey: "galaxy.vital.name",
    descKey: "galaxy.vital.desc",
    color: "#D1FF3D",
    glow: "rgba(209, 255, 61, 0.4)",
    angle: 0,
    distance: 240,
    tools: [
      { slug: "bmi", nameKey: "galaxy.vital.tools.bmi" },
    ],
  },
  {
    id: "parchment",
    nameKey: "galaxy.parchment.name",
    descKey: "galaxy.parchment.desc",
    color: "#C8102E",
    glow: "rgba(200, 16, 46, 0.4)",
    angle: 72,
    distance: 240,
    tools: [
      { slug: "word-counter", nameKey: "galaxy.parchment.tools.wordCounter" },
    ],
  },
  {
    id: "signal",
    nameKey: "galaxy.signal.name",
    descKey: "galaxy.signal.desc",
    color: "#00FF9C",
    glow: "rgba(0, 255, 156, 0.4)",
    angle: 144,
    distance: 240,
    tools: [
      { slug: "qr-code", nameKey: "galaxy.signal.tools.qrCode" },
    ],
  },
  {
    id: "vault",
    nameKey: "galaxy.vault.name",
    descKey: "galaxy.vault.desc",
    color: "#B8923D",
    glow: "rgba(184, 146, 61, 0.4)",
    angle: 216,
    distance: 240,
    tools: [
      { slug: "salary", nameKey: "galaxy.vault.tools.salary" },
    ],
  },
  {
    id: "forge",
    nameKey: "galaxy.forge.name",
    descKey: "galaxy.forge.desc",
    color: "#FF6B35",
    glow: "rgba(255, 107, 53, 0.4)",
    angle: 288,
    distance: 240,
    tools: [],
    comingSoon: true,
  },
];

export default function GalaxyHub() {
  const t = useTranslations();
  const locale = useLocale();
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

  return (
    <main className="galaxy-main">
      <div className="galaxy-stars" />

      <div className="galaxy-wrap">
        <header className="galaxy-header">
          <div className="galaxy-brand">
            <span className="brand-text">Blue Tanuki</span>
          </div>
          <p className="galaxy-tagline">{t("galaxy.tagline")}</p>
        </header>

        <div
          className="galaxy-center"
          style={{ width: "640px", height: "640px" }}
        >
          {/* Orbit rings */}
          <svg className="orbit-ring" viewBox="0 0 640 640">
            <circle
              cx="320"
              cy="320"
              r="240"
              fill="none"
              stroke="rgba(94, 168, 255, 0.12)"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
          </svg>

          {/* Central Tanuki */}
          <Link href={`/${locale}`} className="central-tanuki">
            <svg width="120" height="120" viewBox="0 0 100 100">
              <g>
                <ellipse
                  cx="26"
                  cy="30"
                  rx="13"
                  ry="17"
                  fill="#fff"
                  transform="rotate(-22 26 30)"
                />
                <ellipse
                  cx="74"
                  cy="30"
                  rx="13"
                  ry="17"
                  fill="#fff"
                  transform="rotate(22 74 30)"
                />
                <ellipse cx="50" cy="55" rx="36" ry="34" fill="#fff" />
              </g>
              <ellipse
                cx="26"
                cy="30"
                rx="10"
                ry="14"
                fill="#5EA8FF"
                transform="rotate(-22 26 30)"
              />
              <ellipse
                cx="74"
                cy="30"
                rx="10"
                ry="14"
                fill="#5EA8FF"
                transform="rotate(22 74 30)"
              />
              <ellipse
                cx="27"
                cy="32"
                rx="5"
                ry="8"
                fill="#FFB3D0"
                transform="rotate(-22 27 32)"
              />
              <ellipse
                cx="73"
                cy="32"
                rx="5"
                ry="8"
                fill="#FFB3D0"
                transform="rotate(22 73 32)"
              />
              <ellipse cx="50" cy="55" rx="33" ry="31" fill="#5EA8FF" />
              <ellipse cx="38" cy="58" rx="11" ry="10" fill="#fff" />
              <ellipse cx="62" cy="58" rx="11" ry="10" fill="#fff" />
              <ellipse cx="24" cy="65" rx="5" ry="3" fill="#FF6BC5" opacity="0.6" />
              <ellipse cx="76" cy="65" rx="5" ry="3" fill="#FF6BC5" opacity="0.6" />
              <ellipse cx="38" cy="60" rx="4.5" ry="6" fill="#0A1428" />
              <circle cx="40" cy="58" r="1.5" fill="#fff" />
              <ellipse cx="62" cy="60" rx="4.5" ry="6" fill="#0A1428" />
              <circle cx="64" cy="58" r="1.5" fill="#fff" />
              <ellipse cx="50" cy="73" rx="4.5" ry="4" fill="#FF6B6B" />
              <ellipse cx="48" cy="72" rx="1.5" ry="1" fill="rgba(255,255,255,0.7)" />
              <path
                d="M 40 82 Q 50 90 60 82"
                stroke="#0A1428"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          {/* Genres (planets) */}
          {GENRES.map((genre) => {
            const rad = (genre.angle * Math.PI) / 180;
            const x = 320 + Math.cos(rad) * genre.distance;
            const y = 320 + Math.sin(rad) * genre.distance;
            const firstTool = genre.tools[0];
            const href = firstTool
              ? `/${locale}/tools/${firstTool.slug}`
              : `/${locale}#${genre.id}`;

            return (
              <div
                key={genre.id}
                className={`planet planet-${genre.id} ${
                  hoveredGenre === genre.id ? "planet-hover" : ""
                } ${genre.comingSoon ? "planet-coming-soon" : ""}`}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                }}
                onMouseEnter={() => setHoveredGenre(genre.id)}
                onMouseLeave={() => setHoveredGenre(null)}
              >
                <Link href={href} className="planet-link">
                  <div
                    className="planet-orb"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${genre.color}, ${genre.color}99 40%, ${genre.color}33)`,
                      boxShadow: `0 0 24px ${genre.glow}, inset 0 -8px 16px rgba(0,0,0,0.4)`,
                    }}
                  >
                    {genre.comingSoon && <span className="planet-soon">soon</span>}
                  </div>
                  <div className="planet-label">
                    <div className="planet-name">{t(genre.nameKey)}</div>
                    <div className="planet-desc">{t(genre.descKey)}</div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <footer className="galaxy-footer">
          <p className="galaxy-footnote">{t("galaxy.footnote")}</p>
        </footer>
      </div>
    </main>
  );
}
