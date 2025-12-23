<script setup lang="ts">
import { useCommand } from './ui/command'

const { text } = defineProps<{
  text: string
}>()

const { filterState } = useCommand()

const CONTEXT_LIMIT = 3

const parts = computed(() => {
  const search = filterState.search.trim()

  if (!search)
    return [{ text, highlight: false }]

  const lowerText = text.toLowerCase()
  const lowerSearch = search.toLowerCase()
  const matchIndex = lowerText.indexOf(lowerSearch)

  if (matchIndex === -1)
    return [{ text, highlight: false }]

  let displayTitle = text
  let hasPrefix = false

  if (matchIndex > CONTEXT_LIMIT) {
    displayTitle = text.slice(matchIndex - CONTEXT_LIMIT)
    hasPrefix = true
  }

  const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${safeSearch})`, 'gi')
  const splitParts = displayTitle.split(regex).filter(Boolean).map(part => ({
    text: part,
    highlight: part.toLowerCase() === lowerSearch,
  }))

  if (hasPrefix)
    splitParts.unshift({ text: '...', highlight: false })

  return splitParts
})
</script>

<template>
  <span>
    <template v-for="(part, i) in parts" :key="i">
      <mark v-if="part.highlight" class="bg-transparent font-bold text-primary underline underline-offset-2">{{ part.text }}</mark>
      <span v-else>{{ part.text }}</span>
    </template>
  </span>
</template>
