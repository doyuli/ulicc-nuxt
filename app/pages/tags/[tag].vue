<script setup lang="ts">
import { ArrowLeftIcon } from 'lucide-vue-next'
import { useConfigProviderContext } from '~/components/ConfigProvider.vue'

const route = useRoute()
const tagName = route.params.tag as string

const { tags } = useConfigProviderContext()

const posts = computed(() => tags.value[decodeURIComponent(tagName)] ?? [])
</script>

<template>
  <div class="mt-24 mb-12 flex flex-col items-center">
    <div class="inline-flex items-center gap-3">
      <h1 class="text-4xl font-bold tracking-tight">
        {{ tagName }}
      </h1>
      <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        {{ posts.length }} 篇
      </span>
    </div>
  </div>
  <Button variant="outline" class="mb-4 group relative w-20 text-accent-foreground" @click="$router.back()">
    <ArrowLeftIcon class="size-4 transition-transform duration-300 group-hover:-translate-x-3" />
    <span class="absolute left-1/2 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
      返回
    </span>
  </Button>
  <SidebarProvider>
    <PostList :posts="posts" />
  </SidebarProvider>
</template>
