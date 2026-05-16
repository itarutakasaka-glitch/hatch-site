"use client";

import { useState, useMemo, useEffect } from "react";
import translations from "./translations.json";

type System = "metric" | "imperial";
type Category = "underweight" | "normal" | "overweight" | "obese";

function getCategory(bmi: number): Category {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

// BMI を 0-100 のメーター位置にマップ（10〜40 を 0〜100 にスケール）
function bmiToMeterPosition(bmi: number): number {
  const min = 12;
  const max = 38;
  return Math.max(0, Math.min(100, ((bmi - min) / (max - min)) * 100));
}

const CATEGORY_PALETTE: Record<
  Category,
  { color: string; light: string; emoji: string }
> = {
  underweight: { color: "#60A5FA", light: "rgba(96, 165, 250, 0.2)", emoji: "🌱" },
  normal: { color: "#10B981", light: "rgba(16, 185, 129, 0.2)", emoji: "✨" },
  overweight: { color: "#F59E0B", light: "rgba(245, 158, 11, 0.2)", emoji: "🌤" },
  obese: { color: "#EF4444", light: "rgba(239, 68, 68, 0.2)", emoji: "🔔" },
};

export default function BMICalculator({ locale }: { locale: string }) {
  const t = (key: keyof (typeof translations)["en"]) => {
    const dict =
      (translations as Record<string, Record<string, string>>)[locale] ||
      translations.en;
    return dict[key] || translations.en[key];
  };

  const [system, setSystem] = useState<System>("metric");
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(65);
  const [animatedBmi, setAnimatedBmi] = useState<number>(0);

  const bmi = useMemo(() => {
    if (!height || !weight || height <= 0 || weight <= 0) return null;
    if (system === "metric") {
      const heightM = height / 100;
      return weight / (heightM * heightM);
    } else {
      return (weight / (height * height)) * 703;
    }
  }, [height, weight, system]);

  // 数値アニメーション
  useEffect(() => {
    if (bmi === null) {
      setAnimatedBmi(0);
      return;
    }
    const start = animatedBmi;
    const end = bmi;
    const duration = 400;
    const startTime = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setAnimatedBmi(start + (end - start) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bmi]);

  const category = bmi !== null ? getCategory(bmi) : null;
  const palette = category ? CATEGORY_PALETTE[category] : CATEGORY_PALETTE.normal;
  const meterPos = bmi !== null ? bmiToMeterPosition(bmi) : 50;

  // 単位系切り替え時の値変換
  const switchSystem = (newSystem: System) => {
    if (newSystem === system) return;
    if (newSystem === "imperial") {
      setHeight(Math.round(height / 2.54 * 10) / 10);
      setWeight(Math.round(weight * 2.20462 * 10) / 10);
    } else {
      setHeight(Math.round(height * 2.54));
      setWeight(Math.round(weight / 2.20462));
    }
    setSystem(newSystem);
  };

  const heightUnit = system === "metric" ? "cm" : "in";
  const weightUnit = system === "metric" ? "kg" : "lb";
  const hMin = system === "metric" ? 100 : 40;
  const hMax = system === "metric" ? 220 : 87;
  const wMin = system === "metric" ? 20 : 44;
  const wMax = system === "metric" ? 200 : 440;

  return (
    <div className="vitalis-root">
      <style jsx>{`
        .vitalis-root {
          min-height: calc(100vh - 80px);
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16, 185, 129, 0.18), transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 100%, rgba(96, 165, 250, 0.15), transparent 60%),
            linear-gradient(180deg, #0B1A1F 0%, #0F2027 100%);
          color: #F5F7F6;
          font-family: "Inter", "Hiragino Sans", "Noto Sans JP", -apple-system, system-ui, sans-serif;
          padding: 48px 16px 80px;
          position: relative;
          overflow: hidden;
        }
        .vitalis-root::before {
          content: "";
          position: absolute;
          top: 10%;
          left: -100px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.25), transparent 70%);
          filter: blur(40px);
          pointer-events: none;
        }
        .vitalis-root::after {
          content: "";
          position: absolute;
          bottom: 5%;
          right: -120px;
          width: 460px;
          height: 460px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(96, 165, 250, 0.2), transparent 70%);
          filter: blur(50px);
          pointer-events: none;
        }
        .container {
          max-width: 720px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6EE7B7;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .eyebrow .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
        }
        .hero-title {
          font-size: clamp(36px, 6vw, 56px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
          margin: 16px 0 12px;
          background: linear-gradient(135deg, #F5F7F6 0%, #6EE7B7 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-sub {
          color: rgba(245, 247, 246, 0.6);
          font-size: 16px;
          max-width: 480px;
          line-height: 1.6;
        }
        .unit-switch {
          display: inline-flex;
          gap: 4px;
          padding: 4px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          margin-top: 32px;
        }
        .unit-btn {
          padding: 8px 20px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(245, 247, 246, 0.6);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }
        .unit-btn.active {
          background: rgba(16, 185, 129, 0.2);
          color: #6EE7B7;
        }
        .panel {
          margin-top: 32px;
          padding: 32px 28px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          backdrop-filter: blur(20px);
        }
        .slider-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .slider-label {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(245, 247, 246, 0.5);
        }
        .slider-value {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }
        .slider-unit {
          font-size: 16px;
          font-weight: 500;
          color: rgba(245, 247, 246, 0.4);
          margin-left: 4px;
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(90deg, rgba(96, 165, 250, 0.4), rgba(16, 185, 129, 0.6), rgba(245, 158, 11, 0.5), rgba(239, 68, 68, 0.5));
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #F5F7F6;
          cursor: grab;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(16, 185, 129, 0.2);
          transition: transform 0.15s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        input[type="range"]::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(0.95);
        }
        input[type="range"]::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #F5F7F6;
          border: none;
          cursor: grab;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(16, 185, 129, 0.2);
        }
        .slider-block + .slider-block {
          margin-top: 28px;
        }

        /* Result display */
        .result-block {
          margin-top: 36px;
          text-align: center;
          padding: 36px 24px 32px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          position: relative;
          overflow: hidden;
        }
        .result-glow {
          position: absolute;
          top: -40%;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 100%;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.5;
          pointer-events: none;
          transition: background 0.4s;
        }
        .result-label {
          position: relative;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(245, 247, 246, 0.5);
          margin-bottom: 8px;
        }
        .result-number {
          position: relative;
          font-size: clamp(72px, 14vw, 120px);
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          transition: color 0.4s;
        }
        .result-category {
          position: relative;
          margin-top: 16px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 22px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.02em;
          transition: all 0.4s;
        }

        /* Meter */
        .meter {
          margin-top: 36px;
          position: relative;
        }
        .meter-bar {
          height: 14px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            #60A5FA 0%,
            #60A5FA 23%,
            #10B981 23%,
            #10B981 52%,
            #F59E0B 52%,
            #F59E0B 77%,
            #EF4444 77%,
            #EF4444 100%
          );
          position: relative;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        .meter-pointer {
          position: absolute;
          top: -8px;
          width: 4px;
          height: 30px;
          background: #F5F7F6;
          border-radius: 2px;
          transform: translateX(-50%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          transition: left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .meter-pointer::after {
          content: "";
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #F5F7F6;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
        }
        .meter-scale {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(245, 247, 246, 0.4);
          letter-spacing: 0.05em;
        }

        /* Category cards */
        .cat-grid {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 640px) {
          .cat-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .cat-card {
          padding: 16px 12px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          text-align: center;
          transition: all 0.3s;
        }
        .cat-card.is-active {
          transform: translateY(-2px);
        }
        .cat-card .emoji {
          font-size: 22px;
          margin-bottom: 6px;
          display: block;
        }
        .cat-card .name {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(245, 247, 246, 0.85);
          margin-bottom: 4px;
        }
        .cat-card .range {
          font-size: 11px;
          font-variant-numeric: tabular-nums;
          color: rgba(245, 247, 246, 0.4);
        }

        /* Interpretation */
        .interp {
          margin-top: 36px;
          padding: 28px 24px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-left: 3px solid var(--cat-color, #10B981);
          border-radius: 20px;
        }
        .interp-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--cat-color, #10B981);
          margin-bottom: 10px;
        }
        .interp-body {
          color: rgba(245, 247, 246, 0.8);
          font-size: 15px;
          line-height: 1.7;
        }
        .disclaimer {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 12px;
          color: rgba(245, 247, 246, 0.4);
          line-height: 1.6;
        }
      `}</style>

      <div className="container">
        <span className="eyebrow">
          <span className="dot" /> {t("eyebrow") || "VITALIS · BMI INDEX"}
        </span>

        <h1 className="hero-title">{t("hero_title") || "Your number, your move."}</h1>
        <p className="hero-sub">{t("hero_sub") || "Drag the sliders. Watch your BMI breathe."}</p>

        <div className="unit-switch" role="tablist">
          <button
            className={`unit-btn ${system === "metric" ? "active" : ""}`}
            onClick={() => switchSystem("metric")}
            type="button"
          >
            {t("system_metric")}
          </button>
          <button
            className={`unit-btn ${system === "imperial" ? "active" : ""}`}
            onClick={() => switchSystem("imperial")}
            type="button"
          >
            {t("system_imperial")}
          </button>
        </div>

        <div className="panel">
          <div className="slider-block">
            <div className="slider-row">
              <span className="slider-label">{t("height_label")}</span>
              <span className="slider-value">
                {height}
                <span className="slider-unit">{heightUnit}</span>
              </span>
            </div>
            <input
              type="range"
              min={hMin}
              max={hMax}
              step={system === "metric" ? 1 : 0.5}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              aria-label={t("height_label")}
            />
          </div>
          <div className="slider-block">
            <div className="slider-row">
              <span className="slider-label">{t("weight_label")}</span>
              <span className="slider-value">
                {weight}
                <span className="slider-unit">{weightUnit}</span>
              </span>
            </div>
            <input
              type="range"
              min={wMin}
              max={wMax}
              step={system === "metric" ? 1 : 0.5}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              aria-label={t("weight_label")}
            />
          </div>
        </div>

        {bmi !== null && category && (
          <>
            <div className="result-block">
              <div
                className="result-glow"
                style={{ background: palette.color }}
              />
              <div className="result-label">{t("your_bmi")}</div>
              <div
                className="result-number"
                style={{ color: palette.color }}
              >
                {animatedBmi.toFixed(1)}
              </div>
              <div
                className="result-category"
                style={{
                  background: palette.light,
                  color: palette.color,
                  border: `1px solid ${palette.color}40`,
                }}
              >
                <span>{palette.emoji}</span>
                {t(`category_${category}` as keyof (typeof translations)["en"])}
              </div>

              <div className="meter">
                <div className="meter-bar">
                  <div
                    className="meter-pointer"
                    style={{ left: `${meterPos}%` }}
                  />
                </div>
                <div className="meter-scale">
                  <span>12</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>38</span>
                </div>
              </div>
            </div>

            <div className="cat-grid">
              {(["underweight", "normal", "overweight", "obese"] as Category[]).map(
                (cat) => {
                  const p = CATEGORY_PALETTE[cat];
                  const range =
                    cat === "underweight"
                      ? "< 18.5"
                      : cat === "normal"
                      ? "18.5 – 24.9"
                      : cat === "overweight"
                      ? "25 – 29.9"
                      : "≥ 30";
                  const active = cat === category;
                  return (
                    <div
                      key={cat}
                      className={`cat-card ${active ? "is-active" : ""}`}
                      style={
                        active
                          ? {
                              background: p.light,
                              borderColor: `${p.color}60`,
                              boxShadow: `0 0 0 1px ${p.color}40, 0 8px 24px ${p.color}30`,
                            }
                          : {}
                      }
                    >
                      <span className="emoji">{p.emoji}</span>
                      <div
                        className="name"
                        style={active ? { color: p.color } : {}}
                      >
                        {t(`category_${cat}` as keyof (typeof translations)["en"])}
                      </div>
                      <div className="range">{range}</div>
                    </div>
                  );
                }
              )}
            </div>

            <div
              className="interp"
              style={{ ["--cat-color" as string]: palette.color }}
            >
              <div className="interp-title">{t("interpretation_title")}</div>
              <p className="interp-body">
                {t(
                  `interpretation_${category}` as keyof (typeof translations)["en"]
                )}
              </p>
              <p className="disclaimer">{t("disclaimer")}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
