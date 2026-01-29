<script lang="ts">
import type { UIMessage } from 'ai'
import type { HtmlHTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

interface ChatMessageContext {
  chatRole: ComputedRef<UIMessage['role']>
}

const [useChatMessageContext, provideChatMessageContext] = createContext<ChatMessageContext>('ChatMessage')

export {
  useChatMessageContext,
}
</script>

<script setup lang="ts">
const props = defineProps<{
  role: UIMessage['role']
  class?: HtmlHTMLAttributes['class']
}>()

provideChatMessageContext({
  chatRole: computed(() => props.role),
})
</script>

<template>
  <div :class="cn('w-full flex gap-2', role === 'user' ? 'flex-row-reverse' : 'flex-row', $props.class)">
    <slot />
  </div>
</template>
