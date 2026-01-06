<script setup lang="ts">
import type { ToolUIPart, UIMessage } from 'ai'
import { BotIcon, UserIcon } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import { ChatMarkdownRenderer, ChatTool } from '.'

defineProps <{
  message: UIMessage
}>()
</script>

<template>
  <div :class="cn('w-full flex gap-4 py-2 transition-colors', message.role === 'user' ? 'flex-row-reverse' : 'flex-row')">
    <Avatar class="size-8 shrink-0">
      <AvatarFallback>
        <UserIcon v-if="message.role === 'user'" class="size-4 text-muted-foreground" />
        <BotIcon v-else class="size-4 text-primary" />
      </AvatarFallback>
    </Avatar>

    <div :class="cn('flex flex-col gap-2 max-w-[78%] text-pretty', message.role === 'user' ? 'bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-none' : 'text-foreground')">
      <slot v-bind="message">
        <template v-for="(part, i) in message.parts" :key="i">
          <template v-if="part.type === 'text'">
            <template v-if="message.role === 'user'">
              {{ part.text }}
            </template>
            <ChatMarkdownRenderer v-else :value="part.text" :cache-key="`${message.id}-${i}`" />
          </template>
          <ChatTool v-else-if="part.type.startsWith('tool-')" :part="(part as ToolUIPart)" :state="(part as ToolUIPart).state" />
        </template>
      </slot>
    </div>
  </div>
</template>
