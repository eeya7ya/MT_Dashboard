// User profile helpers. Kept free of `node:` imports so the public
// `Profile` type can be referenced from client components without
// accidentally pulling Node-only modules into the client bundle.
//
// `parseStoredUsers` and friends DO read `process.env.AUTH_USERS` and
// must only be called on the server.

export type StoredUser = {
  username: string;
  /** hex-encoded salt */
  salt: string;
  /** hex-encoded scrypt-derived key */
  hash: string;
  /** Friendly name shown in the sidebar and admin panel. */
  displayName?: string;
  /** Free-text job title shown under the display name. */
  role?: string;
  /** When true, the user can access the admin panel. */
  isAdmin?: boolean;
};

/** Public-safe view of a user — never includes credential material. */
export type Profile = {
  username: string;
  displayName: string;
  role: string;
  initials: string;
  isAdmin: boolean;
};

export function parseStoredUsers(): StoredUser[] {
  const raw = process.env.AUTH_USERS;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (u): u is StoredUser =>
        u &&
        typeof u.username === "string" &&
        typeof u.salt === "string" &&
        typeof u.hash === "string",
    );
  } catch {
    return [];
  }
}

export function toProfile(u: StoredUser): Profile {
  const displayName =
    typeof u.displayName === "string" && u.displayName.trim().length > 0
      ? u.displayName.trim()
      : u.username;
  const role =
    typeof u.role === "string" && u.role.trim().length > 0
      ? u.role.trim()
      : "Member";
  return {
    username: u.username,
    displayName,
    role,
    initials: computeInitials(displayName),
    isAdmin: u.isAdmin === true,
  };
}

export function listProfiles(): Profile[] {
  return parseStoredUsers().map(toProfile);
}

export function getProfile(username: string): Profile | null {
  if (typeof username !== "string" || username.length === 0) return null;
  const normalized = username.trim().toLowerCase();
  const found = parseStoredUsers().find(
    (u) => u.username.trim().toLowerCase() === normalized,
  );
  return found ? toProfile(found) : null;
}

export function fallbackProfile(username: string): Profile {
  return {
    username,
    displayName: username,
    role: "Member",
    initials: computeInitials(username),
    isAdmin: false,
  };
}

export function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}
