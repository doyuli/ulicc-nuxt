<script setup lang="ts">
const { placeholder = 'Say something...' } = defineProps<{
  placeholder?: string
  disabled?: boolean
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
  <form @submit="onSubmit">
    <InputGroup>
      <InputGroupTextarea
        v-model="modelValue"
        :disabled="disabled"
        :placeholder="placeholder"
        @keydown.enter.exact.prevent="submit"
      />
      <InputGroupAddon align="block-end">
        <slot />
      </InputGroupAddon>
    </InputGroup>
  </form>
</template>
