<script setup lang="ts">
import { BotIcon, XIcon } from 'lucide-vue-next'
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

const {
  inputText,
  status,
  messages,
  onSubmit,
  regenerate,
  stop,
} = useChat('/api/chat/assistant')

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
</script>

<template>
  <div ref="target" class="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
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
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span class="text-sm font-medium tracking-tight">SiteAssistant</span>
          </div>
          <button class="text-muted-foreground transition-colors" @click="isOpen = false">
            <XIcon class="size-4" />
          </button>
        </CardHeader>
        <CardContent class="flex-1 overflow-y-auto p-0 space-y-4">
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
                    <p class="leading-7.5">
                      你好，请问有什么可以帮您的吗
                    </p>
                  </MessageContent>
                </Message>
              </template>
              <ConversationSubmitted v-if="status === 'submitted'" />
            </ConversationContent>
          </Conversation>
        </CardContent>
        <CardFooter class="py-3! border-t">
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
        'group flex items-center justify-center size-14 shadow-lg hover:shadow-xl transform hover:-translate-y-1 pointer-events-auto transition-all duration-500 rounded-full',
        isOpen ? 'bg-card text-secondary-foreground border' : 'bg-primary text-primary-foreground',
      )"
      aria-label="Toggle Assistant"
      @click="isOpen = !isOpen"
    >
      <BotIcon :class="cn('size-6 absolute transition-all duration-500 ease-in-out', isOpen ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100')" />
      <XIcon :class="cn('size-6 absolute transition-all duration-500 ease-in-out', isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0')" />
    </button>
  </div>
</template>
