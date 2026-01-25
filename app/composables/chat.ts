import type { ChatInit, UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'

export function useChat<T extends UIMessage>(optionsOrUrl: ChatInit<T> | string) {
  const options = typeof optionsOrUrl === 'string'
    ? {
        transport: new DefaultChatTransport({
          api: optionsOrUrl,
        }),
      }
    : optionsOrUrl

  const chat = new Chat(options)

  const inputText = shallowRef('')

  function onSubmit() {
    const text = inputText.value.trim()

    if (!text || chat.status === 'streaming' || chat.status === 'submitted')
      return

    chat.sendMessage({ text })

    inputText.value = ''
  }

  const status = computed(() => chat.status)
  const messages = computed(() => chat.messages)

  const clearMessages = () => chat.messages = []
  const regenerate = () => chat.regenerate()
  const stop = () => chat.stop()

  return {
    chat,
    inputText,
    status,
    messages,
    onSubmit,
    clearMessages,
    regenerate,
    stop,
    sendMessage: chat.sendMessage,
  }
}
