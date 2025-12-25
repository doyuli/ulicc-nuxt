<script setup lang="ts">
import { useConfigProviderContext } from '~/components/ConfigProvider.vue'

const { tools } = useConfigProviderContext()

usePageMeta({
  title: '效率工具',
})
</script>

<template>
  <PageTitle title="效率工具" description="开发生产力" />
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
        class="group flex-nowrap bg-background shadow-(--card-shadow) hover:bg-primary-light! animate-fade-up"
        :style="{ animationDelay: `${0.2 + i * 0.1}s` }"
      >
        <NuxtLink :to="link.href" target="_blank" rel="noopener noreferrer">
          <ItemMedia class="size-15 self-center! group-hover:size-0 group-hover:opacity-0 group-hover:-mr-4 transition-all duration-600">
            <Avatar class="size-full">
              <AvatarImage :src="link.image" :alt="link.name" />
              <AvatarFallback class="animate-pulse">
                {{ link.name.slice(0, 2).toLocaleUpperCase() }}
              </AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle class="text-base md:text-lg group-hover:text-white">
              {{ link.name }}
            </ItemTitle>
            <ItemDescription class="group-hover:text-white">
              {{ link.description }}
            </ItemDescription>
          </ItemContent>
        </NuxtLink>
      </Item>
    </ItemGroup>
  </div>
</template>
