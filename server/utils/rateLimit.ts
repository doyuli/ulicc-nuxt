const rateLimitStore = new Map<string, number[]>()

export interface RateLimitOptions {
  intervalMs: number
  limit: number
}

export function useRateLimit(options: RateLimitOptions) {
  const { intervalMs, limit } = options

  return (ip: string) => {
    const now = Date.now()
    const windowStart = now - intervalMs

    let timestamps = rateLimitStore.get(ip) ?? []

    timestamps = timestamps.filter(t => t > windowStart)

    const allowed = timestamps.length < limit

    if (allowed) {
      timestamps.push(now)
      rateLimitStore.set(ip, timestamps)
    }

    return {
      allowed,
      remaining: Math.max(0, limit - timestamps.length),
    }
  }
}

export function cleanupRateLimitStore(intervalMs: number) {
  const now = Date.now()
  const windowStart = now - intervalMs

  for (const [ip, timestamps] of rateLimitStore.entries()) {
    const valid = timestamps.filter(t => t > windowStart)
    if (valid.length === 0) {
      rateLimitStore.delete(ip)
    }
    else {
      rateLimitStore.set(ip, valid)
    }
  }
}
