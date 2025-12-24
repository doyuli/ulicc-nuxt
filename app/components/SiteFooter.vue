<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'
import { GithubIcon } from '~/components/icons'
import { cn } from '~/lib/utils'
import { useConfigProviderContext } from './ConfigProvider.vue'

const { global, footer: { copyright: { owner, icp, startYear } } } = useAppConfig()

const { globalTime } = useConfigProviderContext()
</script>

<template>
  <footer class="w-full border bg-background">
    <div :class="cn('py-4 flex justify-center md:justify-between text-sm mx-auto size-full', global.appShellClass)">
      <div class="flex flex-col gap-1 sm:flex-row sm:gap-4 items-center">
        <div>
          {{ `Copyright © ${startYear}-${globalTime.getFullYear()} By ${owner}` }}
        </div>
        <NuxtLink to="https://beian.miit.gov.cn/" target="_black" class="flex gap-1 items-center px-2 py-1 hover:bg-accent rounded-md">
          <ShieldCheck class="size-4 shrink-0" />
          <span>{{ icp }}</span>
        </NuxtLink>
      </div>
      <div class="hidden md:flex gap-4 items-center">
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
  </footer>
</template>
