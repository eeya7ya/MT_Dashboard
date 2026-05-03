// DB-backed user CRUD. All queries lazily ensure the schema exists
// and seed the table from AUTH_USERS on first call so existing
// deployments migrate without manual intervention.

import { ensureSchema, getSql } from "./db";
import {
  computeInitials,
  type Profile,
  type StoredUser,
} from "./profile";

type UserRow = {
  username: string;
  salt?: string;
  hash?: string;
  display_name: string | null;
  role: string | null;
  is_admin: boolean;
};

function rowToProfile(r: UserRow): Profile {
  const displayName =
    typeof r.display_name === "string" && r.display_name.trim().length > 0
      ? r.display_name.trim()
      : r.username;
  const role =
    typeof r.role === "string" && r.role.trim().length > 0
      ? r.role.trim()
      : "Member";
  return {
    username: r.username,
    displayName,
    role,
    initials: computeInitials(displayName),
    isAdmin: r.is_admin === true,
  };
}

export async function dbListProfiles(): Promise<Profile[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT username, display_name, role, is_admin
    FROM app_users
    ORDER BY username ASC
  `) as UserRow[];
  return rows.map(rowToProfile);
}

export async function dbGetProfile(username: string): Promise<Profile | null> {
  if (typeof username !== "string" || username.length === 0) return null;
  await ensureSchema();
  const sql = getSql();
  const u = username.trim().toLowerCase();
  const rows = (await sql`
    SELECT username, display_name, role, is_admin
    FROM app_users
    WHERE username = ${u}
  `) as UserRow[];
  return rows[0] ? rowToProfile(rows[0]) : null;
}

export async function dbGetCredentials(
  username: string,
): Promise<StoredUser | null> {
  if (typeof username !== "string" || username.length === 0) return null;
  await ensureSchema();
  const sql = getSql();
  const u = username.trim().toLowerCase();
  const rows = (await sql`
    SELECT username, salt, hash, display_name, role, is_admin
    FROM app_users
    WHERE username = ${u}
  `) as UserRow[];
  const r = rows[0];
  if (!r || !r.salt || !r.hash) return null;
  return {
    username: r.username,
    salt: r.salt,
    hash: r.hash,
    displayName: r.display_name ?? undefined,
    role: r.role ?? undefined,
    isAdmin: r.is_admin === true,
  };
}

export async function dbUpsertUser(input: {
  username: string;
  salt: string;
  hash: string;
  displayName?: string;
  role?: string;
  isAdmin?: boolean;
}): Promise<{ created: boolean; profile: Profile }> {
  await ensureSchema();
  const sql = getSql();
  const u = input.username.trim().toLowerCase();
  const display = input.displayName?.trim() || null;
  const role = input.role?.trim() || null;
  const isAdmin = input.isAdmin === true;

  const rows = (await sql`
    INSERT INTO app_users (username, salt, hash, display_name, role, is_admin)
    VALUES (${u}, ${input.salt}, ${input.hash}, ${display}, ${role}, ${isAdmin})
    ON CONFLICT (username) DO UPDATE SET
      salt         = EXCLUDED.salt,
      hash         = EXCLUDED.hash,
      display_name = EXCLUDED.display_name,
      role         = EXCLUDED.role,
      is_admin     = EXCLUDED.is_admin,
      updated_at   = now()
    RETURNING username, display_name, role, is_admin, (xmax = 0) AS created
  `) as (UserRow & { created: boolean })[];
  const r = rows[0]!;
  return { created: r.created === true, profile: rowToProfile(r) };
}

export async function dbDeleteUser(
  username: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await ensureSchema();
  const sql = getSql();
  const u = username.trim().toLowerCase();

  const rows = (await sql`
    SELECT is_admin FROM app_users WHERE username = ${u}
  `) as { is_admin: boolean }[];
  if (!rows[0]) return { ok: false, error: "User not found." };

  if (rows[0].is_admin) {
    const c = (await sql`
      SELECT COUNT(*)::int AS c FROM app_users WHERE is_admin = true
    `) as { c: number }[];
    if ((c[0]?.c ?? 0) <= 1) {
      return { ok: false, error: "Cannot delete the last admin." };
    }
  }

  await sql`DELETE FROM app_users WHERE username = ${u}`;
  return { ok: true };
}
