<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

defineProps<{
  class?: HtmlHTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('flex flex-col gap-4 p-4', $props.class)">
    <slot />
  </div>
</template>
