<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import ImageComponent from '#build/mdc-image-component.mjs'
import { joinURL, withLeadingSlash, withTrailingSlash } from 'ufo'
import { cn } from '~/lib/utils'

const props = defineProps<{
  src: string
  alt: string
  width?: string | number
  height?: string | number
  class?: HtmlHTMLAttributes['class']
}>()

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
    if (_base !== '/' && !props.src.startsWith(_base)) {
      return joinURL(_base, props.src)
    }
  }
  return props.src
})

const target = useTemplateRef('image-component')
useMediumZoom(target)
</script>

<template>
  <component
    :is="ImageComponent"
    ref="image-component"
    :src="refinedSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :class="cn('rounded-md w-full', $props.class)"
  />
</template>
