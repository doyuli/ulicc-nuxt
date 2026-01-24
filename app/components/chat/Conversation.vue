<script setup lang="ts">
import type { ChatStatus, UIMessage } from 'ai'
import type { HtmlHTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HtmlHTMLAttributes['class']
  messages?: UIMessage[]
  status?: ChatStatus
}>()

const scrollContainer = useTemplateRef<HTMLDivElement>('scroll-container')

let isUserScrollingUp = false

watch(() => props.messages?.length, () => {
  isUserScrollingUp = false
  nextTick(() => scrollToBottom())
})

watchThrottled(
  () => props.messages,
  () => {
    if (props.status === 'streaming' && !isUserScrollingUp)
      scrollToBottom('auto')
  },
  { deep: true, throttle: 50 },
)

onMounted(() => {
  useEventListener(scrollContainer, 'scroll', () => {
    isUserScrollingUp = !isAtBottom()
  })
})

function isAtBottom() {
  const el = unrefElement(scrollContainer)
  if (!el)
    return true

  return el.scrollHeight - el.scrollTop <= el.clientHeight + 100
}

async function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior,
    })
  }
}
</script>

<template>
  <div ref="scroll-container" :class="cn('flex flex-col size-full overflow-y-auto', $props.class)">
    <slot />
  </div>
</template>
