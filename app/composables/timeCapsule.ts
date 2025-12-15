import { NEXT_NEW_YEAR_DATES } from '~/constants/greeting'

const MS_PER_HOUR = 60 * 60 * 1000
const MS_PER_DAY = 24 * MS_PER_HOUR

export function useTimeCapsule(globalTime: MaybeRef<Date>) {
  const formatRemainingDays = (ms: number) => Math.ceil(ms / MS_PER_DAY)
  const formatRemainingHours = (ms: number) => Math.ceil(ms / MS_PER_HOUR)

  const padZero = (num: number) => String(num).padStart(2, '0')

  const clampProgress = (value: number) => Math.min(100, Math.max(0, value))

  const calcProgress = (now: Date, start: Date, end: Date) => {
    const total = end.getTime() - start.getTime()

    if (total <= 0)
      return { progress: 100, remainingMs: 0 }

    const passed = now.getTime() - start.getTime()
    const remaining = end.getTime() - now.getTime()

    return {
      progress: clampProgress((passed / total) * 100),
      remainingMs: Math.max(0, remaining),
    }
  }

  const getStartOfTomorrow = (now: Date) => {
    const startOfTomorrow = new Date(now)
    startOfTomorrow.setDate(now.getDate() + 1)
    startOfTomorrow.setHours(0, 0, 0, 0)
    return startOfTomorrow
  }

  const getDayRange = (now: Date) => {
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(start.getDate() + 1)

    return { start, end }
  }

  const getWeekRange = (now: Date) => {
    const date = new Date(now)

    const day = date.getDay() || 7

    const start = new Date(date)
    start.setDate(date.getDate() - day + 1)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(start.getDate() + 7)

    return { start, end }
  }

  const getMonthRange = (now: Date) => {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    return { start, end }
  }

  const getYearRange = (now: Date) => {
    const start = new Date(now.getFullYear(), 0, 1)
    const end = new Date(now.getFullYear() + 1, 0, 1)

    return { start, end }
  }

  const findNextNewYear = (now: Date) => {
    const nowTime = now.getTime()

    const next = NEXT_NEW_YEAR_DATES.find(def => new Date(def.year, def.month - 1, def.day).getTime() > nowTime)

    if (!next)
      return null

    return {
      toString: (separator = '-') => [String(next.year), padZero(next.month), padZero(next.day)].join(separator),
      date: new Date(next.year, next.month - 1, next.day),
    }
  }

  const today = computed(() => {
    const currentTime = unref(globalTime)
    const { start, end } = getDayRange(currentTime)
    const { progress, remainingMs } = calcProgress(currentTime, start, end)
    return {
      rangeName: '今日',
      progress,
      rangeText: `还剩${formatRemainingHours(remainingMs)}小时`,
    }
  })

  const week = computed(() => {
    const tomorrow = getStartOfTomorrow(unref(globalTime))
    const { start, end } = getWeekRange(tomorrow)
    const { progress, remainingMs } = calcProgress(tomorrow, start, end)
    return {
      rangeName: '本周',
      progress,
      rangeText: `还剩${formatRemainingDays(remainingMs)}天`,
    }
  })

  const month = computed(() => {
    const tomorrow = getStartOfTomorrow(unref(globalTime))
    const { start, end } = getMonthRange(tomorrow)
    const { progress, remainingMs } = calcProgress(tomorrow, start, end)
    return {
      rangeName: '本月',
      progress,
      rangeText: `还剩${formatRemainingDays(remainingMs)}天`,
    }
  })

  const year = computed(() => {
    const tomorrow = getStartOfTomorrow(unref(globalTime))
    const { start, end } = getYearRange(tomorrow)
    const { progress, remainingMs } = calcProgress(tomorrow, start, end)
    return {
      rangeName: '本年',
      progress,
      rangeText: `还剩${formatRemainingDays(remainingMs)}天`,
    }
  })

  const ranges = computed(() => [
    today.value,
    week.value,
    month.value,
    year.value,
  ])

  const newYear = computed(() => {
    const tomorrow = getStartOfTomorrow(unref(globalTime))
    const next = findNextNewYear(tomorrow)

    if (!next)
      return null

    const start = new Date(tomorrow.getFullYear(), 0, 1)

    const { remainingMs } = calcProgress(tomorrow, start, next.date)

    return {
      rangeName: '春节',
      daysLeft: formatRemainingDays(remainingMs),
      date: next.toString(),
    }
  })

  return {
    ranges,
    newYear,
  }
}
