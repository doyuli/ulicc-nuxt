<script setup lang="ts">
const { id } = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h1)))
</script>

<template>
  <h1 :id="$props.id" class="font-heading mt-2 scroll-m-28 text-3xl font-bold tracking-tight">
    <a v-if="$props.id && generate" :href="`#${$props.id}`">
      <slot />
    </a>
    <slot v-else />
  </h1>
</template>
