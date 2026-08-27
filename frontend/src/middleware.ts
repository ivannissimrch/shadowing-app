import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// ShadowSpeak has moved to the coach's own platform. Every request to this app is
// sent there instead of being served.
//
// Kill switch: set REDIRECT_TO_NEW_PLATFORM=false in the Vercel project to serve the
// old app again. No code change or redeploy of this file is needed to flip it back.
//
// Status code is 307 (temporary) on purpose. A 308 is cached by the browser
// permanently, which would keep redirecting visitors even after the switch was
// turned off. Change it to 308 once the migration is confirmed finished and the old
// app is never coming back.
const NEW_PLATFORM_URL = "https://shadowspeaklearn.com";
const REDIRECT_STATUS = 307;

const redirectEnabled = process.env.REDIRECT_TO_NEW_PLATFORM !== "false";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  if (redirectEnabled) {
    return NextResponse.redirect(NEW_PLATFORM_URL, REDIRECT_STATUS);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Static files
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`
    // - … contain a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
