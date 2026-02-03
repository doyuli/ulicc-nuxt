<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

const { site: { title, description } } = useAppConfig()

usePageMeta({
  title,
  description,
  titleTemplate: `%s - ${title.toLocaleUpperCase()}`,
})

const isPlayerReady = shallowRef(false)
</script>

<template>
  <ConfigProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ArtPlum />
    <SitePlayer v-show="isPlayerReady" class="left-5 bottom-5" @ready="isPlayerReady = true" />
    <SiteAssistant class="left-5 transition-[bottom] duration-300" :class="isPlayerReady ? ' bottom-18' : 'bottom-5'" />
    <Toaster position="top-center" />
  </ConfigProvider>
</template>
