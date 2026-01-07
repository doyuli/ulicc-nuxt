<script setup lang="ts">
import type { ToolUIPart } from 'ai'
import type { Component, HtmlHTMLAttributes } from 'vue'
import { CheckCircleIcon, ChevronDownIcon, ClockIcon, LoaderCircleIcon, WrenchIcon, XCircleIcon } from 'lucide-vue-next'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = defineProps<{
  part: ToolUIPart
  state: ToolUIPart['state']
  class?: HtmlHTMLAttributes['class']
}>()

const STATE_CONFIG: Record<ToolUIPart['state'], { label: string, class: string, icon: Component }> = {
  'input-streaming': {
    label: 'Pending',
    class: 'text-muted-foreground animate-spin',
    icon: LoaderCircleIcon,
  },
  'input-available': {
    label: 'Running',
    class: 'text-primary animate-pulse',
    icon: ClockIcon,
  },
  'approval-requested': {
    label: 'Awaiting Approval',
    class: 'text-yellow-600',
    icon: ClockIcon,
  },
  'approval-responded': {
    label: 'Responded',
    class: 'text-blue-600',
    icon: CheckCircleIcon,
  },
  'output-available': {
    label: 'Completed',
    class: 'text-green-600',
    icon: CheckCircleIcon,
  },
  'output-error': {
    label: 'Error',
    class: 'text-red-600',
    icon: XCircleIcon,
  },
  'output-denied': {
    label: 'Denied',
    class: 'text-orange-600',
    icon: XCircleIcon,
  },
}
const currentStatus = shallowRef(STATE_CONFIG['input-streaming'])

watch(() => props.state, (state) => {
  currentStatus.value = STATE_CONFIG[state]
})

const isOpen = shallowRef(false)
</script>

<template>
  <CollapsibleRoot v-model:open="isOpen" :class="cn('flex flex-col gap-2 w-full', $props.class)">
    <CollapsibleTrigger class="flex items-center gap-4 justify-between text-xs font-mono text-muted-foreground border-l-2 pl-2">
      <div class="flex items-center gap-2">
        <WrenchIcon class="size-3" />
        <span>Tool: {{ part.type }}</span>
        <Badge class="gap-1.5 rounded-full text-xs" variant="secondary">
          <component :is="currentStatus.icon" :class="currentStatus.class" />
          <span>{{ currentStatus.label }}</span>
        </Badge>
      </div>
      <ChevronDownIcon :class="cn('size-3 transition-transform', isOpen && 'rotate-180')" />
    </CollapsibleTrigger>
    <CollapsibleContent>
      <pre class="max-h-48 overflow-y-scroll rounded-lg bg-secondary p-3 text-xs">{{ JSON.stringify(part, null, 2) }}</pre>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
