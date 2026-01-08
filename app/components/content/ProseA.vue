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
    class="group relative inline-flex font-medium text-primary px-0.5"
  >
    <span class="absolute left-0 right-0 bottom-0 h-px group-hover:h-full group-hover:opacity-15 group-hover:-left-0.5 group-hover:-right-0.5 rounded-sm bg-primary transition-all duration-300" />
    <slot />
  </NuxtLink>
</template>
