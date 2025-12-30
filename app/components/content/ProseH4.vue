<script setup lang="ts">
const { id } = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc

const generate = computed(() => id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h4)))
</script>

<template>
  <h4 :id="$props.id" class="scroll-m-20 mt-6 mb-2 text-lg font-semibold tracking-tight">
    <a v-if="$props.id && generate" :href="`#${$props.id}`">
      <slot />
    </a>
    <slot v-else />
  </h4>
</template>
