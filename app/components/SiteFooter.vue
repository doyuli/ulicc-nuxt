<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'
import { GithubIcon } from '~/components/icons'
import { cn } from '~/lib/utils'
import { useConfigProviderContext } from './ConfigProvider.vue'

const { global, footer: { copyright: { owner, icp, startYear } } } = useAppConfig()

const { globalTime } = useConfigProviderContext()
</script>

<template>
  <div :class="cn('py-4 flex justify-between text-sm border bg-background', global.appShellClass)">
    <div class="flex gap-4 items-center">
      <div>
        {{ `Copyright © ${startYear}-${globalTime.getFullYear()} By ${owner}` }}
      </div>
      <NuxtLink to="https://beian.miit.gov.cn/" target="_black" class="flex gap-1 items-center px-2 py-1 hover:bg-accent rounded-md">
        <ShieldCheck class="size-4 shrink-0" />
        <span>{{ icp }}</span>
      </NuxtLink>
    </div>
    <div class="flex gap-4 items-center">
      <NuxtLink to="https://nuxt.com/" class="flex gap-1 px-2 py-1 hover:bg-accent rounded-md" target="_black">
        <span class="opacity-70">Powered by</span>
        <span>Nuxt</span>
      </NuxtLink>
      <NuxtLink to="https://github.com/doyuli/ulicc-nuxt" target="_blank" class="flex items-center gap-1 px-2 py-1 hover:bg-accent rounded-md">
        <GithubIcon class="size-4 shrink-0" />
        <span>Source</span>
      </NuxtLink>
    </div>
  </div>
</template>
