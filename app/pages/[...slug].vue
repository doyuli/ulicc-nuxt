<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(`post-${route.path}`, () => {
  return queryCollection('posts').path(route.path).first()
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <PostMeta class="mt-24 mb-12" :post="post!" />
  <SidebarProvider>
    <Card class="py-8 animate-fade-up delay-200">
      <CardContent class="px-6">
        <ContentRenderer v-if="post" :value="post" />
      </CardContent>
    </Card>
  </SidebarProvider>
</template>
