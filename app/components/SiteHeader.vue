<script setup lang="ts">
import { navigation } from '~/constants/navigation'
import { cn } from '~/lib/utils'

const { global, site } = useAppConfig()

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
  <header :class="cn('fixed w-full top-0 left-0 z-10 h-(--header-height)', headerBgClass)">
    <div :class="cn('grid grid-cols-3 items-center mx-auto size-full', global.appShellClass)">
      <NuxtLink class="font-bold opacity-90" to="/">
        {{ site.title }}
      </NuxtLink>
      <div class="flex items-center justify-center">
        <SiteNavigation :menus="navigation" />
      </div>
      <div class="flex gap-4 items-center justify-end">
        <SearchMode />
        <ColorMode />
        <ScrollMode :scroll-y="y" @scroll-top="scrollTop" />
      </div>
    </div>
  </header>
</template>
