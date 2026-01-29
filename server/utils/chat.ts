import { createDeepSeek } from '@ai-sdk/deepseek'
import { createOpenAI } from '@ai-sdk/openai'

export function useSiliconflow() {
  const apiKey = useRuntimeConfig().siliconflowApiKey
  if (!apiKey)
    throw new Error('Missing AI Gateway API key')

  const siliconflow = createOpenAI({
    baseURL: 'https://api.siliconflow.cn/v1',
    apiKey,
  })

  return siliconflow
}

export function useDeepSeek() {
  const apiKey = useRuntimeConfig().aiGatewayApiKey
  if (!apiKey)
    throw new Error('Missing AI Gateway API key')

  const deepseek = createDeepSeek({ apiKey })

  return deepseek
}
