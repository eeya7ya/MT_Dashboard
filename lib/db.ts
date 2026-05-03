// Neon serverless connection helper. Lazily initialised so importing
// this module never throws at build time when DATABASE_URL isn't set
// (for example in CI builds before the env var is wired up).

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { parseStoredUsers } from "./profile";

let cachedSql: NeonQueryFunction<false, false> | null = null;
let readyPromise: Promise<void> | null = null;

function getDatabaseUrl(): string {
  // Support both the standard DATABASE_URL and the env vars that
  // Vercel's first-party Neon integration sets automatically.
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL;
  if (!url) {
    throw new Error(
      "No database URL configured. Set DATABASE_URL (or use the Vercel↔Neon integration which sets POSTGRES_URL).",
    );
  }
  return url;
}

export function getSql(): NeonQueryFunction<false, false> {
  if (!cachedSql) {
    cachedSql = neon(getDatabaseUrl());
  }
  return cachedSql;
}

/**
 * Idempotent: creates the `app_users` table if missing and seeds it
 * from the legacy `AUTH_USERS` env var on first run, so existing
 * env-based deployments migrate to the DB transparently.
 *
 * Memoised per process so we only pay the round-trip on cold start.
 */
export async function ensureSchema(): Promise<void> {
  if (readyPromise) return readyPromise;

  readyPromise = (async () => {
    const sql = getSql();
    await sql`
      CREATE TABLE IF NOT EXISTS app_users (
        username     text PRIMARY KEY,
        salt         text NOT NULL,
        hash         text NOT NULL,
        display_name text,
        role         text,
        is_admin     boolean NOT NULL DEFAULT false,
        created_at   timestamptz NOT NULL DEFAULT now(),
        updated_at   timestamptz NOT NULL DEFAULT now()
      )
    `;

    const countRows = (await sql`SELECT COUNT(*)::int AS c FROM app_users`) as {
      c: number;
    }[];
    if (countRows[0]?.c === 0) {
      const seed = parseStoredUsers();
      for (const u of seed) {
        await sql`
          INSERT INTO app_users (username, salt, hash, display_name, role, is_admin)
          VALUES (
            ${u.username.trim().toLowerCase()},
            ${u.salt},
            ${u.hash},
            ${u.displayName ?? null},
            ${u.role ?? null},
            ${u.isAdmin === true}
          )
          ON CONFLICT (username) DO NOTHING
        `;
      }
    }
  })().catch((err) => {
    // Reset so a transient failure doesn't permanently poison the cache.
    readyPromise = null;
    throw err;
  });

  return readyPromise;
}
