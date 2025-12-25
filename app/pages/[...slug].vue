<script setup lang="ts">
import { ContentToc } from '~/components/sidebar'

const route = useRoute()

const { data: post } = await useAsyncData(`post-${route.path}`, () => {
  return queryCollection('posts').path(route.path).first()
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <BackAction class="mt-4 mb-12">
    Back to posts
  </BackAction>
  <PostMeta class="mt-8 mb-12" :post="post!" />
  <SidebarProvider>
    <template #sidebar-sticky-header>
      <ContentToc :links="post?.body.toc?.links" />
    </template>
    <Card class="py-8 animate-fade-up delay-200">
      <CardContent class="px-6">
        <ContentRenderer v-if="post" :value="post" />
      </CardContent>
    </Card>
  </SidebarProvider>
</template>
