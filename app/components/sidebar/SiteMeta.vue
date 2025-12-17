<script setup lang="ts">
import { Calendar, FileTextIcon, HashIcon, SquareKanban } from 'lucide-vue-next'
import { useConfigProviderContext } from '~/components/ConfigProvider.vue'
import { msToDaysCeil } from '~/utils/date'

const { posts } = useConfigProviderContext()
const { site } = useAppConfig()

const siteMeta = computed(() => {
  const tags = [...new Set(posts.value?.map(post => post.tags ?? []).flat())]

  const since = new Date(site.since).getTime()
  const now = new Date().getTime()
  return [
    {
      label: '文章总数',
      icon: FileTextIcon,
      value: `${posts.value?.length ?? 0} 篇`,
    },
    {
      label: '标签总数',
      icon: HashIcon,
      value: `${tags.length} 个`,
    },
    {
      label: '建站天数',
      icon: Calendar,
      value: `${msToDaysCeil(Math.max(0, now - since))} 天`,
    },
  ]
})
</script>

<template>
  <Card>
    <CardHeader class="flex items-center gap-1 text-secondary-foreground">
      <SquareKanban class="size-4 shrink-0" />
      <span>站点数据</span>
    </CardHeader>
    <CardContent class="flex flex-col gap-2 text-md">
      <div v-for="(meta, i) in siteMeta" :key="i" class="flex items-center justify-between opacity-70">
        <div class="flex items-center gap-1">
          <component :is="meta.icon" class="size-4 shrink-0" />
          <span>{{ meta.label }}</span>
        </div>
        <div>{{ meta.value }}</div>
      </div>
    </CardContent>
  </Card>
</template>
