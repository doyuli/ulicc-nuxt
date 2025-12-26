<script setup lang="ts">
import { useConfigProviderContext } from '~/components/ConfigProvider.vue'

const { posts } = useConfigProviderContext()

usePageMeta({
  title: '首页',
})
</script>

<template>
  <SiteBanner />
  <SidebarProvider>
    <PostList :posts="posts" />
  </SidebarProvider>
</template>
