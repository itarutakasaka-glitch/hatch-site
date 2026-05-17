// hatch-site/app/[locale]/tools/[slug]/page.tsx 内のコンポーネントマップに追加
// 既存のコンポーネント分岐に SalaryCalculator を追加するコード断片

import dynamic from "next/dynamic";

const BMI = dynamic(() => import("@/components/tools/BMI/BMI"), { ssr: false });
const WordCounter = dynamic(() => import("@/components/tools/Parchment/WordCounter"), { ssr: false });
const QRCode = dynamic(() => import("@/components/tools/Signal/QRCode"), { ssr: false });
const SalaryCalculator = dynamic(
  () => import("@/components/tools/Vault/SalaryCalculator"),
  { ssr: false }
);

const COMPONENTS = {
  BMI,
  WordCounter,
  QRCode,
  SalaryCalculator,
} as const;

export function getToolComponent(componentName: string) {
  return COMPONENTS[componentName as keyof typeof COMPONENTS];
}

// generateStaticParams にも追加
export function generateStaticParams() {
  return ["bmi", "word-counter", "qr-code", "salary"].map((slug) => ({ slug }));
}
