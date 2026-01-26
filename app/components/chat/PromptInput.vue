<script lang="ts">
import type { HtmlHTMLAttributes } from 'vue'
import type { InputGroupVariants } from '~/components/ui/input-group'
import { cn } from '~/lib/utils'

interface PromptInputContetx {
  submit: (e: Event) => void
}

const [usePromptInputContext, providePromptInputContext] = createContext<PromptInputContetx>('PromptInput')

export {
  usePromptInputContext,
}
</script>

<script setup lang="ts">
defineProps<{
  class?: HtmlHTMLAttributes['class']
  align?: InputGroupVariants['align']
}>()

const emit = defineEmits<{
  (e: 'submit', event: Event): void
}>()

const submit = (e: Event) => emit('submit', e)

providePromptInputContext({
  submit,
})
</script>

<template>
  <form :class="cn('w-full', $props.class)" @submit.prevent="submit">
    <InputGroup>
      <slot />
      <InputGroupAddon :align="align">
        <slot name="addon" />
      </InputGroupAddon>
    </InputGroup>
  </form>
</template>
