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
  <div class="flex w-full" style="--sidebar-width: 300px">
    <div class="w-[calc(100%-var(--sidebar-width))] max-lg:w-full transition-[width] duration-300">
      <PostList :posts="posts" />
    </div>
    <SiteSidebar class="w-(--sidebar-width) max-lg:hidden" />
  </div>
</template>
