<script setup lang="ts">
import { Copy, CopyCheck } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  meta?: string
  hideHeader?: boolean
}>()

const { copy, copied } = useClipboard()
</script>

<template>
  <div :class="cn('relative my-5 group', filename && '[&>pre]:rounded-t-none [&>pre]:my-0 my-5')">
    <div v-if="filename && !hideHeader" class="flex items-center gap-1.5 border border-muted bg-background border-b-0 relative rounded-t-md px-4 py-3">
      <CodeIcon class="size-4 shrink-0" :filename="filename" />
      <span class="text-default text-sm/6">{{ filename }}</span>
    </div>

    <Button
      class="absolute top-[7px] right-[7px] lg:opacity-0 lg:group-hover:opacity-100 transition"
      variant="outline"
      size="icon"
      aria-label="Copy"
      tabindex="-1"
      @click="copy(code || '')"
    >
      <component :is="copied ? CopyCheck : Copy" class="size-4 shrink-0 text-muted-foreground" />
    </Button>

    <pre class="group font-mono text-sm/6 border border-muted bg-primary-light/3 rounded-md px-4 py-3 whitespace-pre-wrap wrap-break-word overflow-x-auto focus:outline-none" v-bind="$attrs"><slot /></pre>
  </div>
</template>

<style>
.shiki span.line {
  display: block;
}

.shiki span.line.highlight {
  margin: 0 -16px;
  padding: 0 16px;
  background-color: color-mix(in oklab, var(--code-highlight) 50%, transparent);
}
</style>
