<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <Item variant="outline" class="p-6 bg-background">
    <ItemContent>
      <ItemTitle class="text-3xl font-bold">
        {{ title }}
      </ItemTitle>
      <ItemDescription v-if="description">
        {{ description }}
      </ItemDescription>
    </ItemContent>
    <ItemActions>
      <slot name="action" />
    </ItemActions>
  </Item>
</template>
