<script setup lang="ts">
import { cn } from '~/lib/utils'

const { global } = useAppConfig()
</script>

<template>
  <div class="flex flex-col items-center min-h-screen">
    <SiteHeader />
    <main :class="cn('flex-1 py-16', global.appShellClass)">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
