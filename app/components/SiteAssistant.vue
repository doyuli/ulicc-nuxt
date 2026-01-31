<script setup lang="ts">
import { DefaultChatTransport } from 'ai'
import { defu } from 'defu'
import { BotIcon, CircleAlertIcon, Trash2Icon, XIcon } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  ChatMarkdownRenderer,
  Conversation,
  ConversationContent,
  ConversationSubmitted,
  Message,
  MessageContent,
  PromptInput,
  PromptSubmit,
} from '~/components/chat'
import { cn } from '~/lib/utils'

const route = useRoute()

const {
  inputText,
  status,
  messages,
  error,
  onSubmit,
  regenerate,
  stop,
  clearMessages,
  clearError,
} = useChat(
  {
    transport: new DefaultChatTransport({
      api: '/api/chat/assistant',
    }),
    onError: (error) => {
      const { message } = normalizeChatError(error)
      toast.error(message)
    },
  },
  {
    onBeforeSubmit: (payload) => {
      clearError()

      const options: typeof payload.options = {
        body: { context: { path: route.path } },
      }
      payload.options = defu(options, payload.options)
    },
  },
)

const displayError = computed(() => normalizeChatError(error.value))

function clean() {
  clearMessages()
  clearError()
}

const target = useTemplateRef('target')
const isOpen = shallowRef(false)

onClickOutside(target, () => {
  if (isOpen.value)
    isOpen.value = false
})

const inputRef = useTemplateRef<HTMLInputElement>('input')
const { focused } = useFocus(inputRef)

watch(isOpen, async (val) => {
  if (val) {
    await nextTick()
    focused.value = true
  }
})

const suggestions = computed(() => {
  const globalSuggestions = [
    {
      label: '关于博客',
      value: '介绍下这个博客',
    },
    {
      label: '推荐文章',
      value: '我最近正在关注 Vue3 ，能推荐几篇你认为高质量的博客文章吗？',
    },
    {
      label: '随便聊聊',
      value: '作为 AI 助手，你可以为我做些什么？',
    },
  ]

  const isPostPage = route.path.startsWith('/posts/')

  const postSuggestions = [
    {
      label: '关于文章',
      value: '这篇文章说了什么',
    },
    {
      label: '核心要点',
      value: '请列出这篇文章的关键知识点',
    },
  ]

  return isPostPage ? [...postSuggestions, ...globalSuggestions] : globalSuggestions
})

function onSuggestion(text: string) {
  inputText.value = text
  onSubmit()
}
</script>

<template>
  <div ref="target" class="fixed bottom-6 left-6 z-50 flex flex-col pointer-events-none">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="scale-90 opacity-0 translate-y-8"
      enter-to-class="scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="scale-100 opacity-100 translate-y-0"
      leave-to-class="scale-90 opacity-0 translate-y-8"
    >
      <Card v-if="isOpen" class="py-0 flex flex-col gap-0 w-[calc(100vw-3rem)] sm:w-96 mb-4 h-[500px] shadow-2xl pointer-events-auto">
        <CardHeader class="py-3 flex items-center justify-between bg-muted">
          <div class="flex items-center gap-2">
            <div :class="cn('w-2 h-2 rounded-full animate-pulse', error ? 'bg-red-500' : 'bg-emerald-500')" />
            <span class="text-sm font-medium tracking-tight">SiteAssistant</span>
          </div>
          <button v-if="messages.length" class="text-muted-foreground transition-colors" @click="clean">
            <Trash2Icon class="text-muted-foreground/60 size-4 shrink-0" />
          </button>
        </CardHeader>
        <CardContent class="relative flex-1 overflow-y-auto p-0 space-y-4 flex flex-col">
          <Conversation>
            <ConversationContent class="gap-2">
              <template v-if="messages?.length">
                <Message
                  v-for="message in messages"
                  :key="message.id"
                  :role="message.role"
                >
                  <MessageContent class="text-sm" variant="ghost">
                    <template v-for="(part, i) in message.parts" :key="i">
                      <template v-if="part.type === 'text'">
                        <p v-if="message.role === 'user'">
                          {{ part.text }}
                        </p>
                        <ChatMarkdownRenderer v-else :value="part.text" :cache-key="`${message.id}-${i}`" />
                      </template>
                    </template>
                  </MessageContent>
                </Message>
              </template>
              <template v-else>
                <Message role="system">
                  <MessageContent class="text-sm">
                    <p class="leading-6">
                      你好，请问有什么可以帮您的吗
                    </p>
                  </MessageContent>
                </Message>
              </template>
              <div v-if="error" class="absolute max-w-3/4 bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 text-nowrap text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
                <CircleAlertIcon class="size-3 shrink-0" />
                <span class="truncate" :title="displayError.message">{{ displayError.message }}</span>
              </div>
              <ConversationSubmitted v-if="status === 'submitted'" />
            </ConversationContent>
          </Conversation>
        </CardContent>
        <CardFooter class="py-3! border-t flex-col gap-3">
          <div v-if="!messages.length" class="self-start w-full flex gap-x-2 overflow-x-auto scrollbar-hide">
            <Button
              v-for="(s, i) in suggestions"
              :key="i"
              class="rounded-full text-xs"
              size="sm"
              variant="outline"
              @click="onSuggestion(s.value)"
            >
              {{ s.label }}
            </Button>
          </div>
          <PromptInput class="[--radius:9999px]" align="inline-end" @submit="onSubmit">
            <InputGroupInput ref="input" v-model="inputText" placeholder="Ask about articles..." />
            <template #addon>
              <PromptSubmit
                :status="status"
                :disabled="!inputText.trim() && status === 'ready'"
                @reload="regenerate"
                @stop="stop"
              />
            </template>
          </PromptInput>
        </CardFooter>
      </Card>
    </Transition>

    <button
      :class="cn(
        'group flex items-center justify-center size-12 md:size-14 shadow-lg hover:shadow-xl transform hover:-translate-y-1 pointer-events-auto transition-all duration-500 rounded-full',
        isOpen ? 'bg-card text-secondary-foreground border' : 'bg-primary text-primary-foreground opacity-70 hover:opacity-100',
      )"
      aria-label="Toggle Assistant"
      @click="isOpen = !isOpen"
    >
      <BotIcon :class="cn('size-6 absolute transition-all duration-500 ease-in-out', isOpen ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100')" />
      <XIcon :class="cn('size-6 absolute transition-all duration-500 ease-in-out', isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0')" />
    </button>
  </div>
</template>
