import type { UIMessage } from 'ai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { convertToModelMessages, stepCountIs, streamText } from 'ai'
import { convertFahrenheitToCelsius, weather } from '../chat/tools'

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().aiGatewayApiKey
  if (!apiKey)
    throw new Error('Missing AI Gateway API key')

  const deepseek = createDeepSeek({ apiKey })

  return defineEventHandler(async (event: any) => {
    const { messages }: { messages: UIMessage[] } = await readBody(event)

    const result = streamText({
      model: deepseek('deepseek-chat'),
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      tools: {
        weather,
        convertFahrenheitToCelsius,
      },
    })

    return result.toUIMessageStreamResponse()
  })
})
