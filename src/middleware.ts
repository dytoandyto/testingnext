import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let /admin and /api routes bypass next-intl locale prefixing
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except /api, /_next, /_vercel, /admin or files with extensions
    "/((?!api|_next|_vercel|admin|.*\\..*).*)",
    "/",
  ],
};
