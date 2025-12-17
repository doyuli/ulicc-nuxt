<script setup lang="ts">
import { useConfigProviderContext } from '~/components/ConfigProvider.vue'

const { posts } = useConfigProviderContext()
</script>

<template>
  <div class="py-20 text-lg text-center">
    <SiteBanner />
  </div>
  <SidebarProvider>
    <PostList :posts="posts" />
  </SidebarProvider>
</template>
