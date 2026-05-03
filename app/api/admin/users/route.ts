import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { getProfile, listProfiles, parseStoredUsers } from "@/lib/profile";
import { hashPassword } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

// scrypt-based hashPassword needs the Node.js runtime.
export const runtime = "nodejs";

function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");
  if (!host) return false;
  const check = (raw: string | null): boolean | null => {
    if (!raw) return null;
    try {
      return new URL(raw).host === host;
    } catch {
      return false;
    }
  };
  const o = check(origin);
  if (o !== null) return o;
  const r = check(referer);
  if (r !== null) return r;
  return false;
}

async function requireAdmin(): Promise<
  { ok: true; username: string } | { ok: false; status: number; error: string }
> {
  const cookieStore = await cookies();
  const session = await verifySessionToken(
    cookieStore.get(SESSION_COOKIE)?.value,
  );
  if (!session) {
    return { ok: false, status: 401, error: "Not signed in." };
  }
  const profile = getProfile(session.sub);
  if (!profile?.isAdmin) {
    return { ok: false, status: 403, error: "Admin access required." };
  }
  return { ok: true, username: profile.username };
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  // listProfiles already strips salt/hash.
  return NextResponse.json({ users: listProfiles() });
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Hashing is expensive; throttle per admin so an open browser tab
  // can't be abused to burn CPU.
  const limit = checkRateLimit(`admin-users:${auth.username}`, 30, 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Slow down." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    username,
    password,
    displayName,
    role,
    isAdmin,
  } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof username !== "string" ||
    username.trim().length === 0 ||
    username.length > 64 ||
    !/^[a-zA-Z0-9._-]+$/.test(username)
  ) {
    return NextResponse.json(
      { error: "Username must be 1–64 chars (letters, numbers, . _ -)." },
      { status: 400 },
    );
  }
  if (typeof password !== "string" || password.length < 12 || password.length > 1024) {
    return NextResponse.json(
      { error: "Password must be at least 12 characters." },
      { status: 400 },
    );
  }
  if (displayName !== undefined && typeof displayName !== "string") {
    return NextResponse.json({ error: "Invalid displayName." }, { status: 400 });
  }
  if (role !== undefined && typeof role !== "string") {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }
  if (isAdmin !== undefined && typeof isAdmin !== "boolean") {
    return NextResponse.json({ error: "Invalid isAdmin flag." }, { status: 400 });
  }

  const trimmedDisplay = typeof displayName === "string" ? displayName.trim() : "";
  const trimmedRole = typeof role === "string" ? role.trim() : "";
  if (trimmedDisplay.length > 80) {
    return NextResponse.json(
      { error: "Display name too long (max 80)." },
      { status: 400 },
    );
  }
  if (trimmedRole.length > 80) {
    return NextResponse.json(
      { error: "Role too long (max 80)." },
      { status: 400 },
    );
  }

  const { salt, hash } = await hashPassword(password);
  const entry: Record<string, unknown> = {
    username: username.trim(),
    salt,
    hash,
  };
  if (trimmedDisplay) entry.displayName = trimmedDisplay;
  if (trimmedRole) entry.role = trimmedRole;
  if (isAdmin === true) entry.isAdmin = true;

  // Build the full updated AUTH_USERS array so the admin can paste it
  // straight into env config. Replace any existing entry with the same
  // username (case-insensitive), otherwise append.
  const existing = parseStoredUsers();
  const normalized = username.trim().toLowerCase();
  const next = existing.filter(
    (u) => u.username.trim().toLowerCase() !== normalized,
  );
  next.push(entry as never);

  return NextResponse.json({
    entry,
    authUsers: JSON.stringify(next),
    replaced: existing.some(
      (u) => u.username.trim().toLowerCase() === normalized,
    ),
  });
}
