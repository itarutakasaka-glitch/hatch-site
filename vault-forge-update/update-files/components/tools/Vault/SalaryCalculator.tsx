"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";

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

export default function SalaryCalculator() {
  const t = useTranslations("tools.vaultSalary");
  const locale = useLocale();

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
      {/* Top bar */}
      <header className="vault-topbar">
        <div className="top-brand">
          <div className="top-mark">V</div>
          <div className="top-name">
            {t("brand")}<em>·</em>{t("brandSub")}
          </div>
        </div>
        <div className="top-meta">
          <span>{t("topLabelYear")} <strong>{t("yearReiwa8")}</strong></span>
          <span>{t("topLabelStatus")} <strong>{t("statusActive")}</strong></span>
        </div>
      </header>

      <div className="vault-wrap">
        {/* Hero */}
        <section className="hero">
          <div className="hero-case">— {t("heroCase")} —</div>
          <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: t.raw("heroTitle") }} />
          <p className="hero-lead">{t("heroLead")}</p>
          <div className="hero-badges">
            <span className="hero-badge"><strong>{t("badge1Strong")}</strong> {t("badge1")}</span>
            <span className="hero-badge"><strong>{t("badge2Strong")}</strong> {t("badge2")}</span>
            <span className="hero-badge"><strong>{t("badge3Strong")}</strong> {t("badge3")}</span>
          </div>
        </section>

        <div className="grid">
          {/* Folder (input) */}
          <div className="folder">
            <div className="folder-head">
              <div className="folder-eyebrow">{t("folderEyebrow")}</div>
              <h2 className="folder-title" dangerouslySetInnerHTML={{ __html: t.raw("folderTitle") }} />
            </div>

            <div className="field">
              <label className="field-label">{t("labelYear")}</label>
              <div className="year-tabs">
                <button
                  type="button"
                  className={`year-tab ${year === "2026" ? "active" : ""}`}
                  onClick={() => setYear("2026")}
                >
                  {t("year2026")}
                  <span className="year-sub">{t("year2026Sub")}</span>
                </button>
                <button
                  type="button"
                  className={`year-tab ${year === "2025" ? "active" : ""}`}
                  onClick={() => setYear("2025")}
                >
                  {t("year2025")}
                  <span className="year-sub">{t("year2025Sub")}</span>
                </button>
              </div>
            </div>

            <div className="field">
              <label className="field-label">{t("labelMonthly")}</label>
              <div className="input-money">
                <span className="yen-symbol">¥</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={monthlyStr}
                  onChange={(e) => handleMonthlyChange(e.target.value)}
                />
                <span className="currency">{t("unitYen")}</span>
              </div>
              <div className="field-hint">{t("hintMonthly")}</div>
            </div>

            <div className="field-row">
              <div className="field">
                <label className="field-label">{t("labelAge")}</label>
                <input
                  type="number"
                  className="input-num"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  min={15}
                  max={75}
                />
                <div className="field-hint">{t("hintAge")}</div>
              </div>
              <div className="field">
                <label className="field-label">{t("labelDependents")}</label>
                <input
                  type="number"
                  className="input-num"
                  value={dependents}
                  onChange={(e) => setDependents(parseInt(e.target.value) || 0)}
                  min={0}
                  max={10}
                />
                <div className="field-hint">{t("hintDependents")}</div>
              </div>
            </div>

            <div className="field">
              <label className="field-label">{t("labelPrefecture")}</label>
              <select value={prefecture} onChange={(e) => setPrefecture(e.target.value)}>
                <option value="tokyo">{t("prefTokyo")}</option>
                <option value="osaka">{t("prefOsaka")}</option>
                <option value="aichi">{t("prefAichi")}</option>
                <option value="fukuoka">{t("prefFukuoka")}</option>
                <option value="hokkaido">{t("prefHokkaido")}</option>
                <option value="other">{t("prefOther")}</option>
              </select>
              <div className="field-hint">{t("hintPrefecture")}</div>
            </div>

            <div className="field">
              <label className="field-label">{t("labelConditions")}</label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={hasResidentTax}
                  onChange={(e) => setHasResidentTax(e.target.checked)}
                />
                <div className="check-box" />
                <span className="check-label">
                  {t("condResidentTax")}
                  <small>{t("condResidentTaxSub")}</small>
                </span>
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={hasSocialInsurance}
                  onChange={(e) => setHasSocialInsurance(e.target.checked)}
                />
                <div className="check-box" />
                <span className="check-label">{t("condSocialInsurance")}</span>
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={hasEmploymentInsurance}
                  onChange={(e) => setHasEmploymentInsurance(e.target.checked)}
                />
                <div className="check-box" />
                <span className="check-label">{t("condEmploymentInsurance")}</span>
              </label>
            </div>
          </div>

          {/* Brief (output) */}
          <div className="brief">
            <div className="stamp">
              <div className="stamp-box">
                <div className="top-line">{t("stampTop")}</div>
                <div className="bottom-line">{t("stampBottom")}</div>
              </div>
            </div>

            <div className="letterhead">
              <div className="lh-mark">V</div>
              <div className="lh-firm" dangerouslySetInnerHTML={{ __html: t.raw("firmName") }} />
              <div className="lh-tag">{t("firmTag")}</div>
            </div>

            <div className="doc-title">
              <div className="doc-title-main">{t("docTitleMain")}</div>
              <div className="doc-title-sub"><em>{t("docTitleSub")}</em></div>
              <div className="doc-meta">
                <span>{t("metaBriefNo")} No. 001</span>
                <span>{briefDate}</span>
              </div>
            </div>

            <div className="section">
              <div className="section-head">
                <h3>{t("sectionEarnings")}</h3>
                <span className="id">{t("sectionEarningsId")}</span>
              </div>
              <div className="line">
                <div className="line-label">{t("lineGross")}</div>
                <div className="line-value">
                  <span className="yen-sm">¥</span>{fmt(monthly)}
                </div>
              </div>
              <div className="subtotal">
                <div className="subtotal-label">{t("subtotalGross")}</div>
                <div className="subtotal-value">
                  <span className="yen-sm" style={{ fontSize: "14px", color: "var(--ink-3)", fontWeight: 400 }}>¥</span>{fmt(monthly)}
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-head">
                <h3>{t("sectionDeductions")}</h3>
                <span className="id">{t("sectionDeductionsId")}</span>
              </div>
              <div className="line minus">
                <div className="line-label">
                  {t("lineHealth")}<span className="sub">{t("lineHealthSub")}</span>
                </div>
                <div className="line-value"><span className="yen-sm">¥</span>{fmt(calc.health)}</div>
              </div>
              {calc.isCareEligible && (
                <div className="line minus">
                  <div className="line-label">
                    {t("lineCare")}<span className="sub">{t("lineCareSub")}</span>
                  </div>
                  <div className="line-value"><span className="yen-sm">¥</span>{fmt(calc.care)}</div>
                </div>
              )}
              <div className="line minus">
                <div className="line-label">
                  {t("linePension")}<span className="sub">9.15%</span>
                </div>
                <div className="line-value"><span className="yen-sm">¥</span>{fmt(calc.pension)}</div>
              </div>
              <div className="line minus">
                <div className="line-label">
                  {t("lineEmployment")}<span className="sub">0.6%</span>
                </div>
                <div className="line-value"><span className="yen-sm">¥</span>{fmt(calc.employment)}</div>
              </div>
              <div className="line minus">
                <div className="line-label">
                  {t("lineIncomeTax")}<span className="sub">{t("lineIncomeTaxSub")}</span>
                </div>
                <div className="line-value"><span className="yen-sm">¥</span>{fmt(calc.incomeTax)}</div>
              </div>
              <div className="line minus">
                <div className="line-label">
                  {t("lineResidentTax")}<span className="sub">{t("lineResidentTaxSub")}</span>
                </div>
                <div className="line-value"><span className="yen-sm">¥</span>{fmt(calc.residentTax)}</div>
              </div>
              <div className="subtotal">
                <div className="subtotal-label">{t("subtotalDeductions")}</div>
                <div className="subtotal-value">
                  −<span className="yen-sm" style={{ fontSize: "14px", color: "var(--ink-3)", fontWeight: 400 }}>¥</span>{fmt(calc.totalDeduct)}
                </div>
              </div>
            </div>

            <div className="net-block">
              <div className="net-eyebrow">{t("netEyebrow")}</div>
              <div className="net-label">{t("netLabel")}</div>
              <div className="net-value">
                <span className="yen-big">¥</span>
                <span>{fmt(calc.net)}</span>
              </div>
              <div className="net-sub" dangerouslySetInnerHTML={{
                __html: t.raw("netSub").replace("{pct}", calc.netPct)
              }} />
            </div>
          </div>
        </div>

        {/* Insights */}
        <section className="insights">
          <div className="insight featured">
            <div className="insight-num-jp">{t("insight1Num")}</div>
            <div className="insight-key">{t("insight1Key")}</div>
            <div className="insight-val"><span className="yen">¥</span>{fmt(calc.annual)}</div>
            <p className="insight-cap">{t("insight1Cap")}</p>
          </div>
          <div className="insight">
            <div className="insight-num-jp">{t("insight2Num")}</div>
            <div className="insight-key">{t("insight2Key")}</div>
            <div className="insight-val">
              <span className="yen">¥</span>{fmt(calc.hourly)}
              <span className="unit">{t("insight2Unit")}</span>
            </div>
            <p className="insight-cap">{t("insight2Cap")}</p>
          </div>
          <div className="insight">
            <div className="insight-num-jp">{t("insight3Num")}</div>
            <div className="insight-key">{t("insight3Key")}</div>
            <div className="insight-val">
              {calc.taxBurden}<span className="unit">%</span>
            </div>
            <p className="insight-cap">{t("insight3Cap")}</p>
          </div>
        </section>

        {/* Notes */}
        <section className="notes">
          <div className="notes-head">
            <div className="notes-eyebrow">— {t("notesEyebrow")} —</div>
            <h2 className="notes-title" dangerouslySetInnerHTML={{ __html: t.raw("notesTitle") }} />
          </div>
          <div className="notes-grid">
            <div className="note-card">
              <div className="note-num">{t("note1Num")}</div>
              <h3 className="note-title">{t("note1Title")}</h3>
              <p className="note-body" dangerouslySetInnerHTML={{ __html: t.raw("note1Body") }} />
            </div>
            <div className="note-card">
              <div className="note-num">{t("note2Num")}</div>
              <h3 className="note-title">{t("note2Title")}</h3>
              <p className="note-body" dangerouslySetInnerHTML={{ __html: t.raw("note2Body") }} />
            </div>
            <div className="note-card">
              <div className="note-num">{t("note3Num")}</div>
              <h3 className="note-title">{t("note3Title")}</h3>
              <p className="note-body" dangerouslySetInnerHTML={{ __html: t.raw("note3Body") }} />
            </div>
            <div className="note-card">
              <div className="note-num">{t("note4Num")}</div>
              <h3 className="note-title">{t("note4Title")}</h3>
              <p className="note-body" dangerouslySetInnerHTML={{ __html: t.raw("note4Body") }} />
            </div>
          </div>
        </section>

        <footer className="foot">
          <span className="foot-mark" dangerouslySetInnerHTML={{ __html: t.raw("footMark") }} />
          <span>{t("footNote")}</span>
        </footer>
      </div>
    </div>
  );
}
