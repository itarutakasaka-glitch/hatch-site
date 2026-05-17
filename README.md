# Blue Tanuki / hatch-site

Multi-language tool site, the foundation of the Hatch agent project.

## Setup

```bash
npm install
npm run dev
```

## Languages

8 languages supported: en (default), ja, es, pt-BR, fr, de, ko, zh-CN

## Adding a new tool

1. Create a new folder under `components/tools/<ToolName>/`
2. Add `index.tsx` (the React component) and `translations.json` (UI strings)
3. Register the tool in `lib/tools-registry.ts`:
   - Add to `toolComponents` map
   - Add to `tools` array with all language names/descriptions
4. The tool automatically appears at `/tools/<slug>` and in the home page list

The Hatch agent (Phase 3+) automates these steps.

## Environment variables

- `NEXT_PUBLIC_SITE_URL` — full URL of the deployed site
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 Measurement ID
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` — Google AdSense client ID
