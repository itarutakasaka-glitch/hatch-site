# Apply Vault Salary Calculator to hatch-site
# 実行: cd $env:USERPROFILE\dev\hatch-site; .\vault-v2\apply.ps1

$ErrorActionPreference = "Stop"

Write-Host "=== Vault Salary Calculator: 適用開始 ===" -ForegroundColor Cyan

# Step 1: 古い SalaryCalculator.tsx を削除して、新しい index.tsx を配置
Write-Host ""
Write-Host "[1/5] コンポーネント配置..." -ForegroundColor Yellow
if (Test-Path "components\tools\Vault\SalaryCalculator.tsx") {
  Remove-Item "components\tools\Vault\SalaryCalculator.tsx" -Force
  Write-Host "  - 旧 SalaryCalculator.tsx 削除"
}
Copy-Item -Force "vault-v2\components\tools\Vault\index.tsx" "components\tools\Vault\index.tsx"
Copy-Item -Force "vault-v2\components\tools\Vault\translations.json" "components\tools\Vault\translations.json"
Write-Host "  - index.tsx + translations.json 配置完了" -ForegroundColor Green

# Step 2: app/globals.css に Vault CSS 追記
Write-Host ""
Write-Host "[2/5] globals.css に Vault CSS 追記..." -ForegroundColor Yellow
$cssContent = Get-Content "vault-v2\vault.css" -Raw -Encoding UTF8
$marker = "/* === VAULT CSS APPENDED === */"
$existing = Get-Content "app\globals.css" -Raw -Encoding UTF8
if ($existing -notmatch [regex]::Escape($marker)) {
  Add-Content -Path "app\globals.css" -Value "`r`n$marker`r`n$cssContent" -Encoding UTF8
  Write-Host "  - Vault CSS を app\globals.css に追記" -ForegroundColor Green
} else {
  Write-Host "  - 既に追記済み(スキップ)" -ForegroundColor Gray
}

# Step 3: tools-registry.ts に salary エントリ追加
Write-Host ""
Write-Host "[3/5] tools-registry.ts に salary を追加..." -ForegroundColor Yellow
$registry = Get-Content "lib\tools-registry.ts" -Raw -Encoding UTF8

# toolComponents に salary を追加 (既存パターンを見つけて挿入)
$importPattern = '"qr-code": \(\) => import\("@/components/tools/QRCode"\),'
$importReplace = @'
"qr-code": () => import("@/components/tools/QRCode"),
  salary: () => import("@/components/tools/Vault"),
'@
if ($registry -notmatch 'salary: \(\) => import') {
  $registry = $registry -replace [regex]::Escape($importPattern), $importReplace
  Write-Host "  - toolComponents に salary 追加" -ForegroundColor Green
} else {
  Write-Host "  - toolComponents は既に追加済み(スキップ)" -ForegroundColor Gray
}

# tools 配列の末尾(]; の直前) に salary ツールを追加
$salaryToolEntry = @'

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
      "zh-CN": "免费日本工资实发计算器。输入月薪税前金额，即可查看实发工资、社会保险费和税金。",
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
'@

if ($registry -notmatch 'slug: "salary"') {
  # tools配列の最後 ]; を見つけて、その直前に挿入
  $registry = $registry -replace '\];(\s*export function getTool)', "$salaryToolEntry`$1"
  Write-Host "  - tools 配列に salary 追加" -ForegroundColor Green
} else {
  Write-Host "  - tools 配列は既に追加済み(スキップ)" -ForegroundColor Gray
}

# 書き込み (UTF-8 BOMなし)
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText("$PWD\lib\tools-registry.ts", $registry, $utf8NoBom)
Write-Host "  - tools-registry.ts 保存完了" -ForegroundColor Green

# Step 4: ビルド
Write-Host ""
Write-Host "[4/5] npm run build を実行..." -ForegroundColor Yellow
Write-Host "  (数分かかります)" -ForegroundColor Gray
npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Host "  ❌ ビルド失敗" -ForegroundColor Red
  exit 1
}
Write-Host "  ✅ ビルド成功" -ForegroundColor Green

# Step 5: コミット & プッシュ
Write-Host ""
Write-Host "[5/5] git commit & push..." -ForegroundColor Yellow
git add .
git commit -m "feat: add Vault salary calculator (Suits daylight)

- Add Net Salary Calculator under finance category
- FY2026 (Reiwa 8) tax reform compliant, 178M wall support
- Suits daylight theme: cream + navy + champagne gold
- Japanese-primary copy, English as decoration"
git push

Write-Host ""
Write-Host "=== 完了 ===" -ForegroundColor Cyan
Write-Host "Vercel が自動デプロイします (2-3分)" -ForegroundColor Green
Write-Host ""
Write-Host "確認URL:" -ForegroundColor Yellow
Write-Host "  https://bluetanuki.xyz/tools/salary"
Write-Host "  https://bluetanuki.xyz/en/tools/salary"
