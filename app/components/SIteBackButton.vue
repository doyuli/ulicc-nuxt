<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import { ArrowLeftIcon } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

defineProps<{
  class?: HtmlHTMLAttributes['class']
}>()
</script>

<template>
  <Button variant="outline" :class="cn('group relative w-20 text-accent-foreground', $props.class)" @click="$router.back()">
    <ArrowLeftIcon class="size-4 transition-transform duration-300 group-hover:-translate-x-3" />
    <span class="absolute left-1/2 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
      返回
    </span>
  </Button>
</template>
