<script setup lang="ts">
import type { UIMessage } from 'ai'
import type { HtmlHTMLAttributes } from 'vue'
import { BotIcon, UserIcon } from 'lucide-vue-next'
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
  <Avatar :class="cn('size-8 shrink-0', $props.class)">
    <AvatarFallback>
      <UserIcon v-if="finalRole === 'user'" class="size-4 text-muted-foreground" />
      <BotIcon v-else class="size-4 text-primary" />
    </AvatarFallback>
  </Avatar>
</template>
