<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import { ShikiCachedRenderer } from 'shiki-stream/vue'

const props = defineProps<{
  code: string
  language: string
  class?: HtmlHTMLAttributes['class']
  meta?: string
}>()

const colorMode = useColorMode()
const highlighter = await useHighlighter()

const langMap: Record<string, string> = {
  vue: 'vue',
  javascript: 'js',
  typescript: 'ts',
  css: 'css',
}

const lang = computed(() => langMap[props.language] ?? props.language)

const key = computed(() => `${lang.value}-${colorMode.value}`)

const theme = computed(() => colorMode.value === 'dark' ? 'material-theme-palenight' : 'material-theme-lighter')

const trimmedCode = computed(() => props.code.trim().replace(/`+$/, ''))
</script>

<template>
  <ProsePre v-bind="props">
    <ShikiCachedRenderer
      :key="key"
      :highlighter="highlighter"
      :code="trimmedCode"
      :lang="lang"
      :theme="theme"
    />
  </ProsePre>
</template>
