<script setup lang="ts">
import type { PostsCollectionItem } from '@nuxt/content'
import { useConfigProviderContext } from '~/components/ConfigProvider.vue'

const { posts } = useConfigProviderContext()

const archive = computed(() => {
  const result: Record<string, PostsCollectionItem[]> = {}

  posts.value?.forEach((post) => {
    const date = new Date(post.date)
    const year = date.getFullYear()
    if (!result[year])
      result[year] = []

    result[year].push(post)
  })

  return result
})

const sortedYears = computed(() =>
  Object.keys(archive.value).sort((a, b) => Number(b) - Number(a)),
)

usePageMeta({
  title: '文章归档',
})
</script>

<template>
  <PageSection>
    <SidebarProvider>
      <Card class="py-8 animate-fade-up delay-200">
        <CardHeader class="flex">
          <h1 class="text-3xl font-bold">
            文章
          </h1>
          <sup class="mt-2 text-base text-muted-foreground font-bold">{{ posts?.length ?? 0 }}</sup>
        </CardHeader>
        <CardContent class="px-6">
          <section v-for="(year) in sortedYears" :key="year" class="mb-4 ">
            <h4 class="mb-2 flex items-center gap-2 text-xl">
              <span class="w-1 h-4 bg-primary-light rounded-md" />
              <span>{{ year }}</span>
            </h4>
            <PostList :posts="archive[year]" variant="simple" />
          </section>
        </CardContent>
      </Card>
    </SidebarProvider>
  </PageSection>
</template>
