<script setup lang="ts">
import type { UIMessage } from 'ai'
import type { VariantProps } from 'class-variance-authority'
import type { HtmlHTMLAttributes } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '~/lib/utils'
import { useChatMessageContext } from './Message.vue'

const props = defineProps<{
  role?: UIMessage['role']
  variant?: ContentVariants['variant']
  class?: HtmlHTMLAttributes['class']
}>()

const { chatRole } = useChatMessageContext()

const finalRole = computed(() => props.role ?? chatRole.value)

const contentVariants = cva(
  'flex flex-col gap-2 px-4 py-2 rounded-2xl max-w-[85%] text-pretty',
  {
    variants: {
      variant: {
        default:
          '',
        ghost:
          '',
      },
      role: {
        user:
        'bg-primary-light text-primary-foreground rounded-tr-none',
        system:
        'bg-muted rounded-bl-none',
        assistant:
        'bg-muted rounded-bl-none',
      },
    },
    compoundVariants: [
      {
        variant: 'ghost',
        role: 'system',
        class: 'bg-transparent px-0 py-0 max-w-full border-none shadow-none',
      },
      {
        variant: 'ghost',
        role: 'assistant',
        class: 'bg-transparent px-0 py-0 max-w-full border-none shadow-none',
      },
    ],
    defaultVariants: {
      variant: 'default',
      role: 'user',
    },
  },
)

type ContentVariants = VariantProps<typeof contentVariants>
</script>

<template>
  <div :class="cn(contentVariants({ variant, role: finalRole }), $props.class)">
    <slot />
  </div>
</template>
