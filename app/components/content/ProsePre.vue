<script setup lang="ts">
import { Copy, CopyCheck } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
})

const { copy, copied } = useClipboard()
</script>

<template>
  <div :class="cn('relative my-5 group', filename && '[&>pre]:rounded-t-none [&>pre]:my-0 my-5')">
    <div v-if="filename" class="flex items-center gap-1.5 border border-muted bg-default border-b-0 relative rounded-t-md px-4 py-3">
      <Button
        class="size-4 shrink-0"
        variant="outline"
        size="icon"
        aria-label="Javascript"
        tabindex="-1"
      >
        Js
      </Button>
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
      <component :is="copied ? CopyCheck : Copy" />
    </Button>

    <pre :class="cn('group font-mono text-sm/6 border border-muted bg-muted rounded-md px-4 py-3 whitespace-pre-wrap break-words overflow-x-auto focus:outline-none', $props.class)" v-bind="$attrs"><slot /></pre>
  </div>
</template>

<style>
.shiki span.line {
  display: block;
}

.shiki span.line.highlight {
  margin: 0 -16px;
  padding: 0 16px;
}
</style>
