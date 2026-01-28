<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    href?: string
    target?: '_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined
  }>(),
  {
    href: '',
  },
)

const EXTERNAL_RE = /^https?:\/\//i

const finalTarget = computed(() => {
  if (props.target !== undefined)
    return props.target

  return EXTERNAL_RE.test(props.href) ? '_blank' : undefined
})
</script>

<template>
  <NuxtLink
    :href="props.href"
    :target="finalTarget"
    class="inline-flex items-center gap-1 font-medium text-primary/90 underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
  >
    <slot />
  </NuxtLink>
</template>
