<script setup lang="ts">
const { text, search, prefixOffset = 3 } = defineProps<{
  text: string
  search: string
  prefixOffset?: number
}>()

const parts = computed(() => {
  const trimSearch = search.trim()

  if (!trimSearch)
    return [{ text, highlight: false }]

  const lowerText = text.toLowerCase()
  const lowerSearch = trimSearch.toLowerCase()
  const matchIndex = lowerText.indexOf(lowerSearch)

  if (matchIndex === -1)
    return [{ text, highlight: false }]

  let displayText = text
  let hasPrefix = false

  if (matchIndex > prefixOffset) {
    displayText = text.slice(matchIndex - prefixOffset)
    hasPrefix = true
  }

  const safeSearch = trimSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${safeSearch})`, 'gi')
  const splitParts = displayText.split(regex).filter(Boolean).map(part => ({
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
