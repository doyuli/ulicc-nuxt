<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

const { site: { title, description } } = useAppConfig()

usePageMeta({
  title,
  description,
  titleTemplate: `%s - ${title.toLocaleUpperCase()}`,
})
</script>

<template>
  <ConfigProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ArtPlum />
    <SitePlayer class="left-5 bottom-5" />
    <SiteAssistant class="left-5 bottom-18" />
    <Toaster position="top-center" />
  </ConfigProvider>
</template>
