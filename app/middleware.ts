import { configuration } from "@/app/configuration";
import createMiddleware from "next-intl/middleware";
import { defineRouting } from "next-intl/routing";

const routing = defineRouting({
  defaultLocale: configuration.defaultLocale,
  // localePrefix: "as-needed",
  locales: configuration.locales,
});

export default createMiddleware(routing, {
  localeDetection: false,
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
