<script setup lang="ts">
import { navigation } from '~/constants/navigation'
import { cn } from '~/lib/utils'

const { global, site } = useAppConfig()

const { y, directions, isScrolling } = useWindowScroll({
  behavior: 'smooth',
})

const isScrollingDown = shallowRef(false)

watchEffect(() => {
  if (!isScrolling.value)
    return

  if (directions.bottom)
    isScrollingDown.value = true
  else
    isScrollingDown.value = false
})

const headerBgClass = computed(() => {
  return y.value > 50 ? 'bg-background/30 backdrop-blur-sm border-b border-border/50' : 'bg-transparent border-b-0'
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
      <div :class="cn('relative size-full flex items-center justify-center', isScrolling && 'overflow-hidden')">
        <div
          :class="cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-500',
            isScrollingDown ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0',
          )"
        >
          <SiteNavigation :menus="navigation" />
        </div>

        <div
          :class="cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-500',
            isScrollingDown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none',
          )"
        >
          <span class="truncate whitespace-nowrap font-medium text-sm">
            {{ site.description }}
          </span>
        </div>
      </div>
      <div class="flex gap-4 items-center justify-end">
        <SearchMode />
        <ColorMode />
        <ScrollMode :scroll-y="y" @scroll-top="scrollTop" />
      </div>
    </div>
  </header>
</template>
