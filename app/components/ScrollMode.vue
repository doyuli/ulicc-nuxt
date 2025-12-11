<script setup lang="ts">
import { ArrowUpIcon } from 'lucide-vue-next'

const props = defineProps<{
  scrollY: number
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
  <Transition
    enter-from-class="opacity-0 scale-75 translate-x-[-10px]"
    enter-active-class="transition-all duration-200 ease-out"
    leave-to-class="opacity-0 scale-75 translate-x-[-10px]"
    leave-active-class="transition-all duration-200 ease-in"
  >
    <Button
      v-if="scrollPercent"
      class="rounded-full group"
      variant="outline"
      size="icon"
      aria-label="Scroll to top"
      @click="scrollTop"
    >
      <ArrowUpIcon class="hidden group-hover:block" />
      <span class="block group-hover:hidden text-xs">{{ scrollPercent }}</span>
    </Button>
  </Transition>
</template>
