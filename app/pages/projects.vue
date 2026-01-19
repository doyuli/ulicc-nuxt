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
    <PageTitle title="我的项目" :description="projects?.description" />
    <ItemGroup class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Item
        v-for="(link, i) in projects?.links"
        :key="i"
        as-child
        variant="outline"
        class="group relative gap-5 bg-background shadow-(--card-shadow) hover:bg-background! hover:-translate-y-1 overflow-hidden transition-all! duration-500 animate-fade-up"
        :style="{ animationDelay: `${0.2 + i * 0.1}s` }"
      >
        <NuxtLink :to="link.href" target="_blank">
          <div class="absolute -right-2 -top-4 text-9xl font-black text-muted-foreground/5 italic pointer-events-none select-none group-hover:text-muted-foreground/10 transition-colors duration-500">
            {{ (i + 1).toString().padStart(2, '0') }}
          </div>
          <ItemHeader class="z-1">
            <div class="flex items-center gap-2">
              <span v-if="link.status" class="relative flex size-1.5">
                <span :class="cn('group-hover:animate-ping absolute inline-flex size-full rounded-full opacity-75', StatusColorMap[link.status])" />
                <span :class="cn('relative inline-flex rounded-full size-1.5', StatusColorMap[link.status])" />
              </span>
              <span class="text-[10px] font-bold uppercase tracking-widest text-secondary-foreground/50">{{ link.status }}</span>
            </div>
            <span class="text-[10px] text-secondary-foreground/50 uppercase font-medium tracking-wide bg-muted/50 p-1 rounded">
              {{ link.type }}
            </span>
          </ItemHeader>
          <ItemContent class="z-1">
            <ItemTitle class="text-lg font-bold text-secondary-foreground">
              {{ link.name }}
            </ItemTitle>
            <ItemDescription class="text-xs leading-relaxed text-wrap">
              {{ link.description }}
            </ItemDescription>
            <div v-if="link.metrics?.length" class="mt-4 grid grid-cols-3 gap-0 p-1 rounded-md border border-border/70 bg-muted/50">
              <div v-for="(metric, j) in link.metrics" :key="`${i} -${j}`" class="flex flex-col items-center py-2 px-1 rounded-md">
                <span class="text-[9px] text-secondary-foreground/40 font-bold uppercase tracking-tight">{{ metric.name }}</span>
                <span class="text-[12px] font-mono font-bold text-secondary-foreground/80">{{ metric.value }}</span>
              </div>
            </div>
          </ItemContent>
          <ItemFooter class="z-1">
            <div class="flex gap-2">
              <span
                v-for="stack in link.stacks"
                :key="stack"
                class="text-[10px] font-bold tracking-tight text-muted-foreground border px-1.5 py-0.5 rounded"
              >
                {{ stack }}
              </span>
            </div>
          </ItemFooter>
        </NuxtLink>
      </Item>
    </ItemGroup>
  </PageSection>
</template>
