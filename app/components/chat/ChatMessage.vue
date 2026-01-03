<script setup lang="ts">
import type { UIMessage } from 'ai'
import { Bot, User, Wrench } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

defineProps <{
  message: UIMessage
}>()
</script>

<template>
  <div :class="cn('flex w-full gap-4 py-4 px-2 transition-colors hover:bg-muted/30', message.role === 'user' ? 'flex-row-reverse' : 'flex-row')">
    <div class="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border bg-background shadow-sm">
      <User v-if="message.role === 'user'" class="size-4" />
      <Bot v-else class="size-4 text-primary" />
    </div>

    <div class="flex flex-col gap-2 max-w-[85%]">
      <div
        :class="cn('prose prose-sm dark:prose-invert', message.role === 'user'
          ? 'bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-none'
          : 'text-foreground')"
      >
        <div v-for="(part, index) in message.parts" :key="index">
          <template v-if="part.type === 'text'">
            {{ part.text }}
          </template>
          <div v-if="part.type.startsWith('tool-')" class="my-2 flex flex-col gap-2">
            <div class="flex items-center gap-2 text-xs font-mono text-muted-foreground border-l-2 pl-2">
              <Wrench class="size-3" />
              <span>Tool: {{ part.type }}</span>
            </div>
            <pre class="overflow-x-auto rounded-lg bg-secondary p-3 text-xs">{{ JSON.stringify(part, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
