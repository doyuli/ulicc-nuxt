<script setup lang="ts">
import { cn } from '~/lib/utils'

usePageMeta({
  title: '项目',
})

const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').first()
})

const StatusColorMap = {
  online: 'bg-emerald-500',
  developing: 'bg-amber-500',
  offline: 'bg-rose-500',
}
</script>

<template>
  <PageSection>
    <PageTitle title="我的项目" description="个人业余项目展示" />
    <ItemGroup class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Item v-for="(link, i) in projects?.links" :key="i" class="bg-background shadow-(--card-shadow) hover:bg-background! hover:border-primary-light animate-fade-up">
        <ItemHeader>
          <div class="flex items-center gap-2">
            <span v-if="link.status" class="relative flex size-2">
              <span :class="cn('animate-ping absolute inline-flex size-full rounded-full opacity-75', StatusColorMap[link.status])" />
              <span :class="cn('relative inline-flex rounded-full size-2', StatusColorMap[link.status])" />
            </span>
            <span class="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{{ link.type === 'webapp' ? link.status : 'LIBRARY' }}</span>
          </div>
          <span class="text-[10px] text-gray-400 font-medium tracking-wide">
            贡献者
          </span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle class="text-lg font-bold text-gray-900 ">
            {{ link.name }}
          </ItemTitle>
          <ItemDescription class="text-gray-500 text-xs leading-relaxed">
            {{ link.description }}
          </ItemDescription>
          <div v-if="link.metrics?.length" class="mt-2">
            <div v-for="(metric, j) in link.metrics" :key="`${i} -${j}`" class="grid grid-cols-3 gap-0 rounded-md border border-zinc-100 bg-zinc-50/50 p-1">
              <div class="flex flex-col items-center py-2 px-1 hover:bg-white rounded-lg transition-colors">
                <span class="text-[9px] text-zinc-400 font-bold uppercase tracking-tight">{{ metric.name }}</span>
                <span class="text-[12px] font-mono font-bold text-zinc-800">{{ metric.value }}</span>
              </div>
            </div>
          </div>
        </ItemContent>
        <ItemFooter>
          <div class="flex gap-2">
            <span v-for="stack in link.stack" :key="stack" class="text-[9px] font-bold tracking-tight text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded">
              {{ stack }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <a v-if="link.href" :href="link.href" class="text-[10px] font-bold text-black border-b border-black/10 hover:border-black transition-all">Web</a>
            <a v-if="link.github" :href="link.github" class="text-[10px] font-bold text-gray-300 hover:text-black transition-all">GitHub</a>
          </div>
        </ItemFooter>
      </Item>
    </ItemGroup>
  </PageSection>
</template>
