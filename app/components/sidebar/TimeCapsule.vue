<script setup lang="ts">
import { useConfigProviderContext } from '~/components/ConfigProvider.vue'
import { cn } from '~/lib/utils'

const { globalTime } = useConfigProviderContext()

const { ranges, newYear } = useTimeCapsule(globalTime)
</script>

<template>
  <ClientOnly>
    <Card class="group cursor-default">
      <CardContent class="flex items-center">
        <div class="flex flex-col items-center gap-1">
          <span class="text-sm opacity-70">距离</span>
          <span class="text-lg">{{ newYear?.rangeName }}</span>
          <span class="text-primary text-3xl font-bold">{{ newYear?.daysLeft }}</span>
          <span class="text-xs opacity-40">{{ newYear?.date }}</span>
        </div>
        <Separator orientation="vertical" class="mx-3 w-0.5! h-24!" />
        <div class="flex flex-col flex-1 gap-1">
          <div v-for="(item, i) in ranges" :key="i" class="flex items-center h-6 w-full">
            <div class="mr-2 text-sm whitespace-nowrap opacity-70">
              {{ item.rangeName }}
            </div>
            <div :class="cn('relative size-full flex items-center bg-border rounded-lg overflow-hidden', item.progress > 50 && 'text-white')">
              <div class="size-full bg-primary-light rounded-lg" :style="{ width: `${item.progress}%`, opacity: item.progress / 100 }" />
              <span class="absolute mx-1.5 text-xs transition-all duration-300 group-hover:-translate-x-3 group-hover:opacity-0">{{ item.progress.toFixed(2) }}%</span>
              <span class="absolute mx-1.5 text-xs transition-all duration-300 opacity-0 translate-x-3 group-hover:translate-0 group-hover:opacity-100">{{ item.rangeText }}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </ClientOnly>
</template>
