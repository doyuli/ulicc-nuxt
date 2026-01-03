<script setup lang="ts">
import type { ChatStatus, UIMessage } from 'ai'
import type { HtmlHTMLAttributes } from 'vue'
import { BotIcon, Loader2Icon } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import { ChatMessage } from '.'

const props = defineProps <{
  messages?: UIMessage[]
  status?: ChatStatus
  class?: HtmlHTMLAttributes['class']
}>()

const bottomAnchor = useTemplateRef<HTMLDivElement>('bottom-anchor')
const scrollContainer = useTemplateRef<HTMLDivElement>('scroll-container')

function isAtBottom() {
  const el = scrollContainer.value
  if (!el)
    return true

  return el.scrollHeight - el.scrollTop <= el.clientHeight + 159
}

function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
  bottomAnchor.value?.scrollIntoView({ behavior })
}

watch(() => props.messages?.length, () => {
  nextTick(() => scrollToBottom('smooth'))
})

watch(
  () => props.messages,
  () => {
    if (props.status === 'streaming' && isAtBottom())
      scrollToBottom('auto')
  },
  { deep: true },
)

watch(() => props.status, (status) => {
  if (status === 'submitted') {
    nextTick(() => scrollToBottom('smooth'))
  }
})
</script>

<template>
  <div ref="scroll-container" :class="cn('w-full overflow-y-auto scroll-smooth', $props.class)">
    <div class="max-w-4xl mx-auto min-h-full flex flex-col px-4">
      <div v-if="!messages?.length" class="flex-1 flex flex-col items-center justify-center gap-2 opacity-50">
        <BotIcon class="size-12" />
        <p class="text-sm">
          有什么可以帮你的？
        </p>
      </div>

      <div class="flex flex-col">
        <ChatMessage
          v-for="message in messages"
          :key="message.id"
          :message="message"
        />
      </div>

      <div v-if="status === 'submitted'" class="flex items-center gap-2 py-6 opacity-50">
        <Loader2Icon class="size-4 animate-spin" />
        <span class="text-xs font-medium">正在思考...</span>
      </div>

      <div ref="bottom-anchor" class="h-1 shrink-0" />
    </div>
  </div>
</template>
