import { NEXT_NEW_YEAR_DATES } from '~/constants/greeting'

const MS_PER_HOUR = 60 * 60 * 1000
const MS_PER_DAY = 24 * MS_PER_HOUR

function clampProgress(value: number) {
  return Math.min(100, Math.max(0, value))
}

function calcProgress(now: Date, start: Date, end: Date) {
  const total = end.getTime() - start.getTime()

  if (total <= 0) {
    return { progress: 100, remainingMs: 0 }
  }

  const passed = now.getTime() - start.getTime()
  const remaining = end.getTime() - now.getTime()

  return {
    progress: clampProgress((passed / total) * 100),
    remainingMs: Math.max(0, remaining),
  }
}

function getDayRange(now: Date) {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 1)

  return { start, end }
}

function getWeekRange(now: Date) {
  const date = new Date(now)

  const day = date.getDay() || 7

  const start = new Date(date)
  start.setDate(date.getDate() - day + 1)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 7)

  return { start, end }
}

function getMonthRange(now: Date) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  return { start, end }
}

function getYearRange(now: Date) {
  const start = new Date(now.getFullYear(), 0, 1)
  const end = new Date(now.getFullYear() + 1, 0, 1)

  return { start, end }
}

function findNextNewYear(now: Date) {
  const nowTime = now.getTime()

  const next = NEXT_NEW_YEAR_DATES.find((def) => {
    const targetDate = new Date(def.year, def.month - 1, def.day)
    return targetDate.getTime() > nowTime
  })

  if (!next)
    return null

  const padZero = (num: number): string => String(num).padStart(2, '0')

  return {
    toString: (separator = '-') => [next.year, padZero(next.month), padZero(next.day)].join(separator),
    date: new Date(next.year, next.month - 1, next.day),
  }
}

function getNewYearRange(now: Date, end: Date) {
  const start = new Date(now.getFullYear(), 0, 1)
  return { start, end }
}

export function useTimeCapsule(globalTime: Ref<Date>) {
  const formatRemainingDays = (ms: number) => Math.ceil(ms / MS_PER_DAY)
  const formatRemainingHours = (ms: number) => Math.ceil(ms / MS_PER_HOUR)

  const today = computed(() => {
    const { start, end } = getDayRange(globalTime.value)
    const { progress, remainingMs } = calcProgress(globalTime.value, start, end)
    return {
      rangeName: '今日',
      progress,
      rangeText: `还剩${formatRemainingHours(remainingMs)}小时`,
    }
  })

  const week = computed(() => {
    const { start, end } = getWeekRange(globalTime.value)
    const { progress, remainingMs } = calcProgress(globalTime.value, start, end)
    return {
      rangeName: '本周',
      progress,
      rangeText: `还剩${formatRemainingDays(remainingMs)}天`,
    }
  })

  const month = computed(() => {
    const { start, end } = getMonthRange(globalTime.value)
    const { progress, remainingMs } = calcProgress(globalTime.value, start, end)
    return {
      rangeName: '本月',
      progress,
      rangeText: `还剩${formatRemainingDays(remainingMs)}天`,
    }
  })

  const year = computed(() => {
    const { start, end } = getYearRange(globalTime.value)
    const { progress, remainingMs } = calcProgress(globalTime.value, start, end)
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
    const next = findNextNewYear(globalTime.value)

    if (!next)
      return null

    const { start, end } = getNewYearRange(globalTime.value, next.date)
    const { remainingMs } = calcProgress(globalTime.value, start, end)

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
