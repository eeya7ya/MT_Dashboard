// Session token signing/verification using Web Crypto so the same
// helpers run in both the Node.js runtime (route handlers) and the
// Edge runtime (middleware).
//
// Token format: `${base64url(payloadJson)}.${base64url(hmacSha256)}`

export const SESSION_COOKIE = "mt_session";
export const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export type SessionPayload = {
  /** subject — the username */
  sub: string;
  /** issued-at, seconds since epoch */
  iat: number;
  /** expiry, seconds since epoch */
  exp: number;
};

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET environment variable is missing or shorter than 32 characters",
    );
  }
  return secret;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function createSessionToken(
  username: string,
  ttlSeconds: number = DEFAULT_SESSION_TTL_SECONDS,
): Promise<{ token: string; expiresAt: Date }> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: username,
    iat: now,
    exp: now + ttlSeconds,
  };
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const payloadB64 = base64UrlEncode(payloadBytes);

  const key = await importHmacKey(getSecret());
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );
  const sigB64 = base64UrlEncode(new Uint8Array(sig));

  return {
    token: `${payloadB64}.${sigB64}`,
    expiresAt: new Date(payload.exp * 1000),
  };
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return null;

  let key: CryptoKey;
  try {
    key = await importHmacKey(getSecret());
  } catch {
    return null;
  }

  let providedSig: Uint8Array;
  try {
    providedSig = base64UrlDecode(sigB64);
  } catch {
    return null;
  }

  const expectedSig = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64)),
  );
  if (!timingSafeEqual(providedSig, expectedSig)) return null;

  let payload: SessionPayload;
  try {
    const json = new TextDecoder().decode(base64UrlDecode(payloadB64));
    payload = JSON.parse(json);
  } catch {
    return null;
  }

  if (
    typeof payload?.sub !== "string" ||
    typeof payload?.iat !== "number" ||
    typeof payload?.exp !== "number"
  ) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) return null;

  return payload;
}
