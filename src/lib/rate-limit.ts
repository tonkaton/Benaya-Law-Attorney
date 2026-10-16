// ponytail: in-memory sliding window — correct for a single long-running server.
// Serverless / multiple instances: swap for @upstash/ratelimit (same allow(key) contract).
const hits = new Map<string, number[]>()

export function allow(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 10_000) hits.clear() // crude memory cap for a flood of unique IPs
  return true
}
