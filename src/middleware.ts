import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { getCurrentUser } from "./lib/session";
import { getApiKey } from "./app/api/apikey/[id]/actions";

const publicRoutes = [
  "sign-up",
  "sign-in",
  "forgot-password",
  "reset-password",
];

const nextIntlMiddleware = createMiddleware(routing);
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isApiRoute = pathname.startsWith("/api");
  if (isApiRoute) {
    const isInternal = request.headers.get("x-next-internal") === "true";
    if (isInternal) return NextResponse.next();

    const apikey = request.headers.get("apikey");
    if (apikey) {
      const { error, apiKey } = await getApiKey({ id: apikey });
      if (!error && apiKey) {
        const headers = new Headers(request.headers);
        headers.set("x-company-id", apiKey.company_id);
        return NextResponse.next({
          request: {
            headers,
          },
        });
      }
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

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
    "/((?!_next/static|_next/image|favicon|logo|sitemap.xml|robots.txt).*)",
  ],
};
