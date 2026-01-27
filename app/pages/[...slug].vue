<script setup lang="ts">
import { ContentToc } from '~/components/sidebar'

const route = useRoute()
const { content } = useAppConfig()

const { data: post } = await useAsyncData(`post-${route.path}`, () => {
  return queryCollection('posts').path(route.path).first()
})

usePageMeta({
  title: post.value?.title,
  description: post.value?.description,
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <PageSection>
    <BackAction>
      Back to page
    </BackAction>
    <PostMeta :post="post!" />
    <SidebarProvider>
      <template #sidebar-sticky-header>
        <ContentToc :links="post?.body.toc?.links" />
      </template>
      <Card class="py-8 animate-fade-up delay-200">
        <CardContent class="px-6">
          <Robot
            v-if="post?.description || content.summary"
            class="mb-4 md:mb-6"
            :summary-enable="content.summary"
            :description="post?.description"
            :path="route.path"
          />
          <ContentRenderer v-if="post" :value="post" />
        </CardContent>
      </Card>
    </SidebarProvider>
  </PageSection>
</template>
