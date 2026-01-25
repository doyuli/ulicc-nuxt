<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HtmlHTMLAttributes['class']
  behavior?: ScrollBehavior
}>()

const scrollContainer = useTemplateRef<HTMLDivElement>('scroll-container')
const scrollContent = useTemplateRef<HTMLDivElement>('scroll-content')

let isUserScrollingUp = false
const { y: scrollY, arrivedState, isScrolling } = useScroll(scrollContainer)

watch(scrollY, (ny, oy) => {
  if (!isScrolling.value)
    return

  if (arrivedState.bottom) {
    isUserScrollingUp = false
  }
  else if (ny < oy) {
    isUserScrollingUp = true
  }
})

let prevHeight: number
useResizeObserver(scrollContent, ([entry]) => {
  if (!entry)
    return

  const { height } = entry.contentRect
  const diff = height - (prevHeight ?? height)

  if (diff >= 0 && !isUserScrollingUp) {
    scrollToBottom(props.behavior)
  }
  else {
    if (arrivedState.bottom || scrollY.value === 0) {
      isUserScrollingUp = false
    }
  }
  prevHeight = height
})

function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
  const el = unrefElement(scrollContainer)
  if (el) {
    el.scrollTo({
      top: el.scrollHeight,
      behavior,
    })
  }
}
</script>

<template>
  <div ref="scroll-container" :class="cn('flex flex-col size-full overflow-y-auto', $props.class)">
    <div ref="scroll-content">
      <slot />
    </div>
  </div>
</template>
