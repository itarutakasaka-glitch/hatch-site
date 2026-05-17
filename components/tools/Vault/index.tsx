"use client";

import { useState, useMemo } from "react";
import translations from "./translations.json";

const RATES = {
  health: {
    tokyo: 0.0998,
    osaka: 0.1034,
    aichi: 0.1003,
    fukuoka: 0.1035,
    hokkaido: 0.1021,
    other: 0.1,
  } as Record<string, number>,
  care: 0.0159,
  pension: 0.183,
  employment: 0.006,
};

function getStandardMonthly(salary: number): number {
  const grades: [number, number, number][] = [
    [0, 63000, 58000], [63000, 73000, 68000], [73000, 83000, 78000], [83000, 93000, 88000],
    [93000, 101000, 98000], [101000, 107000, 104000], [107000, 114000, 110000], [114000, 122000, 118000],
    [122000, 130000, 126000], [130000, 138000, 134000], [138000, 146000, 142000], [146000, 155000, 150000],
    [155000, 165000, 160000], [165000, 175000, 170000], [175000, 185000, 180000], [185000, 195000, 190000],
    [195000, 210000, 200000], [210000, 230000, 220000], [230000, 250000, 240000], [250000, 270000, 260000],
    [270000, 290000, 280000], [290000, 310000, 300000], [310000, 330000, 320000], [330000, 350000, 340000],
    [350000, 370000, 360000], [370000, 395000, 380000], [395000, 425000, 410000], [425000, 455000, 440000],
    [455000, 485000, 470000], [485000, 515000, 500000], [515000, 545000, 530000], [545000, 575000, 560000],
    [575000, 605000, 590000], [605000, 635000, 620000], [635000, 665000, 650000], [665000, 695000, 680000],
    [695000, 730000, 710000], [730000, 770000, 750000], [770000, 810000, 790000], [810000, 855000, 830000],
    [855000, 905000, 880000], [905000, 955000, 930000], [955000, 1005000, 980000], [1005000, 1055000, 1030000],
    [1055000, 1115000, 1090000], [1115000, 1175000, 1150000], [1175000, 1235000, 1210000],
    [1235000, 1295000, 1270000], [1295000, 1355000, 1330000], [1355000, Infinity, 1390000],
  ];
  for (const [min, max, std] of grades) {
    if (salary >= min && salary < max) return std;
  }
  return 1390000;
}

function calcIncomeTax(monthly: number, dependents: number, socialDeduct: number): number {
  const taxable = Math.max(0, monthly - socialDeduct);
  const brackets: [number, number][] = [
    [88000, 0], [105000, 0.025], [125000, 0.05], [150000, 0.063], [180000, 0.076],
    [220000, 0.083], [260000, 0.099], [300000, 0.108], [340000, 0.116],
    [380000, 0.13], [430000, 0.143], [Infinity, 0.2],
  ];
  let tax = 0;
  for (const [limit, rate] of brackets) {
    if (taxable < limit) {
      tax = taxable * rate;
      break;
    }
  }
  const dependentDeduct = dependents * 1610;
  return Math.max(0, Math.round(tax - dependentDeduct));
}

export default function SalaryCalculator({ locale }: { locale: string }) {
  const t = (key: keyof (typeof translations)["en"]) => {
    const dict =
      (translations as Record<string, Record<string, string>>)[locale] ||
      translations.en;
    return dict[key] || translations.en[key];
  };

  const [monthly, setMonthly] = useState(300000);
  const [monthlyStr, setMonthlyStr] = useState("300,000");
  const [age, setAge] = useState(35);
  const [dependents, setDependents] = useState(0);
  const [prefecture, setPrefecture] = useState("tokyo");
  const [year, setYear] = useState<"2026" | "2025">("2026");
  const [hasResidentTax, setHasResidentTax] = useState(true);
  const [hasSocialInsurance, setHasSocialInsurance] = useState(true);
  const [hasEmploymentInsurance, setHasEmploymentInsurance] = useState(true);

  const calc = useMemo(() => {
    const standardMonthly = getStandardMonthly(monthly);
    const isCareEligible = age >= 40 && age < 65;

    let health = 0, care = 0, pension = 0, employment = 0;
    if (hasSocialInsurance) {
      const healthRate = RATES.health[prefecture] ?? RATES.health.other;
      health = Math.round((standardMonthly * healthRate) / 2);
      if (isCareEligible) care = Math.round((standardMonthly * RATES.care) / 2);
      pension = Math.round((standardMonthly * RATES.pension) / 2);
    }
    if (hasEmploymentInsurance) {
      employment = Math.round(monthly * RATES.employment);
    }

    const socialDeduct = health + care + pension + employment;
    const incomeTax = calcIncomeTax(monthly, dependents, socialDeduct);
    const residentTax = hasResidentTax ? Math.round(monthly * 0.05) : 0;
    const totalDeduct = socialDeduct + incomeTax + residentTax;
    const net = monthly - totalDeduct;

    return {
      isCareEligible,
      health, care, pension, employment,
      incomeTax, residentTax,
      totalDeduct, net,
      netPct: monthly > 0 ? ((net / monthly) * 100).toFixed(1) : "0.0",
      annual: net * 12,
      hourly: Math.round(net / 160),
      taxBurden: monthly > 0 ? ((totalDeduct / monthly) * 100).toFixed(1) : "0.0",
    };
  }, [monthly, age, dependents, prefecture, hasResidentTax, hasSocialInsurance, hasEmploymentInsurance]);

  const fmt = (n: number) => Math.round(n).toLocaleString(locale === "ja" ? "ja-JP" : "en-US");

  const today = new Date();
  const briefDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}`;

  const handleMonthlyChange = (raw: string) => {
    const num = raw.replace(/[^\d]/g, "");
    const n = parseInt(num) || 0;
    setMonthly(n);
    setMonthlyStr(num ? n.toLocaleString("ja-JP") : "");
  };

  return (
    <div className="vault-root">
      <header className="vault-topbar">
        <div className="top-brand">
          <div className="top-mark">V</div>
          <div className="top-name">
            {t("brand")}<em>·</em>{t("brand_sub")}
          </div>
        </div>
        <div className="top-meta">
          <span>{t("top_label_year")} <strong>{t("year_reiwa8")}</strong></span>
          <span>{t("top_label_status")} <strong>{t("status_active")}</strong></span>
        </div>
      </header>

      <div className="vault-wrap">
        <section className="hero">
          <div className="hero-case">— {t("hero_case")} —</div>
          <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: t("hero_title") }} />
          <p className="hero-lead">{t("hero_lead")}</p>
          <div className="hero-badges">
            <span className="hero-badge"><strong>{t("badge1_strong")}</strong> {t("badge1")}</span>
            <span className="hero-badge"><strong>{t("badge2_strong")}</strong> {t("badge2")}</span>
            <span className="hero-badge"><strong>{t("badge3_strong")}</strong> {t("badge3")}</span>
          </div>
        </section>

        <div className="grid">
          <div className="folder">
            <div className="folder-head">
              <div className="folder-eyebrow">{t("folder_eyebrow")}</div>
              <h2 className="folder-title" dangerouslySetInnerHTML={{ __html: t("folder_title") }} />
            </div>

            <div className="field">
              <label className="field-label">{t("label_year")}</label>
              <div className="year-tabs">
                <button
                  type="button"
                  className={`year-tab ${year === "2026" ? "active" : ""}`}
                  onClick={() => setYear("2026")}
                >
                  {t("year_2026")}
                  <span className="year-sub">{t("year_2026_sub")}</span>
                </button>
                <button
                  type="button"
                  className={`year-tab ${year === "2025" ? "active" : ""}`}
                  onClick={() => setYear("2025")}
                >
                  {t("year_2025")}
                  <span className="year-sub">{t("year_2025_sub")}</span>
                </button>
              </div>
            </div>

            <div className="field">
              <label className="field-label">{t("label_monthly")}</label>
              <div className="input-money">
                <span className="yen-symbol">¥</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={monthlyStr}
                  onChange={(e) => handleMonthlyChange(e.target.value)}
                />
                <span className="currency">{t("unit_yen")}</span>
              </div>
              <div className="field-hint">{t("hint_monthly")}</div>
            </div>

            <div className="field-row">
              <div className="field">
                <label className="field-label">{t("label_age")}</label>
                <input
                  type="number"
                  className="input-num"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  min={15}
                  max={75}
                />
                <div className="field-hint">{t("hint_age")}</div>
              </div>
              <div className="field">
                <label className="field-label">{t("label_dependents")}</label>
                <input
                  type="number"
                  className="input-num"
                  value={dependents}
                  onChange={(e) => setDependents(parseInt(e.target.value) || 0)}
                  min={0}
                  max={10}
                />
                <div className="field-hint">{t("hint_dependents")}</div>
              </div>
            </div>

            <div className="field">
              <label className="field-label">{t("label_prefecture")}</label>
              <select value={prefecture} onChange={(e) => setPrefecture(e.target.value)}>
                <option value="tokyo">{t("pref_tokyo")}</option>
                <option value="osaka">{t("pref_osaka")}</option>
                <option value="aichi">{t("pref_aichi")}</option>
                <option value="fukuoka">{t("pref_fukuoka")}</option>
                <option value="hokkaido">{t("pref_hokkaido")}</option>
                <option value="other">{t("pref_other")}</option>
              </select>
              <div className="field-hint">{t("hint_prefecture")}</div>
            </div>

            <div className="field">
              <label className="field-label">{t("label_conditions")}</label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={hasResidentTax}
                  onChange={(e) => setHasResidentTax(e.target.checked)}
                />
                <div className="check-box" />
                <span className="check-label">
                  {t("cond_resident_tax")}
                  <small>{t("cond_resident_tax_sub")}</small>
                </span>
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={hasSocialInsurance}
                  onChange={(e) => setHasSocialInsurance(e.target.checked)}
                />
                <div className="check-box" />
                <span className="check-label">{t("cond_social_insurance")}</span>
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={hasEmploymentInsurance}
                  onChange={(e) => setHasEmploymentInsurance(e.target.checked)}
                />
                <div className="check-box" />
                <span className="check-label">{t("cond_employment_insurance")}</span>
              </label>
            </div>
          </div>

          <div className="brief">
            <div className="stamp">
              <div className="stamp-box">
                <div className="top-line">{t("stamp_top")}</div>
                <div className="bottom-line">{t("stamp_bottom")}</div>
              </div>
            </div>

            <div className="letterhead">
              <div className="lh-mark">V</div>
              <div className="lh-firm" dangerouslySetInnerHTML={{ __html: t("firm_name") }} />
              <div className="lh-tag">{t("firm_tag")}</div>
            </div>

            <div className="doc-title">
              <div className="doc-title-main">{t("doc_title_main")}</div>
              <div className="doc-title-sub"><em>{t("doc_title_sub")}</em></div>
              <div className="doc-meta">
                <span>{t("meta_brief_no")} No. 001</span>
                <span>{briefDate}</span>
              </div>
            </div>

            <div className="section">
              <div className="section-head">
                <h3>{t("section_earnings")}</h3>
                <span className="id">{t("section_earnings_id")}</span>
              </div>
              <div className="line">
                <div className="line-label">{t("line_gross")}</div>
                <div className="line-value">
                  <span className="yen-sm">¥</span>{fmt(monthly)}
                </div>
              </div>
              <div className="subtotal">
                <div className="subtotal-label">{t("subtotal_gross")}</div>
                <div className="subtotal-value">
                  <span className="yen-sm" style={{ fontSize: "14px", color: "var(--vault-ink-3)", fontWeight: 400 }}>¥</span>{fmt(monthly)}
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-head">
                <h3>{t("section_deductions")}</h3>
                <span className="id">{t("section_deductions_id")}</span>
              </div>
              <div className="line minus">
                <div className="line-label">
                  {t("line_health")}<span className="sub">{t("line_health_sub")}</span>
                </div>
                <div className="line-value"><span className="yen-sm">¥</span>{fmt(calc.health)}</div>
              </div>
              {calc.isCareEligible && (
                <div className="line minus">
                  <div className="line-label">
                    {t("line_care")}<span className="sub">{t("line_care_sub")}</span>
                  </div>
                  <div className="line-value"><span className="yen-sm">¥</span>{fmt(calc.care)}</div>
                </div>
              )}
              <div className="line minus">
                <div className="line-label">
                  {t("line_pension")}<span className="sub">9.15%</span>
                </div>
                <div className="line-value"><span className="yen-sm">¥</span>{fmt(calc.pension)}</div>
              </div>
              <div className="line minus">
                <div className="line-label">
                  {t("line_employment")}<span className="sub">0.6%</span>
                </div>
                <div className="line-value"><span className="yen-sm">¥</span>{fmt(calc.employment)}</div>
              </div>
              <div className="line minus">
                <div className="line-label">
                  {t("line_income_tax")}<span className="sub">{t("line_income_tax_sub")}</span>
                </div>
                <div className="line-value"><span className="yen-sm">¥</span>{fmt(calc.incomeTax)}</div>
              </div>
              <div className="line minus">
                <div className="line-label">
                  {t("line_resident_tax")}<span className="sub">{t("line_resident_tax_sub")}</span>
                </div>
                <div className="line-value"><span className="yen-sm">¥</span>{fmt(calc.residentTax)}</div>
              </div>
              <div className="subtotal">
                <div className="subtotal-label">{t("subtotal_deductions")}</div>
                <div className="subtotal-value">
                  −<span className="yen-sm" style={{ fontSize: "14px", color: "var(--vault-ink-3)", fontWeight: 400 }}>¥</span>{fmt(calc.totalDeduct)}
                </div>
              </div>
            </div>

            <div className="net-block">
              <div className="net-eyebrow">{t("net_eyebrow")}</div>
              <div className="net-label">{t("net_label")}</div>
              <div className="net-value">
                <span className="yen-big">¥</span>
                <span>{fmt(calc.net)}</span>
              </div>
              <div className="net-sub" dangerouslySetInnerHTML={{
                __html: t("net_sub").replace("{pct}", calc.netPct)
              }} />
            </div>
          </div>
        </div>

        <section className="insights">
          <div className="insight featured">
            <div className="insight-num-jp">{t("insight1_num")}</div>
            <div className="insight-key">{t("insight1_key")}</div>
            <div className="insight-val"><span className="yen">¥</span>{fmt(calc.annual)}</div>
            <p className="insight-cap">{t("insight1_cap")}</p>
          </div>
          <div className="insight">
            <div className="insight-num-jp">{t("insight2_num")}</div>
            <div className="insight-key">{t("insight2_key")}</div>
            <div className="insight-val">
              <span className="yen">¥</span>{fmt(calc.hourly)}
              <span className="unit">{t("insight2_unit")}</span>
            </div>
            <p className="insight-cap">{t("insight2_cap")}</p>
          </div>
          <div className="insight">
            <div className="insight-num-jp">{t("insight3_num")}</div>
            <div className="insight-key">{t("insight3_key")}</div>
            <div className="insight-val">
              {calc.taxBurden}<span className="unit">%</span>
            </div>
            <p className="insight-cap">{t("insight3_cap")}</p>
          </div>
        </section>

        <section className="notes">
          <div className="notes-head">
            <div className="notes-eyebrow">— {t("notes_eyebrow")} —</div>
            <h2 className="notes-title" dangerouslySetInnerHTML={{ __html: t("notes_title") }} />
          </div>
          <div className="notes-grid">
            <div className="note-card">
              <div className="note-num">{t("note1_num")}</div>
              <h3 className="note-title">{t("note1_title")}</h3>
              <p className="note-body" dangerouslySetInnerHTML={{ __html: t("note1_body") }} />
            </div>
            <div className="note-card">
              <div className="note-num">{t("note2_num")}</div>
              <h3 className="note-title">{t("note2_title")}</h3>
              <p className="note-body" dangerouslySetInnerHTML={{ __html: t("note2_body") }} />
            </div>
            <div className="note-card">
              <div className="note-num">{t("note3_num")}</div>
              <h3 className="note-title">{t("note3_title")}</h3>
              <p className="note-body" dangerouslySetInnerHTML={{ __html: t("note3_body") }} />
            </div>
            <div className="note-card">
              <div className="note-num">{t("note4_num")}</div>
              <h3 className="note-title">{t("note4_title")}</h3>
              <p className="note-body" dangerouslySetInnerHTML={{ __html: t("note4_body") }} />
            </div>
          </div>
        </section>

        <footer className="foot">
          <span className="foot-mark" dangerouslySetInnerHTML={{ __html: t("foot_mark") }} />
          <span>{t("foot_note")}</span>
        </footer>
      </div>
    </div>
  );
}
