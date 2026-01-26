import type { ChatInit, ChatRequestOptions, UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'

interface ExtraOptions {
  onBeforeSubmit?: (payload: ChatPayload) => boolean | void
  onError?: (error: any) => void
  onSuccess?: () => void
}

export interface ChatPayload {
  text: string
  options?: ChatRequestOptions
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

  const { onBeforeSubmit, onError, onSuccess } = extraOptions

  const chat = new Chat(options)

  const inputText = shallowRef('')

  async function onSubmit() {
    const text = inputText.value.trim()

    if (!text || chat.status === 'streaming' || chat.status === 'submitted')
      return

    const payload: ChatPayload = { text, options: undefined }

    if (onBeforeSubmit) {
      const result = onBeforeSubmit(payload)
      if (result === false)
        return
    }

    try {
      inputText.value = ''
      await chat.sendMessage({ text: payload.text }, payload.options)
      onSuccess?.()
    }
    catch (error) {
      onError?.(normalizeChatError(error))
    }
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
