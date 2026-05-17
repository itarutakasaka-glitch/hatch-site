// hatch-site/lib/tools/registry.ts に追加するエントリ
// 既存の bmi, word-counter, qr-code に加えて salary を追加

export const TOOL_REGISTRY = {
  bmi: {
    slug: "bmi",
    genre: "vital",
    component: "BMI",
    nameKey: "tools.bmi.name",
    descKey: "tools.bmi.desc",
  },
  "word-counter": {
    slug: "word-counter",
    genre: "parchment",
    component: "WordCounter",
    nameKey: "tools.wordCounter.name",
    descKey: "tools.wordCounter.desc",
  },
  "qr-code": {
    slug: "qr-code",
    genre: "signal",
    component: "QRCode",
    nameKey: "tools.qrCode.name",
    descKey: "tools.qrCode.desc",
  },
  salary: {
    slug: "salary",
    genre: "vault",
    component: "SalaryCalculator",
    nameKey: "tools.vaultSalary.heroCase",
    descKey: "tools.vaultSalary.heroLead",
  },
} as const;

export type ToolSlug = keyof typeof TOOL_REGISTRY;
