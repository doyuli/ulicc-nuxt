import type { FileAfterParseHook } from '@nuxt/content'

const CHARS_PER_MIN = 300
const WORDS_PER_MIN = 180
const CODE_LINES_PER_MIN = 60

const CODE_BLOCK_REG = /```[\s\S]*?```/g

export function transformContent(ctx: FileAfterParseHook) {
  const { file, content } = ctx

  if (!file.id.endsWith('.md'))
    return

  if (content.minRead)
    return

  const body = typeof file.body === 'string' ? file.body : ''

  if (!body)
    return

  const codeBlocks = body.match(CODE_BLOCK_REG) ?? []
  const codeLines = codeBlocks
    .map(block => block.split('\n').length)
    .reduce((a, b) => a + b, 0)

  const text = body.replace(CODE_BLOCK_REG, '')

  const chineseChars = (text.match(/[\u4E00-\u9FA5]/g) ?? []).length
  const englishWords = (text.match(/[a-z]+/gi) ?? []).length

  const minutes = chineseChars / CHARS_PER_MIN
    + englishWords / WORDS_PER_MIN
    + codeLines / CODE_LINES_PER_MIN

  content.minRead = Math.max(1, Math.ceil(minutes))
}
