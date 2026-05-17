# Galaxy + LanguageSwitcher Update

このパッケージは以下を含みます:
- components/galaxy/GalaxyHub.tsx        ← 新トップページコンポーネント (5惑星)
- components/galaxy/galaxy-translations.json  ← 8言語翻訳
- components/layout/LanguageSwitcher.tsx ← 新言語切替UI (Discord式)
- app/locale/page.tsx                    ← app/[locale]/page.tsx を置換するもの
- galaxy.css                             ← globals.css 末尾に追記

PowerShell 適用:

cd $env:USERPROFILE\dev\hatch-site

# 1. GalaxyHub 配置
New-Item -ItemType Directory -Force -Path "components\galaxy" | Out-Null
Copy-Item -Force "galaxy-update\update-files\components\galaxy\GalaxyHub.tsx" "components\galaxy\GalaxyHub.tsx"
Copy-Item -Force "galaxy-update\update-files\components\galaxy\galaxy-translations.json" "components\galaxy\galaxy-translations.json"

# 2. LanguageSwitcher 上書き
Copy-Item -Force "galaxy-update\update-files\components\layout\LanguageSwitcher.tsx" "components\layout\LanguageSwitcher.tsx"

# 3. トップページ(app/[locale]/page.tsx) 上書き
Copy-Item -Force "galaxy-update\update-files\app\locale\page.tsx" "app\[locale]\page.tsx"

# 4. CSS追記
Add-Content -Path "app\globals.css" -Value "`r`n`r`n/* === GALAXY + LANG SWITCHER === */`r`n"
Get-Content "galaxy-update\update-files\galaxy.css" -Raw -Encoding UTF8 | Add-Content "app\globals.css" -Encoding UTF8

# 5. ビルド
npm run build

# 成功したら push
git add .
git commit -m "feat: replace home with Galaxy Hub + new language switcher"
git push
