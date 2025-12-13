<script setup lang="ts">
import { CalendarIcon, ClockIcon, HashIcon } from 'lucide-vue-next'
import { dateFormatter } from '~/utils/formatter'

const route = useRoute()

const { data: post } = await useAsyncData(`post-${route.path}`, () => {
  return queryCollection('posts').path(route.path).first()
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <div class="mb-8">
    <div v-if="post?.tags?.length" class="flex flex-wrap items-center gap-2 mb-6">
      <Button
        v-for="tag in post.tags"
        :key="tag"
        size="sm"
        variant="secondary"
        class="h-7 px-2.5 text-xs"
        as-child
      >
        <NuxtLink :to="`/tags/${encodeURIComponent(tag)}`" prefetch>
          <HashIcon class="size-3" />
          {{ tag }}
        </NuxtLink>
      </Button>
    </div>
    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
      {{ post?.title }}
    </h1>
    <div class="flex items-center gap-4 text-sm text-muted-foreground">
      <div class="flex items-center gap-1">
        <CalendarIcon class="size-4 shrink-0" />
        <span>{{ dateFormatter.custom(new Date(post!.date), { dateStyle: 'long' }) }}</span>
      </div>
      <div v-if="post?.minRead" class="flex items-center gap-1">
        <ClockIcon class="size-4 shrink-0" />
        <span>{{ post.minRead }} min read</span>
      </div>
    </div>
  </div>
  <Card class="animate-fade-up delay-200">
    <CardContent>
      <ContentRenderer v-if="post" :value="post" />
    </CardContent>
  </Card>
</template>
