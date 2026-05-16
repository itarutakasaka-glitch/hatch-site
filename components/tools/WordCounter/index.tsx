"use client";

import { useState, useMemo } from "react";
import translations from "./translations.json";

// CJK文字判定（簡易）
const CJK_REGEX = /[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/;

function countWords(text: string): number {
  if (!text.trim()) return 0;

  // CJK文字を含むかチェック
  const hasCJK = CJK_REGEX.test(text);

  if (hasCJK) {
    // CJK系: 文字単位でカウント、ただしASCII単語はまとめる
    // 1. CJK文字を1単語ずつカウント
    // 2. 連続する非CJK文字（英単語等）を1単語としてカウント
    const cjkCount = (text.match(/[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/g) || []).length;
    const nonCjkWords = text
      .replace(/[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]/g, " ")
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    return cjkCount + nonCjkWords;
  }

  // 英語等: 空白区切り
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

function countSentences(text: string): number {
  if (!text.trim()) return 0;
  // 日本語の句点・英語ピリオド・中国語句点・感嘆符・疑問符等
  const matches = text.match(/[.!?。！？]+/g);
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
    // 読了時間（平均200 words/min、日本語等は文字ベース換算）
    const hasCJK = CJK_REGEX.test(text);
    const readingMin = hasCJK
      ? Math.ceil(charactersNoSpaces / 500) // 日本語は500字/分
      : Math.ceil(words / 200); // 英語は200語/分

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
    <div className="space-y-6">
      <textarea
        className="input"
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        style={{ resize: "vertical", minHeight: "200px" }}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatBox label={t("words")} value={stats.words} />
        <StatBox label={t("characters")} value={stats.characters} />
        <StatBox
          label={t("characters_no_spaces")}
          value={stats.charactersNoSpaces}
        />
        <StatBox label={t("sentences")} value={stats.sentences} />
        <StatBox label={t("paragraphs")} value={stats.paragraphs} />
        <StatBox
          label={t("reading_time")}
          value={`${stats.readingMin} ${t("reading_time_minutes")}`}
        />
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{
        background: "var(--color-accent-soft)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        className="text-xs uppercase tracking-wide mb-1"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </div>
      <div
        className="text-2xl font-bold"
        style={{ color: "var(--color-text)" }}
      >
        {value}
      </div>
    </div>
  );
}
