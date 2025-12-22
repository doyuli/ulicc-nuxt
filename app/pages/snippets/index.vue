<script setup lang="ts">
const { data: snippets } = await useAsyncData('all-snippets', () => {
  return queryCollection('snippets')
    .order('priority', 'DESC')
    .all()
})
</script>

<template>
  <Card class="mt-24 mb-12">
    <CardContent class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold">
        代码片段
      </h1>
      <span class="text-sm text-muted-foreground">记录一些常用的代码片段</span>
    </CardContent>
  </Card>
  <SidebarProvider>
    <ItemGroup class="gap-4">
      <Item
        v-for="(snippet, i) in snippets"
        :key="snippet.id"
        variant="outline"
        as-child
        role="listitem"
        class="bg-background shadow-(--card-shadow) animate-fade-up"
        :style="{ animationDelay: `${0.2 + i * 0.1}s` }"
      >
        <NuxtLink :to="snippet.path">
          <ItemContent>
            <ItemTitle class="text-lg">
              {{ snippet.title }}
            </ItemTitle>
            <ItemDescription>
              {{ snippet.description }}
            </ItemDescription>
          </ItemContent>
        </NuxtLink>
      </Item>
    </ItemGroup>
  </SidebarProvider>
</template>
