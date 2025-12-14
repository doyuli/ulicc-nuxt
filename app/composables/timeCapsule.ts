interface TimeProgress {
  progress: number
  remainingMs: number
}

interface DisplayRange {
  label: string
  progress: number
  tip: string
}

const MS_PER_HOUR = 36e5
const MS_PER_DAY = 864e5

function clampProgress(value: number) {
  return Math.min(100, Math.max(0, value))
}

function calcProgress(now: Date, start: Date, end: Date): TimeProgress {
  const total = end.getTime() - start.getTime()
  const passed = now.getTime() - start.getTime()
  const remaining = end.getTime() - now.getTime()

  return {
    progress: clampProgress((passed / total) * 100),
    remainingMs: Math.max(0, remaining),
  }
}

export function useTimeCapsule() {
  const now = useNow({ interval: 60_000 })

  const today = computed(() => {
    const start = new Date(now.value)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(start.getDate() + 1)

    const { progress, remainingMs } = calcProgress(now.value, start, end)

    return {
      label: '今日',
      progress,
      tip: `还剩 ${Math.ceil(remainingMs / MS_PER_HOUR)} 小时`,
    }
  })

  const week = computed(() => {
    const date = new Date(now.value)
    const day = date.getDay() || 7

    const start = new Date(date)
    start.setDate(date.getDate() - day + 1)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(start.getDate() + 7)

    const { progress, remainingMs } = calcProgress(now.value, start, end)

    return {
      label: '本周',
      progress,
      tip: `还剩 ${Math.ceil(remainingMs / MS_PER_DAY)} 天`,
    }
  })

  const month = computed(() => {
    const start = new Date(now.value.getFullYear(), now.value.getMonth(), 1)
    const end = new Date(now.value.getFullYear(), now.value.getMonth() + 1, 1)

    const { progress, remainingMs } = calcProgress(now.value, start, end)

    return {
      label: '本月',
      progress,
      tip: `还剩 ${Math.ceil(remainingMs / MS_PER_DAY)} 天`,
    }
  })

  const year = computed(() => {
    const start = new Date(now.value.getFullYear(), 0, 1)
    const end = new Date(now.value.getFullYear() + 1, 0, 1)

    const { progress, remainingMs } = calcProgress(now.value, start, end)

    return {
      label: '本年',
      progress,
      tip: `还剩 ${Math.ceil(remainingMs / MS_PER_DAY)} 天`,
    }
  })

  const ranges = computed<DisplayRange[]>(() => [
    today.value,
    week.value,
    month.value,
    year.value,
  ])

  return {
    ranges,
  }
}
