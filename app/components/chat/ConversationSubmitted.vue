<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import { Loader2Icon } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

defineProps<{
  class?: HtmlHTMLAttributes['class']
}>()
</script>

<template>
  <p :class="cn('flex items-center gap-2 opacity-50', $props.class)">
    <Loader2Icon class="size-4 animate-spin" />
    <span class="text-xs font-medium">正在思考...</span>
  </p>
</template>
