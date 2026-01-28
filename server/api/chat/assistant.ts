import type { UIMessage } from 'ai'
import { convertToModelMessages, stepCountIs, streamText } from 'ai'
import { prompts } from '~~/server/chat/prompts'
import { createTools } from '~~/server/chat/tools'

export default defineLazyEventHandler(async () => {
  const deepseek = useDeepSeek()

  const checkRateLimit = useRateLimit({ intervalMs: 60 * 60 * 1000, limit: 10 })

  return defineEventHandler(async (event) => {
    useRateLimitHandler(event, checkRateLimit)

    const { messages }: { messages: UIMessage[] } = await readBody(event)

    const result = streamText({
      model: deepseek('deepseek-chat'),
      system: prompts.system,
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      tools: createTools(event),
    })

    return result.toUIMessageStreamResponse()
  })
})
