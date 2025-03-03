import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { getCurrentUser } from "./lib/session";

const publicRoutes = [
  "sign-up",
  "sign-in",
  "forgot-password",
  "reset-password",
];

const nextIntlMiddleware = createMiddleware(routing);
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isHomePage = pathname.split("/").length === 2;
  const isPublicRoute =
    publicRoutes.some((route) => pathname.includes(route)) || isHomePage;
  const intlResponse = nextIntlMiddleware(request);

  if (isPublicRoute) return intlResponse;

  const user = await getCurrentUser();
  if (user) return intlResponse;

  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = "/sign-in";
  return NextResponse.redirect(nextUrl, { ...intlResponse });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon|logo|sitemap.xml|robots.txt).*)",
  ],
};
