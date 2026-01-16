<script setup lang="ts">
import type { ChatStatus, UIMessage } from 'ai'
import type { HtmlHTMLAttributes } from 'vue'
import { Loader2Icon } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import { ChatMessage } from '.'

const props = defineProps <{
  messages?: UIMessage[]
  status?: ChatStatus
  class?: HtmlHTMLAttributes['class']
  suggestions?: string[]
}>()

const emit = defineEmits<{
  (e: 'suggest', event: string): void
}>()

const bottomAnchor = useTemplateRef<HTMLDivElement>('bottom-anchor')
const scrollContainer = useTemplateRef<HTMLDivElement>('scroll-container')

let isUserScrollingUp = false

function isAtBottom() {
  const el = scrollContainer.value
  if (!el)
    return true

  return el.scrollHeight - el.scrollTop <= el.clientHeight + 100
}

function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
  bottomAnchor.value?.scrollIntoView({ behavior })
}

watch(() => props.messages?.length, () => {
  isUserScrollingUp = false
  nextTick(() => scrollToBottom('smooth'))
})

watchThrottled(
  () => props.messages,
  () => {
    if (props.status === 'streaming' && !isUserScrollingUp)
      scrollToBottom('auto')
  },
  { deep: true, throttle: 50 },
)

watch(() => props.status, (status) => {
  if (status === 'submitted') {
    isUserScrollingUp = false
    nextTick(() => scrollToBottom('smooth'))
  }
})

onMounted(() => {
  useEventListener(scrollContainer, 'scroll', () => {
    isUserScrollingUp = !isAtBottom()
  })
})
</script>

<template>
  <div ref="scroll-container" :class="cn('flex flex-col size-full overflow-y-auto scroll-smooth', $props.class)">
    <div v-if="!messages?.length" class="flex-1 flex flex-col items-center justify-center gap-1">
      <h4 class="text-2xl font-bold text-secondary-foreground">
        有什么我可以帮忙的吗？
      </h4>
      <span class="text-muted-foreground mb-4 max-w-sm text-xs">您可以尝试询问这些问题，或者直接输入您的想法。</span>
      <div v-if="suggestions?.length" class="flex flex-wrap justify-center gap-2">
        <Button
          v-for="suggest in suggestions"
          :key="suggest"
          size="sm"
          variant="ghost"
          @click="emit('suggest', suggest)"
        >
          {{ suggest }}
        </Button>
      </div>
    </div>

    <div class="flex flex-col">
      <slot :messages="messages">
        <ChatMessage
          v-for="message in messages"
          :key="message.id"
          :message="message"
        />
      </slot>
    </div>

    <div v-if="status === 'submitted'" class="flex items-center gap-2 py-6 opacity-50">
      <Loader2Icon class="size-4 animate-spin" />
      <span class="text-xs font-medium">正在思考...</span>
    </div>

    <div ref="bottom-anchor" class="h-1 shrink-0" />
  </div>
</template>
