# CLAUDE.md — Blue Tanuki (for Claude Code)

このファイルは Claude Code がリポジトリで作業を始める前に**必ず読むもの**です。
詳細な引き継ぎは `HANDOVER.md` を参照してください。

---

## クイックリファレンス

- **Production**: https://bluetanuki.xyz
- **Repo**: https://github.com/itarutakasaka-glitch/hatch-site
- **Local**: `C:\Users\kyari\dev\hatch-site` (Windows + PowerShell)
- **Owner**: kyari (Tokyo, non-engineer)
- **Tech**: Next.js 15.5 + next-intl + Vercel auto-deploy on push to main
- **Locales**: en (default), ja, es, pt-BR, fr, de, ko, zh-CN

---

## 絶対ルール(Top Level)

### コミュニケーション
1. **「やめますか?」「明日にしますか?」と聞かない**。kyari さんは続けたい。
2. **確認は MVP-First 原則の節目だけ**。それ以外は走り切る。
3. **「ださい」フィードバックは根本対処のサイン**(配色いじりではなく構造再設計)。
4. **推奨案を聞かれたら明確に提案**。曖昧にしない。
5. **「全部やる気」で着手**。逐次確認しない。

### 設計
1. **MVP-First**: HTML で世界観 → kyari さんに確認 → Next.js 統合。クオリティを落とさない。
2. **ジャンル間で構造を流用禁止**: 各ツールは主役(QRなら巨大なQR本体)を中心に置く独自設計。
3. **競合リサーチ必須**: ゼロベース禁止。web_search で5-10サイト見てから着手。
4. **既存パターンを真似る**: `components/tools/BMI/index.tsx` がコンポーネントの正解形。

---

## ツール追加チェックリスト

詳細は `HANDOVER.md` の §11 を参照。要点:

1. 競合 5-10 サイトを web_search でリサーチ
2. HTML MVP を `/mnt/user-data/outputs/` に作って kyari さんに確認
3. `components/tools/<ToolName>/index.tsx` + `translations.json`(BMI パターン)
4. `lib/tools-registry.ts` の `toolComponents` map と `tools` 配列に追加
5. `app/globals.css` に独自CSS追加(`--{theme}-*` prefix で衝突回避)
6. `components/galaxy/galaxy-translations.json` の該当ジャンルに `<genre>_tool` キー追加
7. `.next` 削除して `npm run build` 通るか確認
8. `git add . && git commit && git push`

---

## Windows + PowerShell の罠

1. **`[locale]` パスはワイルドカード扱い**: `Copy-Item` には `-LiteralPath` 必須
2. **直接書き込みが確実**: `[System.IO.File]::WriteAllText("$pwd\app\[locale]\page.tsx", $content, [System.Text.UTF8Encoding]::new($false))`
3. **PowerShell ヒアドキュメント `@'...'@` は絵文字/特殊引用符で壊れる**: 大きなコードは zip → コピーで配置
4. **作業フォルダのゴミがビルド対象に入る**: zip 展開後フォルダは即削除
5. **文字コード**: `Set-Content -Encoding UTF8` または UTF8NoBom で書き込み

---

## 5つの惑星(ジャンル)

| 惑星 | ジャンル | 色 | 完成ツール |
|---|---|---|---|
| Vital | 健康・自己管理 | `#10B981` | BMI |
| Parchment | 文書・テキスト | `#F59E0B` | Word Counter |
| Signal | 業務効率(技術) | `#8B5CF6` | QR Code |
| Vault | お金・経営計算 | `#B8923D` | 給与手取り計算(Suits日中) |
| Forge | AIエージェント | `#FF6B35` | (未完成、"soon" 表示) |

各ジャンルの世界観・配色・フォントは `HANDOVER.md` §9 を参照。

---

## 直近の優先タスク(優先度順)

詳細は `HANDOVER.md` §5 を参照。

1. 🔴 https://bluetanuki.xyz/ja の動作確認 → 必要なら GalaxyHub 強化
2. 🟡 GA4 / Search Console / AdSense セットアップ
3. 🟢 各ジャンル量産フェーズ(各ジャンル3-5ツール追加)
4. 🔵 Forge MVP(5番目惑星の中身)

---

## 重要なファイル

- `HANDOVER.md` — 完全な引き継ぎドキュメント(まずこれを読む)
- `app/[locale]/page.tsx` — 銀河トップ
- `app/[locale]/tools/[slug]/page.tsx` — 共通ツールページ
- `components/galaxy/GalaxyHub.tsx` — 銀河ハブ
- `components/tools/BMI/index.tsx` — ツールの正解パターン
- `lib/tools-registry.ts` — ツールレジストリ
- `lib/site-config.ts` — サイト設定

---

## このファイルを更新する責任

新しい失敗パターン・新しいパターン・新しい設計判断があれば、`HANDOVER.md` を更新してから次のセッションへ引き渡してください。

最終更新: 2026年5月17日 (JST)
