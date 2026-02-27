<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import { ArrowUpIcon } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

const props = defineProps<{
  scrollY: number
  class?: HtmlHTMLAttributes['class']
}>()

const emits = defineEmits(['scrollTop'])

const scrollPercent = computed(() => {
  if (import.meta.server)
    return 0

  const scrollHeight = document.documentElement.scrollHeight
  const windowHeight = window.innerHeight

  const maxScroll = scrollHeight - windowHeight

  if (maxScroll <= 0)
    return 0

  const percent = (props.scrollY / maxScroll) * 100

  return Math.round(Math.max(0, Math.min(100, percent)))
})

function scrollTop() {
  emits('scrollTop')
}
</script>

<template>
  <div>
    <Transition
      enter-from-class="opacity-0 scale-0 w-0"
      enter-active-class="transition-all duration-300"
      leave-to-class="opacity-0 scale-0 w-0"
      leave-active-class="transition-all duration-300"
    >
      <Button
        v-if="scrollPercent"
        :class="cn('rounded-full group text-white', $props.class)"
        size="icon"
        aria-label="Scroll to top"
        title="Scroll to top"
        @click="scrollTop"
      >
        <ArrowUpIcon class="hidden group-hover:block" />
        <span class="block group-hover:hidden text-xs">{{ scrollPercent }}</span>
      </Button>
    </Transition>
  </div>
</template>
