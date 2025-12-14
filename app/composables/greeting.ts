const HOLIDAY_MESSAGES = new Map([
  ['1-1', '新年快乐！'],
  ['10-1', '国庆快乐！'],
  ['12-25', '圣诞快乐！'],
])

const TIME_RANGES = [
  { start: 0, end: 9, message: '早上好，今天也要开心哦！' },
  { start: 9, end: 12, message: '上午好，今天也要加油哦！' },
  { start: 12, end: 14, message: '中午好，保持精力！' },
  { start: 14, end: 17, message: '下午好，继续加油！' },
  { start: 17, end: 19, message: '傍晚好，是时候放松一下了！' },
  { start: 19, end: 22, message: '晚上好，是时候休息了！' },
  { start: 22, end: 24, message: '夜深了，明天继续加油！' },
] as const

const WEEKEND_MESSAGES: Record<number, string> = {
  6: '周六好，好好享受周末！',
  0: '周日愉快，放松一下吧！',
}

export function useDailyGreeting() {
  const now = useNow({ interval: 60 * 1000 })

  const dailyMessage = computed(() => {
    const hour = now.value.getHours()
    const dayOfWeek = now.value.getDay()
    const month = now.value.getMonth() + 1
    const dayOfMonth = now.value.getDate()

    const holidayKey: string = `${month}-${dayOfMonth}`
    if (HOLIDAY_MESSAGES.has(holidayKey))
      return HOLIDAY_MESSAGES.get(holidayKey)

    if (dayOfWeek in WEEKEND_MESSAGES) {
      return WEEKEND_MESSAGES[dayOfWeek]
    }

    const timeRange = TIME_RANGES.find(({ start, end }) => hour >= start && hour < end)
    return timeRange?.message ?? '你好，欢迎回来！'
  })

  return {
    dailyMessage,
  }
}
