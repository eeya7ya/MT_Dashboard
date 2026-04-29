import { NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/auth";
import {
  createSessionToken,
  DEFAULT_SESSION_TTL_SECONDS,
  SESSION_COOKIE,
} from "@/lib/session";
import { checkRateLimit, resetRateLimit } from "@/lib/rateLimit";

// Force the Node.js runtime — verifyCredentials uses node:crypto's scrypt.
export const runtime = "nodejs";

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");
  if (!host) return false;

  const check = (raw: string | null): boolean | null => {
    if (!raw) return null;
    try {
      const u = new URL(raw);
      return u.host === host;
    } catch {
      return false;
    }
  };

  const o = check(origin);
  if (o !== null) return o;
  const r = check(referer);
  if (r !== null) return r;
  // No Origin or Referer — reject to be safe.
  return false;
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json(
      { error: "Bad request" },
      { status: 400 },
    );
  }

  const ip = getClientIp(req);
  const ipLimit = checkRateLimit(`login:ip:${ip}`, 10, 5 * 60 * 1000);
  if (!ipLimit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.max(
            1,
            Math.ceil((ipLimit.resetAt - Date.now()) / 1000),
          ).toString(),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username, password } =
    (body ?? {}) as { username?: unknown; password?: unknown };

  // Per-user-attempt limit (slows targeted attacks against a known account).
  if (typeof username === "string" && username.length > 0) {
    const userLimit = checkRateLimit(
      `login:user:${username.trim().toLowerCase()}`,
      5,
      15 * 60 * 1000,
    );
    if (!userLimit.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.max(
              1,
              Math.ceil((userLimit.resetAt - Date.now()) / 1000),
            ).toString(),
          },
        },
      );
    }
  }

  const result = await verifyCredentials(username, password);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 },
    );
  }

  // Successful login — clear the per-user counter so a legitimate user
  // who fat-fingered a few times doesn't stay locked out.
  if (typeof username === "string") {
    resetRateLimit(`login:user:${username.trim().toLowerCase()}`);
  }

  const { token, expiresAt } = await createSessionToken(result.username);

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
    maxAge: DEFAULT_SESSION_TTL_SECONDS,
  });
  return response;
}
