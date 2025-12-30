<script setup lang="ts">
import { useConfigProviderContext } from '~/components/ConfigProvider.vue'

const { posts } = useConfigProviderContext()

usePageMeta({
  title: '首页',
})
</script>

<template>
  <PageSection>
    <SiteBanner />
    <SidebarProvider>
      <PostList :posts="posts" />
    </SidebarProvider>
  </PageSection>
</template>
