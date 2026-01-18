type Entry = { count: number; lastRequest: number };

const buckets = new Map<string, Entry>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = buckets.get(key) ?? { count: 0, lastRequest: now };
  if (now - entry.lastRequest > windowMs) {
    entry.count = 0;
    entry.lastRequest = now;
  }
  entry.count += 1;
  buckets.set(key, entry);
  const remaining = Math.max(0, limit - entry.count);
  return { allowed: entry.count <= limit, remaining };
}
