<script setup lang="ts">
import type { ChatStatus } from 'ai'
import { CornerDownLeftIcon, RotateCcwIcon, SquareIcon } from 'lucide-vue-next'

const { status = 'ready' } = defineProps<{
  status?: ChatStatus
}>()

const emit = defineEmits<{
  (e: 'stop'): void
  (e: 'reload'): void
}>()

const icon = computed(() => {
  if (status === 'submitted' || status === 'streaming')
    return SquareIcon
  else if (status === 'error')
    return RotateCcwIcon
  else
    return CornerDownLeftIcon
})

function onClick() {
  if (status === 'submitted' || status === 'streaming')
    emit('stop')
  else if (status === 'error')
    emit('reload')
}
</script>

<template>
  <InputGroupButton
    variant="default"
    class="ml-auto rounded-full"
    size="icon-xs"
    :type="status === 'ready' ? 'submit' : undefined"
    @click="onClick"
  >
    <component :is="icon" class="size-4 shrink-0" />
  </InputGroupButton>
</template>
