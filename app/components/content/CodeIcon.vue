<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { EXTENSION_ICONS } from '~/constants/icons'

const props = defineProps<{
  icon?: string
  filename: string
}>()

const icon = computed(() => {
  if (props.icon)
    return props.icon

  const cleanFilename = props.filename.replace(/\s*\(.*\)\s*$/, '')

  const extension = cleanFilename.includes('.') && cleanFilename.split('.').pop()
  const name = cleanFilename.split('/').pop()

  return (name && EXTENSION_ICONS[name.toLowerCase()]) ?? (extension && (EXTENSION_ICONS[extension] ?? `vscode-icons:file-type-${extension}`))
})
</script>

<template>
  <Icon v-if="icon" class="size-4 shrink-0" :icon="icon" />
</template>
