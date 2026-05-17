# Blue Tanuki - Vault & Forge 統合手順

## 📋 概要

このディレクトリには、以下の更新を `hatch-site` に適用するためのファイルが入っています:

1. **Vault(給与計算ツール)** の Next.js 統合
2. **Galaxy Hub に Forge(エージェント銀行)惑星を追加** (5番目の惑星、"coming soon" 状態)
3. **CLAUDE.md** プロジェクト定義書をルートに配置

## 🚀 適用手順

### 前提
- hatch-site リポジトリは `C:\Users\kyari\dev\hatch-site` にある
- 既に hatch-site-v3.zip 相当の状態が push 済み (Galaxy Hub + Vital BMI + Parchment + Signal)
- PowerShell 起動済み

### Step 1: zip を hatch-site ルートに展開

```powershell
cd $env:USERPROFILE\dev\hatch-site

# zipを展開 (Downloads から)
Expand-Archive -Path "$env:USERPROFILE\Downloads\vault-forge-update.zip" -DestinationPath . -Force
```

### Step 2: SalaryCalculator コンポーネントを配置

```powershell
# Vault コンポーネントディレクトリ作成
New-Item -ItemType Directory -Force -Path "components\tools\Vault"

# コンポーネントを所定位置へ
Move-Item -Force "update-files\components\tools\Vault\SalaryCalculator.tsx" "components\tools\Vault\SalaryCalculator.tsx"

# Galaxy Hub を上書き (Forge追加版)
Move-Item -Force "update-files\components\galaxy\GalaxyHub.tsx" "components\galaxy\GalaxyHub.tsx"

# CLAUDE.md をルートに配置
Move-Item -Force "update-files\CLAUDE.md" "CLAUDE.md"
```

### Step 3: globals.css に Vault スタイルを追記

```powershell
# Vault CSS を globals.css の末尾に追加
Get-Content "update-files\vault.css" | Add-Content "app\[locale]\globals.css"
```

### Step 4: messages/ja.json に Vault と Galaxy キーを追加

これは手動マージが必要(JSONの構造マージ):

`messages\ja.json` を開いて、以下の構造で既存JSONに追記:

- `vaultSalary` → `tools` ブロックの中に追加
- `galaxy.vault` → `galaxy` ブロックの中に追加
- `galaxy.forge` → `galaxy` ブロックの中に追加

参考ファイル:
- `update-files\messages\vault-ja.json` ← tools.vaultSalary の中身
- `update-files\messages\galaxy-ja.json` ← galaxy 全体(マージ用)

同様に `messages\en.json` も `vault-en.json` と `galaxy-en.json` でマージ。

### Step 5: tools/[slug]/page.tsx と registry.ts を更新

参考ファイル:
- `update-files\registry-snippet.ts` ← registry.ts に追加するエントリ
- `update-files\tools-page-snippet.tsx` ← page.tsx に追加するコンポーネントマップ

具体的に:

**lib/tools/registry.ts** に salary エントリを追加:
```typescript
salary: {
  slug: "salary",
  genre: "vault",
  component: "SalaryCalculator",
  nameKey: "tools.vaultSalary.heroCase",
  descKey: "tools.vaultSalary.heroLead",
},
```

**app/[locale]/tools/[slug]/page.tsx** のコンポーネントマップに追加:
```typescript
import dynamic from "next/dynamic";

const SalaryCalculator = dynamic(
  () => import("@/components/tools/Vault/SalaryCalculator"),
  { ssr: false }
);

const COMPONENTS = {
  BMI, WordCounter, QRCode, SalaryCalculator,
} as const;

// generateStaticParams も更新
export function generateStaticParams() {
  return ["bmi", "word-counter", "qr-code", "salary"].map((slug) => ({ slug }));
}
```

### Step 6: ビルド + 動作確認

```powershell
npm install
npm run build
```

ビルドが通れば、ローカルで確認:
```powershell
npm run dev
# http://localhost:3000 で銀河、http://localhost:3000/ja/tools/salary で給与計算
```

### Step 7: コミット & プッシュ

```powershell
git add .
git commit -m "Add Vault salary calculator and Forge planet placeholder

- Add SalaryCalculator component (Suits daylight style)
- Add Vault CSS module to globals
- Update GalaxyHub to include Forge as 5th planet (coming soon)
- Add CLAUDE.md project definition document
- Add Vault and Forge translations to ja/en"
git push
```

Vercel が自動デプロイします(通常 2-3分)。

### Step 8: 本番確認

- https://bluetanuki.xyz/ja → 銀河ハブに5つ目惑星(Forge)が表示
- https://bluetanuki.xyz/ja/tools/salary → Vault給与計算ツール
- https://bluetanuki.xyz/en/tools/salary → 英語版

## ⚠️ トラブルシューティング

### ビルドエラー: "Module not found: components/tools/Vault/SalaryCalculator"
→ ファイル配置を確認、Step 2 を再実行

### ビルドエラー: "useTranslations: missing key tools.vaultSalary.brand"
→ messages/ja.json のマージ漏れ。Step 4 を確認

### Forge 惑星がクリックできる挙動が変
→ `comingSoon: true` のロジックを GalaxyHub.tsx で確認

## 📞 困ったとき

CLAUDE.md(ルートに配置済み)を読み返してください。  
失敗パターンや既知の罠が記述されています。
