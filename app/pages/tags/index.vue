<script setup lang="ts">
import { ArrowRightIcon } from 'lucide-vue-next'
import { useConfigProviderContext } from '~/components/ConfigProvider.vue'

const { tags } = useConfigProviderContext()
</script>

<template>
  <header class="mt-24 mb-12 text-center">
    <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
      标签索引
    </h1>
    <p class="mt-4 text-muted-foreground">
      目前共计 {{ Object.keys(tags).length }} 个分类标签
    </p>
  </header>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <Card
      v-for="(postList, tagName) in tags"
      :key="tagName"
      class="group relative gap-2"
    >
      <CardHeader>
        <NuxtLink :to="`/tags/${encodeURIComponent(tagName)}`" class="flex items-center justify-between">
          <div class="space-y-1">
            <h2 class="text-xl font-semibold group-hover:text-primary transition-colors">
              {{ tagName }}
            </h2>
            <p class="text-xs text-muted-foreground">
              {{ postList.length }} 篇文章
            </p>
          </div>
          <div class="size-8 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:-translate-x-3 transition-all">
            <ArrowRightIcon class="size-4 text-primary" />
          </div>
        </NuxtLink>
      </CardHeader>
      <CardContent>
        <ul class="space-y-2 border-t pt-4">
          <li v-for="post in postList.slice(0, 2)" :key="post.id" class="line-clamp-1">
            <NuxtLink :to="post.path" class="text-xs text-muted-foreground hover:text-primary">
              • {{ post.title }}
            </NuxtLink>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>
