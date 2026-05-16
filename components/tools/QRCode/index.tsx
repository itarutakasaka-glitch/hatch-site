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

  const [text, setText] = useState("https://bluetanuki.xyz");
  const [size, setSize] = useState(320);
  const [level, setLevel] = useState<Level>("M");
  const [darkColor, setDarkColor] = useState("#00FF9C");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !text) return;
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: level,
      color: {
        dark: darkColor,
        light: "#0A0F0D",
      },
    }).catch(() => {});
  }, [text, size, level, darkColor]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `qr-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const colorPresets = [
    { name: "Signal", value: "#00FF9C" },
    { name: "Cyan", value: "#22D3EE" },
    { name: "Magenta", value: "#F472B6" },
    { name: "Amber", value: "#FBBF24" },
    { name: "White", value: "#FFFFFF" },
  ];

  return (
    <div className="signal-root">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Space+Grotesk:wght@500;700;800&display=swap');

        .signal-root {
          min-height: calc(100vh - 80px);
          background: #0A0F0D;
          padding: 48px 16px 80px;
          font-family: "JetBrains Mono", "Courier New", monospace;
          color: #E4E4E7;
          position: relative;
          overflow: hidden;
        }
        /* Grid lines */
        .signal-root::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 255, 156, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 156, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        /* Glow accents */
        .signal-root::after {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 300px;
          background: radial-gradient(ellipse, rgba(0, 255, 156, 0.15), transparent 70%);
          filter: blur(60px);
          pointer-events: none;
        }
        .container {
          max-width: 720px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .system-line {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          letter-spacing: 0.2em;
          color: rgba(0, 255, 156, 0.7);
          margin-bottom: 8px;
        }
        .blink-dot {
          width: 8px;
          height: 8px;
          background: #00FF9C;
          border-radius: 50%;
          box-shadow: 0 0 12px #00FF9C;
          animation: blink 1.5s infinite;
        }
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.3; }
        }
        .system-line .divider {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(0, 255, 156, 0.3), transparent);
        }
        .system-line .ascii {
          color: rgba(0, 255, 156, 0.4);
          letter-spacing: 0;
        }

        h1.title {
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(40px, 7vw, 64px);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin: 8px 0 14px;
          color: #E4E4E7;
        }
        h1.title .accent {
          color: #00FF9C;
          text-shadow: 0 0 20px rgba(0, 255, 156, 0.6);
        }
        .subtitle {
          color: rgba(228, 228, 231, 0.6);
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          max-width: 540px;
          line-height: 1.6;
        }
        .subtitle .prompt {
          color: #00FF9C;
          margin-right: 8px;
        }

        .terminal {
          margin-top: 36px;
          background: rgba(10, 15, 13, 0.6);
          border: 1px solid rgba(0, 255, 156, 0.2);
          border-radius: 12px;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .terminal-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(0, 255, 156, 0.08);
          border-bottom: 1px solid rgba(0, 255, 156, 0.2);
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(0, 255, 156, 0.8);
        }
        .term-dots {
          display: flex;
          gap: 6px;
        }
        .term-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(228, 228, 231, 0.2);
        }
        .term-dot.red { background: #EF4444; }
        .term-dot.yellow { background: #FBBF24; }
        .term-dot.green { background: #00FF9C; }
        .term-title {
          flex: 1;
          text-align: center;
          color: rgba(228, 228, 231, 0.5);
        }
        .terminal-body {
          padding: 20px;
        }
        .field-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: rgba(0, 255, 156, 0.7);
          letter-spacing: 0.15em;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .field-label::before {
          content: "▸";
          color: #00FF9C;
        }
        textarea, .control-input {
          width: 100%;
          background: rgba(0, 255, 156, 0.04);
          border: 1px solid rgba(0, 255, 156, 0.2);
          border-radius: 8px;
          padding: 12px 14px;
          color: #E4E4E7;
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          resize: vertical;
        }
        textarea:focus, .control-input:focus {
          border-color: #00FF9C;
          box-shadow: 0 0 0 3px rgba(0, 255, 156, 0.15);
        }
        textarea::placeholder { color: rgba(228, 228, 231, 0.3); }

        .controls-row {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 640px) {
          .controls-row { grid-template-columns: 1fr 1fr; }
        }
        .range-block {
          display: flex;
          flex-direction: column;
        }
        .range-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .range-value {
          font-size: 13px;
          color: #00FF9C;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          background: rgba(0, 255, 156, 0.15);
          border-radius: 3px;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #00FF9C;
          border: 2px solid #0A0F0D;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(0, 255, 156, 0.6);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #00FF9C;
          border: 2px solid #0A0F0D;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(0, 255, 156, 0.6);
        }
        select.control-input {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300FF9C' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
        select option {
          background: #0A0F0D;
          color: #E4E4E7;
        }

        .color-row {
          margin-top: 18px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .color-chip {
          padding: 8px 14px;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 999px;
          font-size: 12px;
          color: rgba(228, 228, 231, 0.7);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s;
          font-family: "JetBrains Mono", monospace;
        }
        .color-chip:hover {
          background: rgba(255, 255, 255, 0.06);
        }
        .color-chip.active {
          border-color: currentColor;
          background: rgba(0, 255, 156, 0.08);
        }
        .color-swatch {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
        }

        /* Preview */
        .preview {
          margin-top: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          padding: 32px 24px;
          background: rgba(10, 15, 13, 0.8);
          border: 1px solid rgba(0, 255, 156, 0.2);
          border-radius: 16px;
          position: relative;
        }
        .preview::before {
          content: "OUTPUT";
          position: absolute;
          top: -10px;
          left: 24px;
          padding: 2px 12px;
          background: #0A0F0D;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #00FF9C;
          border: 1px solid rgba(0, 255, 156, 0.3);
          border-radius: 4px;
        }
        .canvas-wrap {
          padding: 16px;
          background: #0A0F0D;
          border: 1px solid rgba(0, 255, 156, 0.4);
          border-radius: 8px;
          box-shadow: 0 0 40px rgba(0, 255, 156, 0.15);
        }
        .download-btn {
          padding: 14px 32px;
          background: #00FF9C;
          color: #0A0F0D;
          border: none;
          border-radius: 999px;
          font-family: "JetBrains Mono", monospace;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 0 4px 20px rgba(0, 255, 156, 0.4);
        }
        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(0, 255, 156, 0.6);
        }
        .download-btn:active {
          transform: translateY(0);
        }
        .meta-row {
          margin-top: 16px;
          display: flex;
          gap: 20px;
          font-size: 11px;
          color: rgba(228, 228, 231, 0.4);
          letter-spacing: 0.1em;
        }
        .meta-row span strong {
          color: #00FF9C;
          margin-right: 4px;
        }
      `}</style>

      <div className="container">
        <div className="system-line">
          <span className="blink-dot" />
          <span>SIGNAL · QR ENCODER v1.0</span>
          <span className="divider" />
          <span className="ascii">// READY</span>
        </div>

        <h1 className="title">
          {t("title_pre") || "Encode."} <span className="accent">{t("title_accent") || "Anything."}</span>
        </h1>
        <p className="subtitle">
          <span className="prompt">$</span>
          {t("subtitle") || "Generate scannable QR codes in monochrome neon."}
        </p>

        <div className="terminal">
          <div className="terminal-header">
            <div className="term-dots">
              <span className="term-dot red" />
              <span className="term-dot yellow" />
              <span className="term-dot green" />
            </div>
            <div className="term-title">~/qr-encoder</div>
            <div style={{ width: 40 }} />
          </div>
          <div className="terminal-body">
            <div className="field-label">{t("input_label")}</div>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("input_placeholder")}
              spellCheck={false}
            />

            <div className="controls-row">
              <div className="range-block">
                <div className="range-row">
                  <span className="field-label" style={{ margin: 0 }}>
                    {t("size_label")}
                  </span>
                  <span className="range-value">{size}px</span>
                </div>
                <input
                  type="range"
                  min={160}
                  max={600}
                  step={20}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                />
              </div>
              <div>
                <div className="field-label">{t("error_correction_label")}</div>
                <select
                  className="control-input"
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

            <div className="field-label" style={{ marginTop: 18 }}>
              {t("color_label") || "Pattern Color"}
            </div>
            <div className="color-row">
              {colorPresets.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`color-chip ${darkColor === c.value ? "active" : ""}`}
                  style={{ color: c.value }}
                  onClick={() => setDarkColor(c.value)}
                >
                  <span
                    className="color-swatch"
                    style={{ background: c.value }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {text && (
          <div className="preview">
            <div className="canvas-wrap">
              <canvas ref={canvasRef} />
            </div>
            <button
              type="button"
              className="download-btn"
              onClick={handleDownload}
            >
              ⬇ {t("download_png")}
            </button>
            <div className="meta-row">
              <span>
                <strong>SIZE</strong>
                {size}×{size}
              </span>
              <span>
                <strong>LEVEL</strong>
                {level}
              </span>
              <span>
                <strong>BYTES</strong>
                {new Blob([text]).size}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
