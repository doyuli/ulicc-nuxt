<script setup lang="ts">
import type { PostsCollectionItem } from '@nuxt/content'
import { CalendarIcon, ClockIcon, HashIcon } from 'lucide-vue-next'
import { dateFormatter } from '~/utils/formatter'

defineProps<{
  post: PostsCollectionItem
}>()
</script>

<template>
  <div>
    <div v-if="post?.tags?.length" class="flex flex-wrap items-center gap-2 mb-4">
      <Button
        v-for="tag in post.tags"
        :key="tag"
        size="sm"
        variant="secondary"
        class="h-7 px-2.5 text-xs bg-primary/5 text-primary hover:bg-primary/10"
        as-child
      >
        <NuxtLink :to="`/tags/${encodeURIComponent(tag)}`" prefetch>
          <HashIcon class="size-3" />
          {{ tag }}
        </NuxtLink>
      </Button>
    </div>
    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-4 opacity-90">
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
</template>
