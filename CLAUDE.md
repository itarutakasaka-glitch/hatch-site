# CLAUDE.md — Blue Tanuki

このファイルは、Claude (および将来の人間協力者) が `hatch-site` リポジトリで作業する際の **必読の定義書** です。  
読まずに作業を始めることを禁じます。

---

## 1. プロジェクト概要

**Blue Tanuki** は、**ビジネスマン向けの便利ツール百貨店** です。

- 本番URL: https://bluetanuki.xyz
- リポジトリ: https://github.com/itarutakasaka-glitch/hatch-site
- 言語: 日本語をメインに、英語・スペイン語・ポルトガル語・フランス語・ドイツ語・韓国語・中国語簡体字を対応
- 技術: Next.js 15 + next-intl + Tailwind なし(各ジャンルで独自CSS)
- デプロイ: Vercel
- マネタイズ: AdSense + アフィリエイト(Notion / Microsoft 365 / freee 等)
- 兄弟プロジェクト: decomoji.xyz (絵文字Slackツール、別ドメイン)

### ターゲット
- 20-50代のオフィスワーカー(営業、企画、人事、経理、マネージャー層)
- AIや業務効率化に興味があるが、エンジニアではない層
- 「Excel上手くなりたい」「議事録効率化したい」「資料の質を上げたい」層

### サイト構造(銀河)

```
bluetanuki.xyz
├── /                  ← Galaxy Hub (5惑星)
├── /tools/{slug}      ← 各ツール個別ページ
├── /about
├── /contact
└── /privacy
```

5つのジャンル(惑星):

| 惑星 | コンセプト | 配色 | 完成ツール |
|---|---|---|---|
| **Vital** | 健康・自己管理 | ダーク + ライム #D1FF3D | BMI |
| **Parchment** | 文書・テキスト | 羊皮紙 + セピア + 赤朱印 | Word Counter |
| **Signal** | 業務効率(技術系) | 真黒 + 蛍光緑 #00FF9C | QR Code |
| **Vault** | お金・経営計算 | クリーム + ネイビー + シャンパンゴールド(Suits日中) | 給与計算 |
| **Forge** | AIエージェント銀行 | 真黒 + オレンジ #FF6B35(暫定) | (未完成) |

---

## 2. 絶対ルール

これらは何があっても破ってはいけない。

1. **「やめますか?」「明日にしますか?」と聞かない**  
   ユーザーは続けたい。疲労を気にせず仕事を完遂すること。
   
2. **MVP-First 原則**: HTMLで世界観を1枚で確立 → ユーザー確認 → Next.js統合  
   いきなりNext.jsで作らない。世界観確立フェーズで必ず停止して確認する。

3. **ジャンル間で構造を流用禁止**  
   各ジャンルは違うメタファーを持つ。BMI(ダッシュボード型)の構造をQRに流用 = ✗  
   各ツールはそのジャンルのメタファーから設計する。

4. **既存サイトのリサーチを必ず行う**  
   ゼロベース設計禁止。競合サイトの構造を見て、その「機能」だけでなく「構造」「中央に何があるか」を理解する。

5. **コミュニケーションの基本**  
   - 確認はMVP-First原則の節目だけ
   - 「ださい」フィードバックは根本対処のサイン(配色いじりではなく構造再設計)
   - 推奨案を聞かれたら明確に提案
   - 全部やる気でいく

---

## 3. デザイン世界観

各ジャンルの設計指針:

### Vital(健康)
- カラー: #050706 真黒 + #D1FF3D ライム + ティール
- フォント: Geist + Instrument Serif
- メタファー: WHOOP/Strava風データダッシュボード、円形リングメーター、巨大数値
- 用途: 健康指標・自己管理

### Parchment(文書)
- カラー: #F4E8D0 羊皮紙 + セピア + #C8102E 赤朱印 + ゴールド
- フォント: Playfair Display / Cormorant Garamond / Special Elite
- メタファー: 罫線つきタイプライター、装飾コーナー、ローマ数字、博物学的
- 用途: テキスト処理・文書

### Signal(業務効率/技術)
- カラー: #0A0F0D 真黒 + #00FF9C 蛍光緑
- フォント: JetBrains Mono 支配
- メタファー: ターミナルウィンドウ、グリッドライン、スキャンライン、blinkdot
- 用途: 業務系(QR / Password / Hash / JSON 等)
- ⚠️ 注意: ダッシュボード型UIに陥らない。各ツールの主役を中心に置く。

### Vault(お金・Suits日中)
- カラー: #F5F1EA クリーム + #1A2540 ネイビー + #B8923D シャンパンゴールド + #8B2635 バーガンディ
- フォント: Playfair Display / Cormorant Garamond / Noto Serif JP
- メタファー: 革張りフォルダー + 高級レターヘッド紙 + マンハッタンスカイラインの薄影
- 印鑑: "確 定" バーガンディ縦書きスタンプ
- ブランド名: 「ヴォルト · 事務所」
- 用途: お金関連の計算(給与・退職金・ROI 等)
- ⚠️ 注意: 英語を多用しない。日本語が主、英語は装飾。

### Forge(エージェント銀行)
- 暫定: 真黒 + オレンジ #FF6B35
- まだ世界観確立中。MVP HTML を作って確定させること。
- ユーザー投稿型(GitHub PR Phase 0 方式)を想定。

---

## 4. ブランド資産

### マスコット: Stickerタヌキ
Pattern N(全25パターンから選定済み):
- 太い白アウトラインのダイカットステッカー型
- 青ボディ(#5EA8FF)+ 耳ピンク(#FFB3D0)+ 大きい目(白+黒+ハイライト)+ 赤い鼻(#FF6B6B)+ ピンクの頬

SVG実装は `components/mascot/StickerTanuki.tsx` 参照。  
フローティングタヌキは `components/mascot/FloatingTanuki.tsx` で各ツールページに配置。

### ロゴ / ブランド色
- メインブルー: #5EA8FF
- ダークブルー(目): #0A1428
- ピンク(頬): #FF6BC5

---

## 5. 技術スタック

### フロントエンド
- Next.js 15.5.18 (App Router)
- React 19.2.6
- next-intl ^3.26.0 (8言語対応、localePrefix: as-needed)
- qrcode ^1.5.4
- Tailwind なし、各ジャンルが独自CSSを globals.css に持つ

### フォルダ構成

```
hatch-site/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                 ← GalaxyHub
│   │   ├── tools/[slug]/page.tsx    ← 各ツール表示
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── not-found.tsx
│   │   ├── layout.tsx
│   │   └── globals.css              ← 全体 + 各ジャンル独自CSS
├── components/
│   ├── galaxy/GalaxyHub.tsx
│   ├── mascot/StickerTanuki.tsx
│   ├── mascot/FloatingTanuki.tsx
│   ├── tools/
│   │   ├── BMI/BMI.tsx
│   │   ├── Parchment/WordCounter.tsx
│   │   ├── Signal/QRCode.tsx
│   │   └── Vault/SalaryCalculator.tsx
├── lib/tools/registry.ts
├── messages/
│   ├── ja.json (完全)
│   ├── en.json (完全)
│   ├── es.json (基本キー)
│   ├── pt-BR.json (基本キー)
│   ├── fr.json (基本キー)
│   ├── de.json (基本キー)
│   ├── ko.json (基本キー)
│   └── zh-CN.json (基本キー)
└── public/
    └── icons/
```

### PowerShell 環境(Windows)
```powershell
cd $env:USERPROFILE\dev\hatch-site
npm install
npm run build
npm run dev          # http://localhost:3000
git add .
git commit -m "..."
git push
```

### Vercel
- プロジェクト: `itarutakasakas-projects/hatch-site`
- 仮URL: `hatch-site-omega.vercel.app`
- 本番ドメイン: `bluetanuki.xyz`
- 自動デプロイ on push to main

### 分析・収益化
- GA4 ID: `G-GDX0LHQ0BG` (decomoji と共有 or 別途 BlueTanuki 用を作成)
- AdSense Client ID: `ca-pub-7490892593665830` (decomoji と同一アカウント)
- AdSense Status: decomoji.xyz 審査中

---

## 6. 学習済みの失敗パターン

これらを繰り返さないこと:

1. **QR Signal 計算機似問題**  
   症状: BMI(2カラム入力→結果)の構造を QR にそのまま流用、ユーザーから「計算機と似てる」  
   原因: 機能リストだけ取り込み、構造のリサーチを怠った  
   対処: 各ツールの主役(QRなら巨大なQR本体)を中心に置く設計に。競合の中央レイアウトを観察すること。

2. **Vault v1 チープ問題**  
   症状: 給与明細メタファーがローカル(日本の薄い紙)、朱印が民家っぽい  
   対処: Suits日中版でクリーム+ネイビー+シャンパンゴールド、革とレターヘッド

3. **Vault v2 英語過多問題**  
   症状: Suits風に振った結果 "Executive Brief" 等が英語で日本人ビジネスマンに読めず  
   対処: 日本語が主、英語は装飾のみ(v3)

4. **ゼロベース設計問題**  
   症状: 競合サイトを見ずに構造を妄想で作る → 大手と比較して圧倒的に劣化  
   対処: 各ツール着手前に必ず web_search で競合5-10サイトをリサーチ、構造の共通点を抽出してから着手

---

## 7. 進めるべきロードマップ

### Phase 0(継続)
- bluetanuki.xyz に Vault 統合をデプロイ
- Galaxy Hub に Forge 惑星追加(暫定の "soon" ラベル)

### Phase 1: 量産フェーズ
各ジャンルに 3-5 個のツールを追加:

- **Vital**: Body Fat / TDEE / Calorie / BMR
- **Parchment**: 文字数(Char) / ケース変換 / Slug / Lorem Ipsum / ふりがな
- **Signal**: Password / Hash / JSON Formatter / Base64 / UUID / Color Picker
- **Vault**: 退職金計算 / ROI / 損益分岐点 / 残業代 / 法人税 / ボーナス手取り

### Phase 2: コンテンツジャンル
- **Library** (Excel/PPT/Notion テンプレ集) — 新ジャンル
- **Spell** (AIプロンプト集) — 新ジャンル
- ユーザー投稿型 Phase 0 開始(GitHub PR ベース)

### Phase 3: マネタイズ拡張
- AdSense / アフィリエイトの導線最適化
- 有料テンプレ・有料エージェント
- もし Forge が伸びたら、別ドメイン化(tanuki.dev 等)

---

## 8. 作業時のチェックリスト

新しいツールを作るとき:

- [ ] 競合サイトを web_search で5サイト以上見たか
- [ ] 既存ジャンルの構造を流用してないか
- [ ] そのジャンルのメタファーから設計したか
- [ ] 単体HTML MVP を作ったか
- [ ] ユーザーに見せて確認したか
- [ ] OK後、React コンポーネント化したか
- [ ] registry.ts に追加したか
- [ ] messages/ja.json と en.json に翻訳キー追加したか
- [ ] tools/[slug]/page.tsx のコンポーネントマップに追加したか
- [ ] generateStaticParams に slug 追加したか
- [ ] `npm run build` でエラーなく通ったか
- [ ] git push したか

---

## 9. 連絡先・運用情報

- 運営者: kyari(東京)
- ローカル開発: `C:\Users\kyari\dev\hatch-site` (Windows + PowerShell)
- メイン作業環境: スマホ + PC 併用、コードはPCで実行
- ドメイン: bluetanuki.xyz(Vercel経由、$1.99で取得 2026/05/17、更新時$13/年、Auto-renew ON)

---

最終更新: 2026年5月  
このファイルは hatch-site リポジトリのルートに置き、変更時は必ず更新すること。
