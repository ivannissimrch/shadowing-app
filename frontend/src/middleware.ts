import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Static files
  // - Sentry monitoring route
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`, `/monitoring`
    // - … contain a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|monitoring|.*\\..*).*)",
  ],
};
