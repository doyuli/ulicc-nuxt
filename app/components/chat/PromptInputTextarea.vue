<script setup lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'
import { usePromptInputContext } from './PromptInput.vue'

const { placeholder = 'Say something...' } = defineProps<{
  placeholder?: string
  disabled?: boolean
  class?: HtmlHTMLAttributes['class']
}>()

const modelValue = defineModel<string>('modelValue', { default: '' })

const { submit } = usePromptInputContext()
</script>

<template>
  <InputGroupTextarea
    v-model="modelValue"
    :class="cn('field-sizing-content', $props.class)"
    :disabled="disabled"
    :placeholder="placeholder"
    @keydown.enter.exact.prevent="submit"
  />
</template>
