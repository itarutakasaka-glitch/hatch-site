export const siteConfig = {
  // 環境変数から取得（Vercelで設定）
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://pocketools.example.com",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
  // 連絡先メール（i18n対応外、共通）
  contactEmail: "contact@pocketools.app",
};
