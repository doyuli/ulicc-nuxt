<script setup lang="ts">
import { MailIcon } from 'lucide-vue-next'
import { GithubIcon } from '~/components/icons'

const route = useRoute()

const { data: about } = await useAsyncData('about', () => {
  return queryCollection('about').path(route.path).first()
})

const { author } = useAppConfig()

if (!about.value) {
  throw createError({ statusCode: 404, statusMessage: 'About not found', fatal: true })
}
</script>

<template>
  <div class="px-6 py-16 animate-fade-up delay-200">
    <section class="mb-8 py-8 flex flex-col md:flex-row items-center gap-8">
      <Avatar class="size-[150px] border-2 border-white">
        <AvatarImage src="/avatar.jpg" alt="@doyuli" />
        <AvatarFallback class="animate-pulse">
          Doyuli
        </AvatarFallback>
      </Avatar>
      <div class="flex-1 text-center md:text-left">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {{ about?.title }}
        </h1>
        <p class="text-muted-foreground text-lg italic">
          "The best way to predict the future is to invent it."
        </p>
      </div>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div class="md:col-span-2 prose prose-zinc dark:prose-invert max-w-none">
        <ContentRenderer v-if="about" :value="about" />
      </div>

      <aside class="space-y-8">
        <div class="p-6 rounded-2xl bg-accent/30 border border-border/50">
          <h3 class="font-bold mb-4 flex items-center gap-2">
            <span class="size-2 bg-primary rounded-full" />
            <span>活跃领域</span>
          </h3>
          <div class="flex flex-wrap gap-2">
            <Badge v-for="stack in about?.currentStacks" :key="stack" variant="outline" class="h-7 text-xs bg-background">
              {{ stack }}
            </Badge>
          </div>
        </div>

        <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <h3 class="font-bold mb-4">
            📫 保持联系
          </h3>
          <div class="space-y-3">
            <NuxtLink :to="author.github" target="_blank" class="flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <GithubIcon class="size-4 shrink-0" />
              <span>GitHub</span>
            </NuxtLink>
            <NuxtLink :to="`mailto:${author.email}`" target="_blank" class="flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <MailIcon class="size-4 shrink-0" />
              <span>Email</span>
            </NuxtLink>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
