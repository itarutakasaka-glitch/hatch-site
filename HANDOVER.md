# Blue Tanuki — Claude Code 引き継ぎドキュメント

最終更新: 2026年5月17日
前任: Claude (claude.ai web)
後任: Claude Code

---

## 0. このドキュメントの読み方

このドキュメントは Claude Code がコンテキストゼロから Blue Tanuki プロジェクトを引き継ぐためのものです。**読まずに作業を始めないこと**。  
順番に読んで、現状把握 → 直近タスク → ロードマップ の順で進めてください。

---

## 1. プロジェクト概要

**Blue Tanuki**(青タヌキ)は、ビジネスパーソン向けの**便利ツール百貨店**です。

- **本番URL**: https://bluetanuki.xyz
- **GitHub**: https://github.com/itarutakasaka-glitch/hatch-site
- **Vercel**: itarutakasakas-projects/hatch-site(自動デプロイ on push to main)
- **ローカル**: `C:\Users\kyari\dev\hatch-site`(Windows + PowerShell環境)
- **運営者**: kyari(東京、Windows ユーザー、エンジニアではない)
- **兄弟プロジェクト**: decomoji.xyz(別ドメインの絵文字Slackツール、別リポジトリ)

### ターゲット層
- 20-50代のオフィスワーカー(営業/企画/人事/経理/マネージャー層)
- AIや業務効率化に興味があるが**非エンジニア**
- 「Excel上手くなりたい」「議事録効率化したい」「資料の質を上げたい」層

### マネタイズ
- AdSense + アフィリエイト(Notion / Microsoft 365 / freee 等)
- 既存 AdSense Client ID: `ca-pub-7490892593665830`(decomoji と同一アカウント)

---

## 2. サイト構造 — 5ジャンル銀河

トップページは**銀河ハブ**(`/[locale]`)で、5つの惑星(ジャンル)が周回する設計。

| 惑星 | コンセプト | アクセントカラー | 完成ツール |
|---|---|---|---|
| **Vital** | 健康・自己管理 | 緑 `#10B981` | BMI |
| **Parchment** | 文書・テキスト | 橙 `#F59E0B` | Word Counter |
| **Signal** | 業務効率(技術系) | 紫 `#8B5CF6` | QR Code |
| **Vault** | お金・経営計算 | 金 `#B8923D` | 給与手取り計算(Suits日中スタイル) |
| **Forge** | AIエージェント銀行 | 橙 `#FF6B35` | (未完成、暫定的に "soon" 表示) |

各ジャンルは**独自のメタファー・配色・フォント**を持ち、流用禁止。

---

## 3. 技術スタック

```yaml
framework: Next.js 15.5.18 (App Router)
react: 19.2.6
i18n: next-intl ^3.26.0
locales: en (default), ja, es, pt-BR, fr, de, ko, zh-CN
locale-prefix: as-needed (en は接頭辞なし、他は /ja, /de 等)
styling: globals.css に独自CSS(Tailwind なし、各ジャンルが独自CSS変数)
deployment: Vercel auto-deploy on push to main
qr-library: qrcode ^1.5.4
```

### ディレクトリ構造

```
hatch-site/
├── CLAUDE.md                      ← プロジェクト定義書(必読)
├── README.md
├── app/
│   ├── globals.css                ← 全体 + 各ジャンル独自CSS
│   ├── layout.tsx, robots.ts, sitemap.ts
│   └── [locale]/
│       ├── layout.tsx
│       ├── page.tsx               ← GalaxyHub をレンダリング(銀河トップ)
│       ├── not-found.tsx
│       ├── about/page.tsx
│       ├── contact/page.tsx
│       ├── privacy/page.tsx
│       └── tools/[slug]/page.tsx  ← 各ツール個別ページ
├── components/
│   ├── layout/
│   │   ├── LanguageSwitcher.tsx   ← Discord式の言語切替(地球儀+ネイティブ表記+検索)
│   │   ├── SiteHeader.tsx
│   │   └── SiteFooter.tsx
│   ├── galaxy/
│   │   ├── GalaxyHub.tsx          ← 銀河ハブ本体
│   │   └── galaxy-translations.json (8言語)
│   └── tools/
│       ├── BMI/index.tsx + translations.json
│       ├── WordCounter/index.tsx + translations.json
│       ├── QRCode/index.tsx + translations.json
│       └── Vault/index.tsx + translations.json   ← 給与計算
├── lib/
│   ├── site-config.ts             ← url, gaId, adsenseClientId, contactEmail
│   └── tools-registry.ts          ← toolComponents map + tools 配列
└── messages/
    └── {en,ja,es,pt-BR,fr,de,ko,zh-CN}.json
```

### 重要なパターン

**ツールコンポーネント形式**:
```tsx
"use client";
import translations from "./translations.json";

export default function MyTool({ locale }: { locale: string }) {
  const t = (key: keyof (typeof translations)["en"]) => {
    const dict = (translations as Record<string, Record<string, string>>)[locale] || translations.en;
    return dict[key] || translations.en[key];
  };
  // ...
}
```

**registry形式**:
```ts
// lib/tools-registry.ts
export const toolComponents = {
  bmi: () => import("@/components/tools/BMI"),
  // ...
  salary: () => import("@/components/tools/Vault"),
};

export const tools: ToolMeta[] = [
  { slug, category, theme, accentColor, icon, publishedAt, featured, names, descriptions, taglines },
];
```

---

## 4. 現在の状態(2026/05/17 時点)

### デプロイ済み・本番動作中
- ✅ Blue Tanuki ブランド(Pocketools から rename 完了、全ファイル反映済み)
- ✅ ドメイン bluetanuki.xyz(Vercelで設定済)
- ✅ Galaxy Hub v2(銀河トップ、5惑星、星空、流れ星、浮遊アニメ)
- ✅ 新 LanguageSwitcher(地球儀アイコン + ネイティブ表記 + 検索付き + ダーク対応)
- ✅ 4ツール: BMI / Word Counter / QR Code / Salary(Vault給与計算)
- ✅ 8言語対応(全 URL が独立した静的ページ、69ページ生成)
- ✅ Vault 給与計算ツール(Suits日中スタイル、令和8年税制改正対応、178万円の壁対応)

### Vercel 環境変数(要確認)
- `NEXT_PUBLIC_SITE_URL` — `https://bluetanuki.xyz`(未設定なら設定する)
- `NEXT_PUBLIC_GA_ID` — 未設定
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` — 未設定

### 直近のコミット履歴
```
a434ce1 feat: Galaxy Hub v2 - MVP quality, cleanup leftover folders
9ed4465 feat: Galaxy Hub v2 - MVP quality restored with starfield, shooting stars, planet float, halo
c96fe70 fix: actually replace page.tsx with Galaxy Hub
ae5b67c feat: Galaxy Hub + modern language switcher
22c5264 feat: rebrand Pocketools to Blue Tanuki across all files
cbab94a fix: clean up update folders, rebuild with salary tool
6bf07c1 feat: add Vault salary calculator with Suits daylight theme
```

---

## 5. 直近のタスク(優先度順)

### 🔴 最優先: 動作確認 & 必要なら修正
1. https://bluetanuki.xyz/ja を確認
2. 銀河ハブが正しく表示されるか
3. 各惑星クリックでツールに飛べるか
4. 言語切替が正常か
5. もしクオリティが期待値に達してないなら、`GalaxyHub.tsx` と `app/globals.css` の Galaxy CSS セクションを更に強化

### 🟡 次優先: GA4 / Search Console / AdSense
- GA4 プロパティ作成(Blue Tanuki 専用、decomoji と別)
- 測定IDを Vercel 環境変数 `NEXT_PUBLIC_GA_ID` に設定
- Search Console に `bluetanuki.xyz` 登録、sitemap 提出
- AdSense に新サイトとして追加(同一アカウント)

### 🟢 量産フェーズ
各ジャンルに 3-5 個ずつツールを追加:
- **Vital**: Body Fat / TDEE / Calorie / BMR
- **Parchment**: Char Counter / Case Converter / Slug / Lorem Ipsum / ふりがな
- **Signal**: Password Generator / Hash / JSON Formatter / Base64 / UUID / Color Picker
- **Vault**: 退職金 / ROI / 損益分岐点 / 残業代 / 法人税 / ボーナス手取り

### 🔵 Forge MVP
5番目の惑星(AIエージェント銀行)。クリック先のページがまだ無い。MVP HTML から作る。ユーザー投稿型(GitHub PR Phase 0)を想定。

---

## 6. 絶対ルール

これらは**何があっても**破ってはいけない。

### コミュニケーション
1. **「やめますか?」「明日にしますか?」と聞かない**。kyari さんは続けたい。
2. **確認は MVP-First 原則の節目だけ**。それ以外は走り切る。
3. **「ださい」フィードバックは根本対処のサイン**(配色いじりではなく構造再設計)。
4. **推奨案を聞かれたら明確に提案**。曖昧にしない。
5. **「全部やる気」で着手**。逐次確認しない。

### 設計
1. **MVP-First 原則**: HTMLで世界観を1枚で確立 → ユーザー確認 → Next.js統合
2. **ジャンル間で構造を流用禁止**: BMI(ダッシュボード型)と QR(コード生成型)は別構造
3. **既存サイトのリサーチを必ず行う**: ゼロベース設計禁止。web_search で競合5-10サイト見る
4. **各ジャンルは独自メタファー**: Vital=データダッシュボード / Parchment=書類 / Signal=ターミナル / Vault=Suits日中 / Forge=未確定

### 技術
1. **ツールコンポーネントは BMI パターン**を真似る(`{ locale }` プロパティ + 内部 `translations.json`)
2. **next-intl の `useTranslations` はツール内では使わない**(独自`translations.json` import で完結)
3. **CSS は globals.css に追記、`--{theme}-*` prefix で衝突回避**
4. **registry に追加するときは `toolComponents` と `tools` 配列の両方**を更新

---

## 7. Windows + PowerShell 環境の罠

kyari さんは Windows + PowerShell 環境です。以下の罠を必ず避けること:

### 罠1: `[locale]` パスのワイルドカード解釈
```powershell
# 間違い: PowerShellが [locale] をワイルドカードと誤認識
Copy-Item "src.tsx" "app\[locale]\page.tsx"

# 正解: -LiteralPath を使う
Copy-Item "src.tsx" -LiteralPath "app\[locale]\page.tsx"

# 確実なのは直接書き込み
[System.IO.File]::WriteAllText("$pwd\app\[locale]\page.tsx", $content, [System.Text.UTF8Encoding]::new($false))
```

### 罠2: PowerShell ヒアドキュメント内の特殊文字
`@'...'@` ヒアドキュメント内に絵文字・特殊引用符・"&" がパース失敗を引き起こす。スクリプト化せず**1コマンドずつ実行**するか、ファイルに保存してから配置する。

### 罠3: 文字エンコーディング
`Get-Content` / `Set-Content` は明示的に `-Encoding UTF8` を指定。BOM なしで保存したいときは `[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))` を使う。

### 罠4: ゴミフォルダがビルド対象に
zip 展開後に残った `vault-forge-update/`, `vault-v2/`, `galaxy-update/`, `galaxy-v2/` 等の作業フォルダが Next.js のビルド対象に入って失敗する。**展開後は必ずフォルダごと削除**。

### 罠5: kyari さんの作業スタイル
- kyari さんは Claude に**完全に任せたい**派(細かい指示を出すよりコピペで終わらせたい)
- 「君ができることはやって、僕はどうしてもできないことだけやる」
- PowerShell コマンドは小さく分割して 1ブロックずつコピペできる形で渡す
- ファイル編集は zip + コピペコマンドで完結させる

---

## 8. 学習済みの失敗パターン

繰り返さないこと。

### 失敗1: QR Signal 計算機似問題
**症状**: BMI の2カラム入力→結果の構造を QR コードジェネレータにそのまま流用し、ユーザーから「計算機と似てる」とフィードバック。  
**原因**: 機能リストだけ取り込み、構造のリサーチを怠った。  
**対処**: 各ツールの**主役**(QRなら巨大なQR本体)を中心に置く設計に。競合の中央レイアウトを観察してから着手。

### 失敗2: Vault v1 チープ問題
**症状**: 給与明細メタファーをローカル(日本の薄い紙)で表現、朱印が民家っぽい。  
**対処**: Suits日中版にrebooted、クリーム+ネイビー+シャンパンゴールド+革+レターヘッド+マンハッタンスカイラインに変更。

### 失敗3: Vault v2 英語過多問題
**症状**: Suits風に振った結果 "Executive Brief" 等の英語が日本人ビジネスマンに読めず。  
**対処**: v3 で日本語が主、英語は装飾のみに変更。

### 失敗4: ゼロベース設計問題
**症状**: 競合サイトを見ずに構造を妄想で作る → 大手と比較して圧倒的に劣化。  
**対処**: 各ツール着手前に必ず web_search で競合5-10サイトをリサーチ、構造の共通点を抽出してから着手。

### 失敗5: Galaxy Hub クオリティ落ち問題
**症状**: MVP HTML(フルスクリーン豪華版)から Next.js 移植時に星空・浮遊・流れ星等の装飾を手抜き → ユーザー指摘「前のがかっこよかった」。  
**対処**: Galaxy Hub v2 で MVP クオリティ復活(280個星 + 流れ星 + 浮遊アニメ + 光のハロー)。  
**教訓**: MVP のクオリティを Next.js 統合時に下げない。装飾は全部移植する。

### 失敗6: ファイル上書きが効かない問題
**症状**: `Copy-Item` で `app\[locale]\page.tsx` に上書きしたつもりが、ワイルドカード解釈で別の場所に書き込まれていた。`page.tsx` が古いままで、銀河ハブが表示されない。  
**対処**: `[System.IO.File]::WriteAllText("$pwd\app\[locale]\page.tsx", ..., utf8NoBom)` を直接使う。書き込み後は必ず先頭バイトを読み直して中身を確認する。

---

## 9. デザイン世界観

### Vital(健康)
- カラー: `#050706` 真黒 + `#D1FF3D` ライム + ティール
- フォント: Geist + Instrument Serif
- メタファー: WHOOP/Strava風データダッシュボード、円形リングメーター、巨大数値
- 用途: 健康指標・自己管理

### Parchment(文書)
- カラー: `#F4E8D0` 羊皮紙 + セピア + `#C8102E` 赤朱印 + ゴールド
- フォント: Playfair Display / Cormorant Garamond / Special Elite
- メタファー: 罫線つきタイプライター、装飾コーナー、ローマ数字、博物学的
- 用途: テキスト処理・文書

### Signal(業務効率/技術)
- カラー: `#0A0F0D` 真黒 + `#00FF9C` 蛍光緑
- フォント: JetBrains Mono 支配
- メタファー: ターミナルウィンドウ、グリッドライン、スキャンライン、blinkdot
- 用途: 業務系(QR / Password / Hash / JSON 等)
- ⚠️ ダッシュボード型UIに陥らない。各ツールの主役を中心に置く

### Vault(お金・Suits日中)
- カラー: `#F5F1EA` クリーム + `#1A2540` ネイビー + `#B8923D` シャンパンゴールド + `#8B2635` バーガンディ
- フォント: Playfair Display / Cormorant Garamond / Noto Serif JP
- メタファー: 革張りフォルダー + 高級レターヘッド紙 + マンハッタンスカイラインの薄影
- 印鑑: "確 定" バーガンディ縦書きスタンプ
- ブランド名: 「ヴォルト · 事務所」
- 用途: お金関連の計算
- ⚠️ 英語を多用しない。日本語が主、英語は装飾

### Forge(エージェント銀行)
- 暫定: 真黒 + オレンジ `#FF6B35`
- まだ世界観確立中。MVP HTML から作って kyari さんに確認してから Next.js 統合する
- ユーザー投稿型(GitHub PR Phase 0 方式)を想定

---

## 10. ブランド資産

### マスコット: Stickerタヌキ
Pattern N(25パターンから選定済み):
- 太い白アウトラインのダイカットステッカー型
- 青ボディ(`#5EA8FF`)+ 耳ピンク(`#FFB3D0`)+ 大きい目(白+黒+ハイライト)+ 赤い鼻(`#FF6B6B`)+ ピンクの頬

SVG実装は `components/galaxy/GalaxyHub.tsx` 内に inline で含まれている。再利用する際はそこから複製。

### ブランド色
- メインブルー: `#5EA8FF`
- ダークブルー(目): `#0A1428`
- ピンク(頬): `#FF6BC5`

---

## 11. 新ツール追加チェックリスト

新しいツールを作るとき、上から順に実行:

1. [ ] **web_search で競合 5-10 サイトを調査**(構造、主役、中央レイアウト)
2. [ ] **既存ジャンルの構造を流用してないか**確認
3. [ ] **そのジャンルのメタファーから設計**
4. [ ] **単体 HTML MVP を作って `/mnt/user-data/outputs/` に置く**
5. [ ] **kyari さんに見せて確認**(MVP-First 原則の停止ポイント)
6. [ ] OK後、`components/tools/<ToolName>/index.tsx` 作成(BMI パターンに合わせる)
7. [ ] `components/tools/<ToolName>/translations.json` 作成(en/ja 完備、他は en にフォールバック)
8. [ ] `lib/tools-registry.ts` に追加(`toolComponents` map + `tools` 配列の両方)
9. [ ] `app/globals.css` に独自CSS追加(`--{theme}-*` prefix で衝突回避)
10. [ ] `components/galaxy/galaxy-translations.json` の該当ジャンルに `<genre>_tool` 翻訳追加
11. [ ] `npm run build` でエラーなく通るか確認(`.next` を一度削除してから)
12. [ ] `git add . && git commit && git push`
13. [ ] Vercel デプロイ完了確認(2-3分)
14. [ ] 本番URL確認(`Ctrl+Shift+R` で強制リロード)

---

## 12. 重要なファイル一覧

引き継ぎ前提として、以下のファイルを必ず読むこと:

- `CLAUDE.md` (ルート) — このプロジェクトの定義書(別途存在、本ドキュメントと一部重複)
- `app/[locale]/page.tsx` — 銀河トップ
- `app/[locale]/tools/[slug]/page.tsx` — 各ツール表示の共通レイアウト
- `components/galaxy/GalaxyHub.tsx` — 銀河ハブ本体
- `components/galaxy/galaxy-translations.json` — 銀河の翻訳
- `components/layout/LanguageSwitcher.tsx` — 言語切替
- `components/layout/SiteHeader.tsx` — ヘッダー
- `components/tools/BMI/index.tsx` — ツールの正解パターン
- `components/tools/Vault/index.tsx` — Vault給与計算(Suits日中)
- `lib/tools-registry.ts` — ツールレジストリ
- `lib/site-config.ts` — サイト全体設定
- `messages/ja.json`, `messages/en.json` — 共通翻訳

---

## 13. デバッグ・トラブルシューティング

### ビルドエラー: "Cannot find module '@/components/tools/..."`
原因: `tools-registry.ts` の `toolComponents` map に追加したが、実ファイルがない、またはディレクトリ名が違う。  
対処: パス確認、`components/tools/<ToolName>/index.tsx` が存在するか。

### ビルドエラー: "Type error: Type '{ currentLocale: string; }' is not assignable to type 'IntrinsicAttributes'"
原因: `SiteHeader.tsx` が `<LanguageSwitcher currentLocale={locale} />` のように prop を渡しているが、新版 LanguageSwitcher は内部で `useLocale()` を使うので prop 不要。  
対処: `<LanguageSwitcher />` に変更。

### Vercel ビルドエラー: zip展開後の作業フォルダがビルド対象に
症状: `vault-forge-update/update-files/tools-page-snippet.tsx` 等が tsc に拾われて型エラー。  
対処: zip 展開後の作業フォルダ(`vault-v2/`, `galaxy-update/`, `galaxy-v2/` 等)をプッシュ前に削除する。

### デプロイは成功してるのに本番が古いまま
原因: ブラウザキャッシュ、または Vercel Edge キャッシュ。  
対処: `Ctrl+Shift+R` で強制リロード → ダメなら Vercel ダッシュボードで該当デプロイの "Redeploy" を "Build Cache なし" で実行。

### ローカルビルドは通るのに Vercel で失敗
原因: Vercel のビルドキャッシュ汚れ、または `.next` の差異。  
対処: Vercel ダッシュボードで "Use existing Build Cache" のチェックを外して Redeploy。

---

## 14. 次セッションでの最初の作業

Claude Code がこのドキュメントを受け取って最初にやること:

1. `git pull` で最新コードを取得
2. `npm install`
3. `npm run dev` でローカル起動して http://localhost:3000 確認
4. このドキュメントの **第5節「直近のタスク」** の優先度に従って着手
5. 不明点は kyari さんに**1問だけ**質問して動き出す

---

## 15. 連絡事項・運用情報

- **タイムゾーン**: 日本時間で考えること(kyari さんの指示)
- **クレジット意識**: 追加クレジット購入が必要にならない範囲で開発(指示書あり)
- **チャットタイトル**: 同じテーマのチャットは分かりやすいタイトルで統一(指示書あり)
- **kyari さんの希望**: 「君ができることはやって、僕はどうしてもできないことだけやる」
- **PC 環境**: Windows 11, PowerShell, Node.js, git

---

## 16. このドキュメントを更新する責任

このドキュメントは、引き継ぎを受けた Claude Code が**更新する責任を負います**。  
新しい失敗パターン、新しいパターン、新しいツール、新しい設計判断があったら、必ずこのドキュメントに追記してから次のセッションへ引き渡してください。

「自分が次のセッションで読むつもり」で書くのが原則です。

---

最終更新: 2026年5月17日(JST)
