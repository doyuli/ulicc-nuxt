import type { H3Event } from 'h3'
import { LRUCache } from 'lru-cache'
import { RATE_LIMIT_ERROR } from '~~/shared/constants'

const rateLimitStore = new LRUCache<string, number[]>({
  max: 5000,
  ttl: 1000 * 60 * 60,
})

export interface RateLimitOptions {
  intervalMs: number
  limit: number
}

export function useRateLimitHandler(event: H3Event, checker: ReturnType<typeof useRateLimit>) {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const { allowed, remaining } = checker(ip)

  setResponseHeader(event, 'X-RateLimit-Remaining', remaining.toString())

  if (!allowed) {
    throw createError(RATE_LIMIT_ERROR)
  }
}

export function useRateLimit(options: RateLimitOptions) {
  const { intervalMs, limit } = options

  return (ip: string) => {
    const now = Date.now()
    const windowStart = now - intervalMs

    const timestamps = rateLimitStore.get(ip) ?? []

    while (timestamps.length > 0 && timestamps[0] <= windowStart) {
      timestamps.shift()
    }

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
