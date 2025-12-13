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
  <div class="mb-12">
    <div v-if="post?.tags?.length" class="flex items-center gap-2">
      <Button v-for="tag in post.tags" :key="tag" size="sm" variant="secondary">
        <HashIcon class="size-3" />
        <span>{{ tag }}</span>
      </Button>
    </div>
    <h1 class="text-4xl my-4 font-bold">
      {{ post?.title }}
    </h1>
    <div class="flex items-center gap-4 text-sm text-muted-foreground">
      <div class="flex items-center gap-1 shrink-0">
        <CalendarIcon class="size-3" />
        <span>{{ dateFormatter.custom(new Date(post!.date), { dateStyle: 'medium' }) }}</span>
      </div>
      <div v-if="post?.minRead" class="flex items-center gap-1 shrink-0">
        <ClockIcon class="size-3" />
        <span>{{ post.minRead }}min</span>
      </div>
    </div>
  </div>
  <Card>
    <CardContent>
      <ContentRenderer
        v-if="post"
        :value="post"
      />
    </CardContent>
  </Card>
</template>
