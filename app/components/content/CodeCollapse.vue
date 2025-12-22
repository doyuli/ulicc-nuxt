<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

const { openText = '展开', closeText = '收起' } = defineProps<{
  openText?: string
  closeText?: string
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <div :class="cn('relative [&_pre]:h-[200px]', open ? '[&_pre]:h-auto [&_pre]:min-h-[200px] [&_pre]:max-h-[80vh] [&_pre]:pb-12' : '[&_pre]:overflow-hidden')">
    <slot />

    <div :class="cn('h-16 absolute inset-x-px bottom-px rounded-b-md flex items-center justify-center', !open && 'bg-linear-to-t from-muted')">
      <Button
        variant="outline"
        :data-state="open ? 'open' : 'closed'"
        class="group"
        @click="open = !open"
      >
        <ChevronDownIcon class="size-4 shrink-0 group-data-[state=open]:rotate-180" />
        <span>{{ open ? closeText : openText }}</span>
      </Button>
    </div>
  </div>
</template>
