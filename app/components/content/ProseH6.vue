<script setup lang="ts">
const { id } = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc

const generate = computed(() => id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h6)))
</script>

<template>
  <h6 :id="$props.id" class="mt-8 scroll-m-28 text-base font-medium tracking-tight">
    <a v-if="$props.id && generate" :href="`#${$props.id}`">
      <slot />
    </a>
    <slot v-else />
  </h6>
</template>
