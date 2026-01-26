import type { ChatInit, UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'

interface ExtraOptions {
  onBeforeSubmit?: (text: string) => string | void
  onError?: (error: any) => void
}

export function useChat<T extends UIMessage>(
  optionsOrUrl: ChatInit<T> | string,
  extraOptions: ExtraOptions = {},
) {
  const options = typeof optionsOrUrl === 'string'
    ? {
        transport: new DefaultChatTransport({
          api: optionsOrUrl,
        }),
      }
    : optionsOrUrl

  const { onBeforeSubmit, onError } = extraOptions

  const chat = new Chat(options)

  const inputText = shallowRef('')

  function onSubmit() {
    let text = inputText.value.trim()

    if (onBeforeSubmit) {
      const result = onBeforeSubmit(text)
      if (result !== undefined)
        text = result
    }

    if (!text || chat.status === 'streaming' || chat.status === 'submitted')
      return

    try {
      chat.sendMessage({ text })
    }
    catch (error) {
      onError?.(error)
    }
    inputText.value = ''
  }

  const status = computed(() => chat.status)
  const messages = computed(() => chat.messages)
  const error = computed(() => chat.error)

  const clearMessages = () => chat.messages = []
  const regenerate = () => chat.regenerate()
  const stop = () => chat.stop()
  const clearError = () => chat.clearError()

  return {
    chat,
    inputText,
    status,
    messages,
    error,
    onSubmit,
    clearMessages,
    regenerate,
    stop,
    clearError,
    sendMessage: chat.sendMessage,
  }
}

export function normalizeChatError(error: any) {
  if (typeof error?.message !== 'string')
    return error

  try {
    return JSON.parse(error.message)
  }
  catch {
    return error
  }
}
