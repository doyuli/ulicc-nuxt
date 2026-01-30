<script setup lang="ts">
import { HTTP_STATUS } from '~~/shared/constants'

const route = useRoute()

const { data: snippet } = await useAsyncData(`snippet-${route.path}`, () => {
  return queryCollection('snippets').path(route.path).first()
})

usePageMeta({
  title: snippet.value?.title,
  description: snippet.value?.description,
})

if (!snippet.value) {
  throw createError({ statusCode: HTTP_STATUS.NOT_FOUND, statusMessage: 'Snippet not found', fatal: true })
}
</script>

<template>
  <PageSection>
    <BackAction>
      Back to snippets
    </BackAction>
    <SidebarProvider>
      <Card class="py-8 animate-fade-up delay-200">
        <CardHeader v-if="snippet" class="px-6">
          <CardTitle class="text-3xl font-bold">
            {{ snippet.title }}
          </CardTitle>
          <CardDescription>
            {{ snippet.description }}
          </CardDescription>
        </CardHeader>
        <CardContent class="px-6">
          <ContentRenderer v-if="snippet" :value="snippet" />
        </CardContent>
      </Card>
    </SidebarProvider>
  </PageSection>
</template>
