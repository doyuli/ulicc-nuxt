<script setup lang="ts">
const { data: posts } = await useAsyncData('posts-all', () => {
  return queryCollection('posts')
    .order('priority', 'DESC')
    .order('date', 'DESC')
    .all()
})
</script>

<template>
  <div class="py-20 text-center">
    <SiteBanner />
  </div>
  <SidebarProvider>
    <PostList :posts="posts" />
  </SidebarProvider>
</template>
