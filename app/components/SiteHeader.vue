<script setup lang="ts">
import type { NavMenu } from './SiteNavigation.vue'
import { PencilRuler, SquareChevronRight } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

const { global, site } = useAppConfig()

const headers: NavMenu[] = [
  {
    label: '文库',
    href: '/',
  },
  {
    label: '专栏',
    href: '/',
    children: [
      {
        label: '效率工具',
        href: '/',
        icon: PencilRuler,
      },
      {
        label: '代码片段',
        href: '/',
        icon: SquareChevronRight,
      },
    ],
  },
  {
    label: '友链',
    href: '/',
  },
]

const { y } = useWindowScroll({
  behavior: 'smooth',
})

const headerBgClass = computed(() => {
  return y.value > 50 ? 'bg-background border-b border-border' : 'bg-transparent border-b-0'
})

function scrollTop() {
  y.value = 0
}
</script>

<template>
  <header :class="cn('fixed w-full top-0 left-0 z-1000 h-(--header-height)', headerBgClass)">
    <div :class="cn('grid grid-cols-3 items-center mx-auto size-full', global.appShellClass)">
      <NuxtLink class="font-bold opacity-90" to="/">
        {{ site.title }}
      </NuxtLink>
      <div class="flex items-center justify-center">
        <SiteNavigation :menus="headers" />
      </div>
      <div class="flex gap-4 items-center justify-end">
        <ColorMode />
        <ScrollMode :scroll-y="y" @scroll-top="scrollTop" />
      </div>
    </div>
  </header>
</template>
