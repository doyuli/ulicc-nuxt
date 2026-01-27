import type { UIMessage } from 'ai'
import type { PromptsKey } from '~~/server/chat/prompts'
import { convertToModelMessages, stepCountIs, streamText } from 'ai'
import { prompts } from '~~/server/chat/prompts'
import { createPostsTool, createPostTool, createWeatherTool } from '~~/server/chat/tools'

export default defineLazyEventHandler(async () => {
  const deepseek = useDeepSeek()

  return defineEventHandler(async (event) => {
    await requireUserSession(event)

    const { messages, prompt = 'system' }: { messages: UIMessage[], prompt?: PromptsKey } = await readBody(event)

    const system = prompts[prompt] ?? prompts.system

    const result = streamText({
      model: deepseek('deepseek-chat'),
      system,
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
