<script setup lang="ts">
import { MoveLeft } from 'lucide-vue-next'
</script>

<template>
  <NuxtLink class="group self-start flex items-center gap-2 text-muted-foreground hover:text-secondary-foreground transition-colors cursor-pointer" @click="$router.back()">
    <MoveLeft class="size-4 shrink-0 transform group-hover:-translate-x-1 transition-transform" />
    <span class="text-sm font-medium">
      <slot />
    </span>
  </NuxtLink>
</template>
