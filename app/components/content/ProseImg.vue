<script setup lang="ts">
import ImageComponent from '#build/mdc-image-component.mjs'
import { joinURL, withLeadingSlash, withTrailingSlash } from 'ufo'

const props = defineProps<{
  src: string
  alt: string
  width?: string | number
  height?: string | number
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
</script>

<template>
  <component
    :is="ImageComponent"
    :src="refinedSrc"
    :alt="alt"
    :width="width"
    :height="height"
    class="rounded-md w-full"
  />
</template>
