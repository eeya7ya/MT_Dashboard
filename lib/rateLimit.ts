// Lightweight in-memory rate limiter keyed by an arbitrary string
// (typically `${ip}:${username}` or just the IP). Intended for
// brute-force mitigation on the login endpoint.
//
// Note: in-memory state is per-server-instance. For multi-instance
// deployments (e.g. multiple Vercel regions) a shared store like
// Redis or Upstash should replace this.

type Bucket = {
  count: number;
  /** epoch-ms when the bucket resets */
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_TRACKED_KEYS = 10_000;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function checkRateLimit(
  key: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      // Evict any expired bucket to keep memory bounded; if none,
      // drop the oldest insertion-order entry.
      let evicted = false;
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) {
          buckets.delete(k);
          evicted = true;
          break;
        }
      }
      if (!evicted) {
        const firstKey = buckets.keys().next().value;
        if (firstKey !== undefined) buckets.delete(firstKey);
      }
    }
    const fresh: Bucket = { count: 1, resetAt: now + windowMs };
    buckets.set(key, fresh);
    return { allowed: true, remaining: limit - 1, resetAt: fresh.resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

export function resetRateLimit(key: string): void {
  buckets.delete(key);
}
