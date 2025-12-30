<script setup lang="ts">
const { id } = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h1)))
</script>

<template>
  <h1 :id="$props.id" class="scroll-m-20 text-3xl pb-2 border-b font-extrabold tracking-tight text-balance">
    <a v-if="$props.id && generate" :href="`#${$props.id}`">
      <slot />
    </a>
    <slot v-else />
  </h1>
</template>
