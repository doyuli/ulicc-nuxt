<script setup lang="ts">
import { HashIcon } from 'lucide-vue-next'
import { useConfigProviderContext } from '~/components/ConfigProvider.vue'

const { posts } = useConfigProviderContext()

const tags = computed(() => {
  const result: Record<string, number> = {}
  posts.value?.forEach((post) => {
    post.tags?.forEach((t) => {
      result[t] = (result[t] ?? 0) + 1
    })
  })
  return result
})
</script>

<template>
  <Card>
    <CardHeader class="flex items-center gap-1 text-secondary-foreground">
      <HashIcon class="size-4 shrink-0" />
      <span>热门标签</span>
    </CardHeader>
    <CardContent>
      <div class="relative flex flex-wrap gap-1 text-sm text-secondary-foreground after:absolute after:bottom-0 after:left-0 after:w-full after:h-[40%] after:max-h-30 after:bg-(image:--mask-background-image)">
        <NuxtLink
          v-for="(count, tag) in tags"
          :key="tag"
          class="inline-block px-2 py-1 hover:bg-accent rounded-md"
          :to="`/tags/${encodeURIComponent(tag)}`"
        >
          <span>{{ tag }}</span>
          <sup class="ml-1 opacity-60">{{ count }}</sup>
        </NuxtLink>
      </div>
      <Button variant="secondary" class="mt-2 w-full border">
        查看全部
      </Button>
    </CardContent>
  </Card>
</template>
