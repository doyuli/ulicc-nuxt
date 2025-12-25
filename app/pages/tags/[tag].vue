<script setup lang="ts">
import { useConfigProviderContext } from '~/components/ConfigProvider.vue'

const route = useRoute()
const tagName = route.params.tag as string

const { tags } = useConfigProviderContext()

const posts = computed(() => tags.value[decodeURIComponent(tagName)] ?? [])
</script>

<template>
  <BackAction class="mt-4 mb-12">
    Back to page
  </BackAction>
  <div class="mt-8 mb-12 flex flex-col items-center">
    <div class="inline-flex items-center gap-3">
      <h1 class="text-4xl font-bold tracking-tight">
        {{ tagName }}
      </h1>
      <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        {{ posts.length }} 篇
      </span>
    </div>
  </div>
  <SidebarProvider>
    <PostList :posts="posts" />
  </SidebarProvider>
</template>
