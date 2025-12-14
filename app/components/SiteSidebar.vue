<script setup lang="ts">
import { Author, SiteMeta, TagPanel, TimeCapsule } from './sidebar'
</script>

<template>
  <div data-slot="sidebar" class="pl-4 flex flex-col gap-4 animate-fade-up delay-200">
    <Author />
    <slot />
    <div class="flex flex-col gap-4 sticky top-[calc(var(--header-height)+1rem)]">
      <slot name="sticky-header" />
      <TimeCapsule />
      <TagPanel />
      <SiteMeta />
      <slot name="sticky-footer" />
    </div>
  </div>
</template>
