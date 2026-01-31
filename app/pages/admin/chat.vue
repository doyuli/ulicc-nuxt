<script setup lang="ts">
import { DefaultChatTransport } from 'ai'
import { defu } from 'defu'
import { Trash2Icon } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  ChatMarkdownRenderer,
  ChatTool,
  Conversation,
  ConversationContent,
  ConversationSubmitted,
  isTool,
  Message,
  MessageAvatar,
  MessageContent,
  PromptInput,
  PromptInputTextarea,
  PromptSubmit,
} from '~/components/chat'

definePageMeta({
  middleware: 'auth',
})

usePageMeta({
  title: '站点助手',
})

const { data: prompts } = useAsyncData('prompts', () => $fetch('/api/chat/prompts'))
const currentPrompt = useLocalStorage<string>('system-chat-prompt', 'system')
const currentPromptDisplay = computed(() => {
  const current = prompts.value?.find(v => v.value === currentPrompt.value)
  return current?.label
})

function onPromptClick(val: string) {
  currentPrompt.value = val
  clean()
}

const {
  inputText,
  status,
  messages,
  onSubmit,
  clearMessages,
  regenerate,
  stop,
  sendMessage,
  clearError,
} = useChat(
  {
    transport: new DefaultChatTransport({
      api: '/api/chat/system',
      body: {
        prompt: currentPrompt.value,
      },
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
        body: { prompt: currentPrompt.value },
      }
      payload.options = defu(options, payload.options)
    },
  },
)

function clean() {
  stop()
  clearMessages()
  clearError()
}

const inputRef = useTemplateRef<HTMLInputElement>('input')
useFocus(inputRef, { initialValue: true })

const suggestions = [
  '帮我构思一篇关于 2026 年前端发展的博客大纲',
  '如何写出吸引人的博客标题？',
  '帮我润色一段关于‘极简主义’的文字',
  '介绍一下最近流行的人工智能技术',
]
</script>

<template>
  <PageSection class="max-w-3xl mx-auto w-full">
    <Card class="rounded-2xl flex flex-col h-[calc(100vh-15rem)]">
      <CardHeader class="flex items-center justify-between border-b">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <Avatar class="size-8 ">
              <AvatarFallback class="text-primary-foreground uppercase text-xs font-bold bg-primary-light">
                AI
              </AvatarFallback>
            </Avatar>
            <div class="absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-500 border-2 border-primary-foreground rounded-full" />
          </div>
          <div>
            <h2 class="text-sm font-bold tracking-tight">
              SiteAssistant
            </h2>
            <p class="text-[10px] text-muted-foreground/70 uppercase tracking-tighter">
              ONLINE
            </p>
          </div>
        </div>
        <Button v-if="messages.length" variant="ghost" size="icon-sm" @click="clean">
          <Trash2Icon class="text-muted-foreground/60 size-4 shrink-0" />
        </Button>
      </CardHeader>
      <CardContent class="flex-1 min-h-0">
        <Conversation>
          <ConversationContent>
            <template v-if="messages?.length">
              <Message
                v-for="message in messages"
                :key="message.id"
                :role="message.role"
              >
                <MessageAvatar />
                <MessageContent variant="ghost" class="[&_p]:leading-8">
                  <template v-for="(part, i) in message.parts" :key="i">
                    <template v-if="part.type === 'text'">
                      <p v-if="message.role === 'user'">
                        {{ part.text }}
                      </p>
                      <ChatMarkdownRenderer v-else :value="part.text" :cache-key="`${message.id}-${i}`" />
                    </template>
                    <ChatTool v-else-if="isTool(part)" :part="part " :state="part.state" />
                  </template>
                </MessageContent>
              </Message>
            </template>
            <template v-else>
              <Message role="system">
                <MessageAvatar class="size-8" />
                <MessageContent variant="ghost">
                  <p class="leading-8">
                    你好，请问有什么可以帮您的吗
                  </p>
                </MessageContent>
              </Message>
              <div v-if="suggestions?.length" class="mt-8 flex flex-wrap justify-center gap-2">
                <Button
                  v-for="suggest in suggestions"
                  :key="suggest"
                  size="sm"
                  variant="ghost"
                  @click="() => sendMessage({ text: suggest })"
                >
                  {{ suggest }}
                </Button>
              </div>
            </template>
            <ConversationSubmitted v-if="status === 'submitted'" />
          </ConversationContent>
        </Conversation>
      </CardContent>
      <CardFooter>
        <PromptInput align="block-end" @submit="onSubmit">
          <PromptInputTextarea ref="input" v-model="inputText" />
          <template #addon>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <InputGroupButton variant="ghost">
                  {{ currentPromptDisplay }}
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" class="[--radius:0.95rem]">
                <DropdownMenuItem
                  v-for="p in prompts"
                  :key="p.value"
                  @click="onPromptClick(p.value)"
                >
                  {{ p.label }}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <PromptSubmit
              class="ml-auto"
              :status="status"
              :disabled="!inputText.trim() && status === 'ready'"
              @reload="regenerate"
              @stop="stop"
            />
          </template>
        </PromptInput>
      </CardFooter>
    </Card>
  </PageSection>
</template>
