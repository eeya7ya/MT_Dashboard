import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const PUBLIC_PATHS = new Set<string>(["/signin"]);
const PUBLIC_PREFIXES = ["/api/auth/", "/_next/", "/favicon"];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  for (const prefix of PUBLIC_PREFIXES) {
    if (pathname.startsWith(prefix)) return true;
  }
  return false;
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV !== "production";
  // Next.js App Router streams the RSC payload via inline <script> tags
  // and hydrates with inline JSON, so a strict CSP must allow those by
  // nonce. `'strict-dynamic'` then allows any scripts loaded by nonced
  // scripts (e.g. webpack chunks) while still blocking everything else.
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    isDev ? "'unsafe-eval'" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function applyCsp(res: NextResponse, csp: string): NextResponse {
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Generate a per-request nonce. Next.js automatically picks this up
  // for its own inline scripts when it sees a CSP nonce in the request.
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  if (isPublic(pathname)) {
    return applyCsp(
      NextResponse.next({ request: { headers: requestHeaders } }),
      csp,
    );
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  if (session) {
    return applyCsp(
      NextResponse.next({ request: { headers: requestHeaders } }),
      csp,
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = "/signin";
  url.search = "";
  if (pathname !== "/") {
    url.searchParams.set("next", pathname + (search || ""));
  }

  const response = applyCsp(NextResponse.redirect(url), csp);
  if (token) {
    response.cookies.set({
      name: SESSION_COOKIE,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });
  }
  return response;
}

export const config = {
  // Run on everything except static assets and the Next.js internals.
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.svg|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};
