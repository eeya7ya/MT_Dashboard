// Server-side credential verification. Uses Node's built-in scrypt
// (no extra dependencies). Only imported from Node.js route handlers,
// never from middleware (which runs on the Edge runtime).

import { scrypt as scryptCb, timingSafeEqual, randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { dbGetCredentials } from "./users";

export type { StoredUser } from "./profile";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEY_LEN = 64;

/**
 * Verify a username/password pair in constant time relative to whether
 * the user exists. Always performs an scrypt computation so the timing
 * does not reveal whether the username was found.
 */
export async function verifyCredentials(
  username: unknown,
  password: unknown,
): Promise<{ ok: true; username: string } | { ok: false }> {
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username.length === 0 ||
    username.length > 128 ||
    password.length === 0 ||
    password.length > 1024
  ) {
    return { ok: false };
  }

  let user: Awaited<ReturnType<typeof dbGetCredentials>> = null;
  try {
    user = await dbGetCredentials(username);
  } catch {
    // Fall through and run scrypt against decoy material so timing
    // doesn't reveal a DB outage either.
    user = null;
  }

  // Always run scrypt against *something* to keep timing similar.
  const decoySalt = randomBytes(16);
  const saltBuf = user ? safeHexToBuffer(user.salt) : decoySalt;
  const expected = user ? safeHexToBuffer(user.hash) : randomBytes(KEY_LEN);

  let derived: Buffer;
  try {
    derived = await scrypt(password, saltBuf, expected.length || KEY_LEN);
  } catch {
    return { ok: false };
  }

  const matches =
    !!user &&
    derived.length === expected.length &&
    timingSafeEqual(derived, expected);

  if (!matches || !user) return { ok: false };
  return { ok: true, username: user.username };
}

function safeHexToBuffer(hex: string): Buffer {
  if (!/^[0-9a-fA-F]*$/.test(hex) || hex.length % 2 !== 0) {
    return Buffer.alloc(0);
  }
  return Buffer.from(hex, "hex");
}

/**
 * Generate a new salt+hash pair for a password. Used by the
 * scripts/hash-password.mjs CLI helper and the admin panel.
 */
export async function hashPassword(
  password: string,
): Promise<{ salt: string; hash: string }> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LEN);
  return { salt: salt.toString("hex"), hash: derived.toString("hex") };
}
