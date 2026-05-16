"use client";

import { useState, useMemo } from "react";
import translations from "./translations.json";

type System = "metric" | "imperial";
type Category = "underweight" | "normal" | "overweight" | "obese";

function getCategory(bmi: number): Category {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

const CATEGORY_COLOR: Record<Category, string> = {
  underweight: "#60a5fa",
  normal: "#10b981",
  overweight: "#f59e0b",
  obese: "#ef4444",
};

export default function BMICalculator({ locale }: { locale: string }) {
  // 翻訳取得（フォールバックは英語）
  const t = (key: keyof (typeof translations)["en"]) => {
    const dict =
      (translations as Record<string, Record<string, string>>)[locale] ||
      translations.en;
    return dict[key] || translations.en[key];
  };

  const [system, setSystem] = useState<System>("metric");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  const bmi = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return null;

    if (system === "metric") {
      // 身長cm → m
      const heightM = h / 100;
      return w / (heightM * heightM);
    } else {
      // imperial: lb / in^2 × 703
      return (w / (h * h)) * 703;
    }
  }, [height, weight, system]);

  const category = bmi !== null ? getCategory(bmi) : null;

  const heightUnit = system === "metric" ? t("height_unit_cm") : t("height_unit_in");
  const weightUnit = system === "metric" ? t("weight_unit_kg") : t("weight_unit_lb");

  return (
    <div className="space-y-6">
      {/* 単位系切替 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSystem("metric")}
          className={system === "metric" ? "btn-primary" : "btn-secondary"}
        >
          {t("system_metric")}
        </button>
        <button
          type="button"
          onClick={() => setSystem("imperial")}
          className={system === "imperial" ? "btn-primary" : "btn-secondary"}
        >
          {t("system_imperial")}
        </button>
      </div>

      {/* 入力欄 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text)" }}
          >
            {t("height_label")} ({heightUnit})
          </label>
          <input
            type="number"
            inputMode="decimal"
            className="input"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min={0}
            step="0.1"
            placeholder={system === "metric" ? "170" : "67"}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text)" }}
          >
            {t("weight_label")} ({weightUnit})
          </label>
          <input
            type="number"
            inputMode="decimal"
            className="input"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min={0}
            step="0.1"
            placeholder={system === "metric" ? "65" : "150"}
          />
        </div>
      </div>

      {/* 結果 */}
      {bmi !== null && category && (
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: "var(--color-accent-soft)",
            borderLeft: `4px solid ${CATEGORY_COLOR[category]}`,
          }}
        >
          <div
            className="text-sm uppercase tracking-wide mb-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("your_bmi")}
          </div>
          <div
            className="text-5xl font-bold mb-2"
            style={{ color: CATEGORY_COLOR[category] }}
          >
            {bmi.toFixed(1)}
          </div>
          <div className="text-lg font-semibold">
            {t(`category_${category}` as keyof (typeof translations)["en"])}
          </div>
        </div>
      )}

      {/* 解説 */}
      {category && (
        <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          <h3
            className="font-semibold mb-2 text-base"
            style={{ color: "var(--color-text)" }}
          >
            {t("interpretation_title")}
          </h3>
          <p className="mb-3">
            {t(
              `interpretation_${category}` as keyof (typeof translations)["en"]
            )}
          </p>
          <p className="text-xs italic">{t("disclaimer")}</p>
        </div>
      )}
    </div>
  );
}
