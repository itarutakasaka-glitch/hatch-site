import type { ComponentType } from "react";

export type ToolCategory =
  | "calculators"
  | "converters"
  | "generators"
  | "text"
  | "image"
  | "health"
  | "finance"
  | "developer";

export type LocaleStrings = Record<string, string>;

export type ToolMeta = {
  slug: string;
  category: ToolCategory;
  theme: string;
  accentColor: string;
  icon: string;
  publishedAt: string;
  featured?: boolean;
  names: LocaleStrings;
  descriptions: LocaleStrings;
  taglines?: LocaleStrings;
};

export const toolComponents: Record<
  string,
  () => Promise<{ default: ComponentType<{ locale: string }> }>
> = {
  bmi: () => import("@/components/tools/BMI"),
  "word-counter": () => import("@/components/tools/WordCounter"),
  "qr-code": () => import("@/components/tools/QRCode"),
  salary: () => import("@/components/tools/Vault"),
};

export const tools: ToolMeta[] = [
  {
    slug: "bmi",
    category: "health",
    theme: "health",
    accentColor: "#10B981",
    icon: "⚖️",
    publishedAt: "2026-05-16",
    featured: true,
    names: {
      en: "BMI Calculator",
      ja: "BMI計算機",
      es: "Calculadora de IMC",
      "pt-BR": "Calculadora de IMC",
      fr: "Calculateur d'IMC",
      de: "BMI-Rechner",
      ko: "BMI 계산기",
      "zh-CN": "BMI 计算器",
    },
    descriptions: {
      en: "Free online BMI (Body Mass Index) calculator. Enter your height and weight to instantly see your BMI and weight category.",
      ja: "無料のBMI(体格指数)計算機。身長と体重を入力するだけで、BMIと体型分類が瞬時にわかります。",
      es: "Calculadora gratuita de IMC (Índice de Masa Corporal) online. Ingresa tu estatura y peso para ver al instante tu IMC y categoría.",
      "pt-BR": "Calculadora gratuita de IMC (Índice de Massa Corporal) online. Insira sua altura e peso para ver instantaneamente seu IMC e categoria.",
      fr: "Calculateur d'IMC (Indice de Masse Corporelle) gratuit en ligne. Entrez votre taille et votre poids pour voir instantanément votre IMC et votre catégorie.",
      de: "Kostenloser Online-BMI-Rechner. Gib Größe und Gewicht ein, um sofort deinen Body-Mass-Index und deine Kategorie zu sehen.",
      ko: "온라인 BMI(체질량지수) 계산기. 키와 몸무게를 입력하면 BMI와 체형 분류를 즉시 알 수 있습니다.",
      "zh-CN": "免费在线 BMI(身体质量指数)计算器。输入身高和体重即可立即查看 BMI 和体型分类。",
    },
    taglines: {
      en: "Check your body mass index in seconds",
      ja: "数秒で体格指数をチェック",
      es: "Comprueba tu índice de masa corporal en segundos",
      "pt-BR": "Verifique seu IMC em segundos",
      fr: "Vérifiez votre IMC en quelques secondes",
      de: "Body-Mass-Index in Sekunden prüfen",
      ko: "몇 초 만에 체질량지수 확인",
      "zh-CN": "几秒查看身体质量指数",
    },
  },
  {
    slug: "word-counter",
    category: "text",
    theme: "text",
    accentColor: "#F59E0B",
    icon: "📝",
    publishedAt: "2026-05-16",
    featured: true,
    names: {
      en: "Word Counter",
      ja: "文字数カウント",
      es: "Contador de palabras",
      "pt-BR": "Contador de palavras",
      fr: "Compteur de mots",
      de: "Wortzähler",
      ko: "단어 카운터",
      "zh-CN": "字数统计",
    },
    descriptions: {
      en: "Free online word counter. Instantly count words, characters, sentences, and paragraphs in your text.",
      ja: "無料のオンライン文字数カウントツール。テキストの単語数、文字数、文の数、段落数を即座にカウントします。",
      es: "Contador de palabras gratuito online. Cuenta instantáneamente palabras, caracteres, oraciones y párrafos en tu texto.",
      "pt-BR": "Contador de palavras grátis online. Conte instantaneamente palavras, caracteres, frases e parágrafos no seu texto.",
      fr: "Compteur de mots gratuit en ligne. Comptez instantanément les mots, caractères, phrases et paragraphes de votre texte.",
      de: "Kostenloser Online-Wortzähler. Zähle sofort Wörter, Zeichen, Sätze und Absätze in deinem Text.",
      ko: "온라인 단어 카운터 무료. 텍스트의 단어, 문자, 문장, 단락 수를 즉시 셀 수 있습니다.",
      "zh-CN": "免费在线字数统计工具。即时统计文本中的单词、字符、句子和段落数量。",
    },
    taglines: {
      en: "Count words, characters, sentences in real time",
      ja: "単語・文字・文をリアルタイム集計",
      es: "Cuenta palabras, caracteres y oraciones en tiempo real",
      "pt-BR": "Conte palavras, caracteres e frases em tempo real",
      fr: "Comptez mots, caractères et phrases en temps réel",
      de: "Wörter, Zeichen und Sätze in Echtzeit zählen",
      ko: "단어·문자·문장 실시간 집계",
      "zh-CN": "实时统计单词、字符和句子",
    },
  },
  {
    slug: "qr-code",
    category: "generators",
    theme: "tech",
    accentColor: "#8B5CF6",
    icon: "📱",
    publishedAt: "2026-05-16",
    featured: true,
    names: {
      en: "QR Code Generator",
      ja: "QRコード生成",
      es: "Generador de código QR",
      "pt-BR": "Gerador de código QR",
      fr: "Générateur de code QR",
      de: "QR-Code-Generator",
      ko: "QR 코드 생성기",
      "zh-CN": "二维码生成器",
    },
    descriptions: {
      en: "Free online QR code generator. Create QR codes for URLs, text, or any data, and download as PNG.",
      ja: "無料のQRコード生成ツール。URL・テキスト・任意のデータからQRコードを作成し、PNGでダウンロードできます。",
      es: "Generador gratuito de códigos QR online. Crea códigos QR para URLs, texto o cualquier dato, y descárgalos como PNG.",
      "pt-BR": "Gerador grátis de código QR online. Crie códigos QR para URLs, texto ou qualquer dado, e baixe como PNG.",
      fr: "Générateur de code QR gratuit en ligne. Créez des codes QR pour des URL, du texte ou toute donnée, et téléchargez-les en PNG.",
      de: "Kostenloser Online-QR-Code-Generator. Erstelle QR-Codes für URLs, Text oder beliebige Daten und lade sie als PNG herunter.",
      ko: "온라인 QR 코드 생성기. URL, 텍스트 등 어떤 데이터로도 QR 코드를 만들고 PNG로 다운로드할 수 있습니다.",
      "zh-CN": "免费在线二维码生成器。为 URL、文本或任意数据创建二维码,并下载为 PNG 图像。",
    },
    taglines: {
      en: "Create QR codes for URLs, text & more",
      ja: "URL・テキストから即QRコード生成",
      es: "Crea códigos QR para URLs, texto y más",
      "pt-BR": "Crie códigos QR para URLs, textos e mais",
      fr: "Créez des codes QR pour URLs, texte et plus",
      de: "QR-Codes für URLs, Texte und mehr erstellen",
      ko: "URL·텍스트 등에서 QR 코드 생성",
      "zh-CN": "为 URL、文本等生成二维码",
    },
  },
  {
    slug: "salary",
    category: "finance",
    theme: "finance",
    accentColor: "#B8923D",
    icon: "💰",
    publishedAt: "2026-05-17",
    featured: true,
    names: {
      en: "Net Salary Calculator",
      ja: "給与手取り計算",
      es: "Calculadora de salario neto",
      "pt-BR": "Calculadora de salário líquido",
      fr: "Calculateur de salaire net",
      de: "Nettogehaltsrechner",
      ko: "급여 실수령액 계산기",
      "zh-CN": "工资实发计算器",
    },
    descriptions: {
      en: "Free net salary calculator for Japan. Enter your gross monthly salary to see take-home pay, social insurance, and taxes. Updated for FY2026 (Reiwa 8) tax reform.",
      ja: "無料の給与手取り計算ツール。月給を入れるだけで、社会保険料・税金・お手取り額が一枚の明細書に。令和8年税制改正・178万円の壁に対応。",
      es: "Calculadora gratuita de salario neto en Japón. Ingresa el salario bruto mensual para ver el salario neto, seguro social e impuestos.",
      "pt-BR": "Calculadora gratuita de salário líquido no Japão. Insira o salário bruto mensal para ver salário líquido, seguro social e impostos.",
      fr: "Calculateur gratuit de salaire net au Japon. Entrez votre salaire brut mensuel pour voir le salaire net, l'assurance sociale et les impôts.",
      de: "Kostenloser Nettogehaltsrechner für Japan. Gib dein monatliches Bruttogehalt ein, um Nettogehalt, Sozialversicherung und Steuern zu sehen.",
      ko: "일본 무료 급여 실수령액 계산기. 월급(총지급액)을 입력하면 실수령액, 사회보험료, 세금을 한 장의 명세서로 확인할 수 있습니다.",
      "zh-CN": "免费日本工资实发计算器。输入月薪税前金额,即可查看实发工资、社会保险费和税金。",
    },
    taglines: {
      en: "Know what you actually take home",
      ja: "手取りを、知る。",
      es: "Sabe cuánto te llevas a casa",
      "pt-BR": "Saiba quanto você leva pra casa",
      fr: "Sachez ce que vous gardez vraiment",
      de: "Wisse, was du wirklich heimnimmst",
      ko: "실수령액을 한 눈에",
      "zh-CN": "一眼看清实发工资",
    },
  },
];

export function getTool(slug: string): ToolMeta | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return tools.filter((t) => t.category === category);
}

export function getFeaturedTools(): ToolMeta[] {
  return tools.filter((t) => t.featured);
}

export function getRecentTools(limit = 6): ToolMeta[] {
  return [...tools]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}
