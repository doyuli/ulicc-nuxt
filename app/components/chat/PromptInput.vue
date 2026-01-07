<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const { placeholder = 'Say something...' } = defineProps<{
  placeholder?: string
  disabled?: boolean
  class?: HtmlHTMLAttributes['class']
}>()

const emit = defineEmits<{
  (e: 'submit', event: Event): void
}>()

const modelValue = defineModel<string>('modelValue', { default: '' })

function submit(e: Event) {
  const text = modelValue.value.trim()
  if (!text)
    return

  emit('submit', e)
}
</script>

<template>
  <form :class="cn('w-full', $props.class)" @submit.prevent="submit">
    <InputGroup>
      <InputGroupTextarea
        v-model="modelValue"
        :disabled="disabled"
        :placeholder="placeholder"
        @keydown.enter.exact.prevent="submit"
      />
      <InputGroupAddon align="inline-end">
        <slot />
      </InputGroupAddon>
    </InputGroup>
  </form>
</template>
