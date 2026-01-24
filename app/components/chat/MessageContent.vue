<script setup lang="ts">
import type { UIMessage } from 'ai'
import type { HtmlHTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'
import { useChatMessageContext } from './Message.vue'

const props = defineProps<{
  role?: UIMessage['role']
  class?: HtmlHTMLAttributes['class']
}>()

const { chatRole } = useChatMessageContext()

const finalRole = computed(() => props.role ?? chatRole.value)
</script>

<template>
  <div :class="cn('flex flex-col gap-2 max-w-[78%] text-pretty', finalRole === 'user' ? 'bg-primary-light text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-none' : 'text-foreground')">
    <slot />
  </div>
</template>
