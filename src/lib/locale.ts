export function getLocaleFromRequest(request: Request): string {
  const acceptLanguage = request.headers.get("accept-language");
  const cookies = request.headers.get("cookies") || "";
  const nextLocale = cookies.match(/NEXT_LOCALE=([^;]+)/);

  return nextLocale
    ? nextLocale[1]
    : (acceptLanguage?.split(";")[0].split(",")[1] ?? "en");
}
