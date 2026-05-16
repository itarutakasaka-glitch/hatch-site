import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // 全てのパスにmiddlewareを適用、ただし以下は除外
  matcher: [
    // 内部Next.jsファイルとAPIルートを除外
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
