<script setup lang="ts">
import type { AsTag } from 'reka-ui'
import type { Component, HtmlHTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '~/lib/utils'

defineProps<{
  as?: AsTag | Component
  class?: HtmlHTMLAttributes['class']
}>()
</script>

<template>
  <Primitive :as="as" :class="cn('pt-8 flex flex-col gap-4 md:gap-8 w-full', $props.class)">
    <slot />
  </Primitive>
</template>
