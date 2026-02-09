<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex gap-4 py-4 items-center justify-between">
    <div class="space-y-1">
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        {{ title }}
      </h1>
      <p v-if="description" class="text-base md:text-lg text-muted-foreground">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.action" class="flex shrink-0 items-center gap-2">
      <slot name="action" />
    </div>
  </div>
</template>
