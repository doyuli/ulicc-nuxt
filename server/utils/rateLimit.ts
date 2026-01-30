import type { H3Event } from 'h3'
import { LRUCache } from 'lru-cache'
import { HTTP_STATUS } from '~~/shared/constants'

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

  if (!allowed)
    throw createError({ statusCode: HTTP_STATUS.TOO_MANY_REQUESTS, message: '请求过于频繁，请稍后再试' })
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
