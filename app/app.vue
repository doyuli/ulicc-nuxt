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
    <Toaster position="top-center" />
  </ConfigProvider>
</template>
