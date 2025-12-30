<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '~/lib/utils'

defineProps<{
  type?: 'error' | 'info' | 'success' | 'warning'
  class?: HTMLAttributes['class']
}>()

const tipVariants = cva(
  'my-4 px-5 py-3 bg-card text-card-foreground border border-l-6 shadow-(--card-shadow) rounded-md transition-all leading-8',
  {
    variants: {
      type: {
        error:
          'border-l-red-500 dark:border-l-red-400',
        info:
          'border-l-primary dark:border-l-primary-light',
        success:
         'border-l-emerald-500 dark:border-l-emerald-400',
        warning:
          'border-l-amber-500 dark:border-l-amber-400',
      },
    },
    defaultVariants: {
      type: 'info',
    },
  },
)
</script>

<template>
  <div :class="cn(tipVariants({ type }), $props.class)">
    <slot mdc-unwrap="p" />
  </div>
</template>
