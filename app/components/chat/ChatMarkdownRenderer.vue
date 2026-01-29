<script setup lang="ts">
import { ChatProseComponents } from './prose'

defineProps<{
  cacheKey: string
  value: string
}>()
</script>

<template>
  <MDCCached
    :value="value"
    :cache-key="cacheKey"
    :components="ChatProseComponents"
    :parser-options="{ highlight: false }"
  />
</template>
