<script setup lang="ts">
const { data: snippets } = await useAsyncData('all-snippets', () => {
  return queryCollection('snippets')
    .order('priority', 'DESC')
    .all()
})

usePageMeta({
  title: '代码片段',
})
</script>

<template>
  <PageTitle title="代码片段" description="记录一些常用的代码片段" />
  <ItemGroup class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <Item
      v-for="(snippet, i) in snippets"
      :key="snippet.id"
      variant="outline"
      as-child
      role="snippet-item"
      class="group bg-background shadow-(--card-shadow) hover:bg-primary-light! animate-fade-up"
      :style="{ animationDelay: `${0.2 + i * 0.1}s` }"
    >
      <NuxtLink :to="snippet.path">
        <ItemContent>
          <ItemTitle class="text-base md:text-lg group-hover:text-white">
            {{ snippet.title }}
          </ItemTitle>
          <ItemDescription class="group-hover:text-white">
            {{ snippet.description }}
          </ItemDescription>
        </ItemContent>
      </NuxtLink>
    </Item>
  </ItemGroup>
</template>
