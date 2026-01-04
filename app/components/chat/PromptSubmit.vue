<script setup lang="ts">
import type { ChatStatus } from 'ai'
import { CornerDownLeftIcon, RotateCcwIcon, SquareIcon } from 'lucide-vue-next'

const { status = 'ready' } = defineProps<{
  status?: ChatStatus
}>()

const emit = defineEmits<{
  (e: 'stop', event: Event): void
  (e: 'reload', event: Event): void
}>()

const icon = computed(() => {
  if (status === 'submitted' || status === 'streaming')
    return SquareIcon
  else if (status === 'error')
    return RotateCcwIcon
  else
    return CornerDownLeftIcon
})

function onClick(e: Event) {
  if (status === 'submitted' || status === 'streaming') {
    emit('stop', e)
  }
  else if (status === 'error') {
    emit('reload', e)
  }
}
</script>

<template>
  <InputGroupButton
    variant="default"
    class="ml-auto rounded-full"
    size="icon-xs"
    :type="status === 'ready' ? 'submit' : 'button'"
    @click="onClick"
  >
    <component :is="icon" class="size-4 shrink-0" />
  </InputGroupButton>
</template>
