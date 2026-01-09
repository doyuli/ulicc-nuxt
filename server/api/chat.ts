import type { UIMessage } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { convertToModelMessages, stepCountIs, streamText } from 'ai'
import { BLOG_ASSISTANT_PROMPT } from '../chat/prompts/system'
import { createPostsTool, createPostTool, createWeatherTool } from '../chat/tools'

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().aiGatewayApiKey
  if (!apiKey)
    throw new Error('Missing AI Gateway API key')

  const deepseek = createDeepSeek({ apiKey })

  return defineEventHandler(async (event) => {
    const { messages }: { messages: UIMessage[] } = await readBody(event)

    const result = streamText({
      model: deepseek('deepseek-chat'),
      system: BLOG_ASSISTANT_PROMPT,
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
