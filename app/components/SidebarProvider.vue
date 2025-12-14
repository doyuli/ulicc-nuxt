<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('flex w-full', $props.class)" style="--sidebar-width: 300px">
    <div class="w-[calc(100%-var(--sidebar-width))] max-lg:w-full transition-[width] duration-300">
      <slot />
    </div>
    <SiteSidebar class="w-(--sidebar-width) max-lg:hidden">
      <template v-if="$slots['sidebar-content']" #default>
        <slot name="sidebar-content" />
      </template>
      <template v-if="$slots['sidebar-sticky-header']" #sticky-header>
        <slot name="sidebar-sticky-header" />
      </template>
      <template v-if="$slots['sidebar-sticky-footer']" #sticky-footer>
        <slot name="sidebar-sticky-footer" />
      </template>
    </SiteSidebar>
  </div>
</template>
