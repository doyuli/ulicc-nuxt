import { MS_PER_DAY, MS_PER_HOUR } from '~/constants/greeting'

export const msToDaysCeil = (ms: number) => Math.ceil(ms / MS_PER_DAY)
export const msToHoursCeil = (ms: number) => Math.ceil(ms / MS_PER_HOUR)
export const padZero = (num: number) => String(num).padStart(2, '0')
export function startOfNextDay(now: Date) {
  const next = new Date(now)
  next.setDate(now.getDate() + 1)
  next.setHours(0, 0, 0, 0)
  return next
}
