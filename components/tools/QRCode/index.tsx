"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import translations from "./translations.json";

type Level = "L" | "M" | "Q" | "H";

export default function QRCodeGenerator({ locale }: { locale: string }) {
  const t = (key: keyof (typeof translations)["en"]) => {
    const dict =
      (translations as Record<string, Record<string, string>>)[locale] ||
      translations.en;
    return dict[key] || translations.en[key];
  };

  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(300);
  const [level, setLevel] = useState<Level>("M");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !text) return;

    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: level,
      color: {
        dark: "#18181b",
        light: "#ffffff",
      },
    }).catch((err) => {
      console.error("QR generation failed:", err);
    });
  }, [text, size, level]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `qrcode-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* 入力欄 */}
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-text)" }}
        >
          {t("input_label")}
        </label>
        <textarea
          className="input"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("input_placeholder")}
          style={{ resize: "vertical" }}
        />
      </div>

      {/* オプション */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text)" }}
          >
            {t("size_label")} ({size}px)
          </label>
          <input
            type="range"
            min={150}
            max={600}
            step={50}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text)" }}
          >
            {t("error_correction_label")}
          </label>
          <select
            className="input"
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
          >
            <option value="L">{t("level_low")}</option>
            <option value="M">{t("level_medium")}</option>
            <option value="Q">{t("level_quartile")}</option>
            <option value="H">{t("level_high")}</option>
          </select>
        </div>
      </div>

      {/* QRコードプレビュー */}
      {text && (
        <div className="flex flex-col items-center gap-4 py-4">
          <div
            className="rounded-2xl p-4"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <canvas ref={canvasRef} />
          </div>
          <button
            type="button"
            onClick={handleDownload}
            className="btn-primary"
          >
            ⬇ {t("download_png")}
          </button>
        </div>
      )}
    </div>
  );
}
