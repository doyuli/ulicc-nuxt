export const HOLIDAY_MESSAGES = [
  { name: '元旦', month: 1, day: 1, message: '元旦快乐，万象更新' },
  { name: '国庆节', month: 10, day: 1, message: '国庆佳节，山河壮丽' },
  { name: '圣诞节', month: 12, day: 25, message: '圣诞喜乐，平安顺遂' },
]

export const TIME_RANGES = [
  { start: 0, end: 6, message: '夜深了，早点休息' },
  { start: 6, end: 9, message: '早安！新的一天元气满满' },
  { start: 9, end: 12, message: '上午好，今天也要加油呀' },
  { start: 12, end: 14, message: '午休时间，好好放松一下' },
  { start: 14, end: 17, message: '下午好，咖啡续命时间到' },
  { start: 17, end: 19, message: '傍晚好，辛苦啦' },
  { start: 19, end: 22, message: '晚上好，享受夜间时光' },
  { start: 22, end: 24, message: '夜深了，晚安好梦' },
] as const

export enum DAY_OF_WEEK {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export const DAY_MESSAGES: Record<number, string> = {
  [DAY_OF_WEEK.SATURDAY]: '好好享受一下周末',
  [DAY_OF_WEEK.SUNDAY]: '周日愉快，充电蓄能',
}

export const NEXT_NEW_YEAR_DATES = [
  { year: 2026, month: 2, day: 17 },
  { year: 2027, month: 2, day: 6 },
  { year: 2028, month: 1, day: 26 },
  { year: 2029, month: 2, day: 13 },
  { year: 2030, month: 2, day: 3 },
  { year: 2031, month: 1, day: 23 },
  { year: 2032, month: 2, day: 11 },
  { year: 2033, month: 1, day: 31 },
  { year: 2034, month: 2, day: 19 },
  { year: 2035, month: 2, day: 8 },
] as const

export const MS_PER_HOUR = 60 * 60 * 1000
export const MS_PER_DAY = 24 * MS_PER_HOUR
