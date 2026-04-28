#!/usr/bin/env node
// Generate a salt+scrypt-hash pair for a password so it can be added
// to AUTH_USERS without ever storing the plaintext.
//
// Usage:
//   node scripts/hash-password.mjs <username> <password>
//   node scripts/hash-password.mjs yahya 'correct horse battery staple'
//
// The output is a single JSON object — drop it into the AUTH_USERS
// array in your .env.local.

import { scrypt as scryptCb, randomBytes } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error("Usage: node scripts/hash-password.mjs <username> <password>");
  process.exit(1);
}

if (password.length < 12) {
  console.error(
    "Refusing to hash a password shorter than 12 characters. Pick a stronger one.",
  );
  process.exit(1);
}

const salt = randomBytes(16);
const derived = await scrypt(password, salt, 64);

const entry = {
  username,
  salt: salt.toString("hex"),
  hash: Buffer.from(derived).toString("hex"),
};

console.log(JSON.stringify(entry, null, 2));
console.log("");
console.log("# Add to .env.local (escape inner double-quotes for shell):");
console.log(`AUTH_USERS='[${JSON.stringify(entry)}]'`);
