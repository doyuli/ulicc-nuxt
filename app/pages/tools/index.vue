<script setup lang="ts">
const { data: tools } = await useAsyncData('all-tools', () => {
  return queryCollection('tools')
    .order('priority', 'DESC')
    .all()
})
</script>

<template>
  <Card class="mt-24 mb-12">
    <CardContent class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold">
        效率工具
      </h1>
      <span class="text-sm text-muted-foreground">开发生产力</span>
    </CardContent>
  </Card>
  <div v-for="tool in tools" :key="tool.id" class="my-8">
    <div class="mb-4 flex flex-col gap-2">
      <h2 class="text-2xl font-bold">
        {{ `${tool.title} (${tool.links.length})` }}
      </h2>
      <span class="text-sm text-muted-foreground">{{ tool.description }}</span>
    </div>
    <ItemGroup class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Item
        v-for="(link, i) in tool.links"
        :key="link.name"
        variant="outline"
        as-child
        role="tool-item"
        class="bg-background shadow-(--card-shadow) animate-fade-up"
        :style="{ animationDelay: `${0.2 + i * 0.1}s` }"
      >
        <NuxtLink class="flex items-center" :to="link.href" target="_blank" rel="noopener noreferrer">
          <ItemMedia>
            <Avatar class="size-15">
              <AvatarImage :src="link.image" :alt="link.name" />
              <AvatarFallback class="animate-pulse">
                {{ link.name.slice(0, 2) }}
              </AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{{ link.name }}</ItemTitle>
            <ItemDescription>{{ link.description }}</ItemDescription>
          </ItemContent>
        </NuxtLink>
      </Item>
    </ItemGroup>
  </div>
</template>
