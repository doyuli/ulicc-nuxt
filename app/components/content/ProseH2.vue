<script setup lang="ts">
const { id } = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc

const generate = computed(() => id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h2)))
</script>

<template>
  <h2 :id="$props.id" class="scroll-m-20 mt-12 mb-6 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
    <a v-if="$props.id && generate" class="group" :href="`#${$props.id}`">
      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
