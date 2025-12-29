import type { FileAfterParseHook } from '@nuxt/content'

const CODE_BLOCK_REG = /```[\s\S]*?```/g

export interface TransformOptions {
  charsPerMinute: number
  wordsPerMinute: number
  codeLinesPerMinute: number
}

export function transformContent(ctx: FileAfterParseHook, options: TransformOptions) {
  const { charsPerMinute, wordsPerMinute, codeLinesPerMinute } = options
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

  const minutes = chineseChars / charsPerMinute
    + englishWords / wordsPerMinute
    + codeLines / codeLinesPerMinute

  content.minRead = Math.max(1, Math.ceil(minutes))
}
