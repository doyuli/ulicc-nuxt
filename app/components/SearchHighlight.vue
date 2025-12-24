<script setup lang="ts">
import { useCommand } from './ui/command'

const { text } = defineProps<{
  text: string
}>()

const { filterState } = useCommand()

const PREFIX_OFFSET = 3
</script>

<template>
  <HighlightText :text="text" :search="filterState.search" :prefix-offset="PREFIX_OFFSET" />
</template>
