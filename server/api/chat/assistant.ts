import type { UIMessage } from 'ai'
import { convertToModelMessages, stepCountIs, streamText, tool } from 'ai'
import { z } from 'zod'
import { prompts } from '~~/server/chat/prompts'
import { createTools } from '~~/server/chat/tools'

export default defineLazyEventHandler(async () => {
  const deepseek = useDeepSeek()

  const checkRateLimit = useRateLimit({ intervalMs: 60 * 60 * 1000, limit: 10 })

  return defineEventHandler(async (event) => {
    useRateLimitHandler(event, checkRateLimit)

    const { messages, context }: { messages: UIMessage[], context: Record<string, string> } = await readBody(event)

    const result = streamText({
      model: deepseek('deepseek-chat'),
      system: prompts.system,
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      tools: {
        ...createTools(event),
        path: createPathTool(context),
      },
    })

    return result.toUIMessageStreamResponse()
  })
})

function createPathTool(context: Record<string, string> = {}) {
  return tool({
    description: `Retrieves the path of the article the user is currently browsing. Use this tool when the user refers to "this article" or "current page". The returned path is required to subsequently call 'tool-post' to fetch article details.`,
    inputSchema: z.object({}),
    execute: async () => {
      const path = context?.path || ''
      if (!path.startsWith('/posts/'))
        return 'The user is not currently on an article page, so content cannot be retrieved.'

      return path
    },
  })
}
