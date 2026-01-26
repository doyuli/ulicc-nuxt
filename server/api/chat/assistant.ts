import type { UIMessage } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { convertToModelMessages, stepCountIs, streamText } from 'ai'
import { prompts } from '~~/server/chat/prompts'
import { createPostsTool, createPostTool, createWeatherTool } from '~~/server/chat/tools'

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().aiGatewayApiKey
  if (!apiKey)
    throw new Error('Missing AI Gateway API key')

  const deepseek = createDeepSeek({ apiKey })

  return defineEventHandler(async (event) => {
    await requireUserSession(event)

    const { messages }: { messages: UIMessage[] } = await readBody(event)

    const result = streamText({
      model: deepseek('deepseek-chat'),
      system: prompts.system,
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      tools: {
        weather: createWeatherTool(),
        post: createPostTool(event),
        posts: createPostsTool(event),
      },
    })

    return result.toUIMessageStreamResponse()
  })
})
