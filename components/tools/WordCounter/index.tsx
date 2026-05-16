"use client";

import { useState, useMemo } from "react";
import translations from "./translations.json";

const CJK_REGEX = /[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/;

function countWords(text: string): number {
  if (!text.trim()) return 0;
  const hasCJK = CJK_REGEX.test(text);
  if (hasCJK) {
    const cjkCount = (text.match(/[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/g) || []).length;
    const nonCjkWords = text
      .replace(/[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/g, " ")
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    return cjkCount + nonCjkWords;
  }
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

function countSentences(text: string): number {
  if (!text.trim()) return 0;
  const matches = text.match(/[.!?。!?]+/g);
  return matches ? matches.length : 0;
}

function countParagraphs(text: string): number {
  if (!text.trim()) return 0;
  return text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
}

export default function WordCounter({ locale }: { locale: string }) {
  const t = (key: keyof (typeof translations)["en"]) => {
    const dict =
      (translations as Record<string, Record<string, string>>)[locale] ||
      translations.en;
    return dict[key] || translations.en[key];
  };

  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = countWords(text);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = countSentences(text);
    const paragraphs = countParagraphs(text);
    const hasCJK = CJK_REGEX.test(text);
    const readingMin = hasCJK
      ? Math.ceil(charactersNoSpaces / 500)
      : Math.ceil(words / 200);
    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingMin: text.trim() ? Math.max(1, readingMin) : 0,
    };
  }, [text]);

  return (
    <div className="parchment-root">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Special+Elite&display=swap');

        .parchment-root {
          min-height: calc(100vh - 80px);
          background:
            radial-gradient(ellipse at top, #F4E8D0 0%, #E8D9B8 60%, #D4C195 100%);
          padding: 56px 16px 80px;
          font-family: "Cormorant Garamond", "Hiragino Mincho ProN", "Yu Mincho", serif;
          color: #3D2817;
          position: relative;
          overflow: hidden;
        }
        /* Paper texture (subtle dots) */
        .parchment-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(61, 40, 23, 0.04) 1px, transparent 2px),
            radial-gradient(circle at 70% 60%, rgba(61, 40, 23, 0.03) 1px, transparent 2px),
            radial-gradient(circle at 40% 80%, rgba(61, 40, 23, 0.04) 1px, transparent 2px),
            radial-gradient(circle at 90% 20%, rgba(61, 40, 23, 0.03) 1px, transparent 2px);
          background-size: 100px 100px, 80px 80px, 120px 120px, 90px 90px;
          opacity: 0.6;
          pointer-events: none;
        }
        /* Ink stain accent */
        .parchment-root::after {
          content: "";
          position: absolute;
          top: 8%;
          right: -120px;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139, 69, 19, 0.08), transparent 70%);
          filter: blur(40px);
          pointer-events: none;
        }
        .container {
          max-width: 760px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .ornament {
          text-align: center;
          margin-bottom: 12px;
          font-size: 22px;
          color: #8B6F47;
          letter-spacing: 0.4em;
        }
        .title {
          text-align: center;
          font-family: "Playfair Display", "Hiragino Mincho ProN", serif;
          font-size: clamp(40px, 7vw, 68px);
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1;
          margin: 0;
          color: #2C1810;
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
        }
        .subtitle {
          text-align: center;
          font-style: italic;
          font-size: 18px;
          color: #6B4E2E;
          margin: 12px 0 8px;
          letter-spacing: 0.02em;
        }
        .rule {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 24px 0 36px;
        }
        .rule::before,
        .rule::after {
          content: "";
          flex: 1;
          max-width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #8B6F47, transparent);
        }
        .rule-mark {
          font-size: 14px;
          color: #8B6F47;
          letter-spacing: 0.3em;
        }
        .typewriter-frame {
          background: rgba(255, 251, 240, 0.7);
          border: 2px solid #C4A875;
          border-radius: 4px;
          padding: 28px;
          box-shadow:
            0 2px 0 #A88B5C,
            0 4px 20px rgba(61, 40, 23, 0.15),
            inset 0 0 0 1px rgba(255, 255, 255, 0.5);
          position: relative;
        }
        .typewriter-frame::before {
          content: "";
          position: absolute;
          top: -6px;
          left: 30px;
          right: 30px;
          height: 4px;
          background: repeating-linear-gradient(90deg, #8B6F47 0px, #8B6F47 6px, transparent 6px, transparent 12px);
          opacity: 0.5;
        }
        textarea {
          width: 100%;
          min-height: 220px;
          background: transparent;
          border: none;
          outline: none;
          resize: vertical;
          font-family: "Special Elite", "Courier New", "Hiragino Maru Gothic ProN", monospace;
          font-size: 16px;
          line-height: 1.9;
          color: #2C1810;
          letter-spacing: 0.02em;
        }
        textarea::placeholder {
          color: rgba(61, 40, 23, 0.35);
          font-style: italic;
        }
        /* Stats grid */
        .stats {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 640px) {
          .stats { grid-template-columns: repeat(3, 1fr); }
        }
        .stat {
          padding: 20px 16px;
          background: rgba(255, 251, 240, 0.5);
          border: 1.5px solid #C4A875;
          border-radius: 4px;
          text-align: center;
          position: relative;
          box-shadow: 0 1px 0 #A88B5C;
        }
        .stat-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          border: 1.5px solid #8B6F47;
        }
        .stat-corner.tl { top: 4px; left: 4px; border-right: none; border-bottom: none; }
        .stat-corner.tr { top: 4px; right: 4px; border-left: none; border-bottom: none; }
        .stat-corner.bl { bottom: 4px; left: 4px; border-right: none; border-top: none; }
        .stat-corner.br { bottom: 4px; right: 4px; border-left: none; border-top: none; }

        .stat-label {
          font-family: "Special Elite", monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8B6F47;
          margin-bottom: 8px;
        }
        .stat-value {
          font-family: "Playfair Display", serif;
          font-size: 36px;
          font-weight: 900;
          color: #2C1810;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .stat-unit {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          font-size: 14px;
          color: #8B6F47;
          margin-left: 4px;
          font-weight: 500;
        }
        /* Footer ornament */
        .footer-ornament {
          margin-top: 48px;
          text-align: center;
          color: #8B6F47;
          font-style: italic;
          font-size: 14px;
          letter-spacing: 0.05em;
        }
        .footer-ornament span {
          display: inline-block;
          padding: 0 16px;
          background: transparent;
        }
        .footer-rule {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .footer-rule::before,
        .footer-rule::after {
          content: "";
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #C4A875, transparent);
        }
      `}</style>

      <div className="container">
        <div className="ornament">❦ &nbsp; ❦ &nbsp; ❦</div>
        <h1 className="title">{t("title") || "Word Counter"}</h1>
        <p className="subtitle">{t("subtitle") || "Every letter, considered."}</p>
        <div className="rule">
          <span className="rule-mark">EST · MMXXVI</span>
        </div>

        <div className="typewriter-frame">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("placeholder")}
            spellCheck={false}
          />
        </div>

        <div className="stats">
          <StatCard label={t("words")} value={stats.words} />
          <StatCard label={t("characters")} value={stats.characters} />
          <StatCard
            label={t("characters_no_spaces")}
            value={stats.charactersNoSpaces}
          />
          <StatCard label={t("sentences")} value={stats.sentences} />
          <StatCard label={t("paragraphs")} value={stats.paragraphs} />
          <StatCard
            label={t("reading_time")}
            value={stats.readingMin}
            unit={t("reading_time_minutes")}
          />
        </div>

        <div className="footer-ornament">
          <div className="footer-rule">
            <span>{t("footer_quote") || "Writing is thinking made visible."}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <div className="stat">
      <span className="stat-corner tl" />
      <span className="stat-corner tr" />
      <span className="stat-corner bl" />
      <span className="stat-corner br" />
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value.toLocaleString()}
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
      <style jsx>{`
        .stat {
          padding: 20px 16px;
          background: rgba(255, 251, 240, 0.5);
          border: 1.5px solid #C4A875;
          border-radius: 4px;
          text-align: center;
          position: relative;
          box-shadow: 0 1px 0 #A88B5C;
        }
        .stat-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          border: 1.5px solid #8B6F47;
        }
        .stat-corner.tl { top: 4px; left: 4px; border-right: none; border-bottom: none; }
        .stat-corner.tr { top: 4px; right: 4px; border-left: none; border-bottom: none; }
        .stat-corner.bl { bottom: 4px; left: 4px; border-right: none; border-top: none; }
        .stat-corner.br { bottom: 4px; right: 4px; border-left: none; border-top: none; }
        .stat-label {
          font-family: "Special Elite", monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8B6F47;
          margin-bottom: 8px;
        }
        .stat-value {
          font-family: "Playfair Display", serif;
          font-size: 36px;
          font-weight: 900;
          color: #2C1810;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .stat-unit {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          font-size: 14px;
          color: #8B6F47;
          margin-left: 4px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
