<script setup lang="ts">
import { GithubIcon, MailIcon } from 'lucide-vue-next'

const { dailyMessage } = useDailyGreeting()
const { author } = useAppConfig()
</script>

<template>
  <div data-slot="author-card" class="flex flex-col items-center p-4 w-full min-h-16 bg-primary rounded-md">
    <Button variant="light-primary-hover" class="h-7 px-3 text-xs rounded-full ">
      {{ dailyMessage }}
    </Button>
    <Avatar class="mt-8 mb-10 size-[140px] border-2 border-white">
      <AvatarImage src="/avatar.jpg" alt="@doyuli" />
      <AvatarFallback class="animate-pulse">
        Doyuli
      </AvatarFallback>
    </Avatar>
    <div class="flex justify-between items-center w-full">
      <div class="flex flex-col gap-1 text-white">
        <div class="text-xl font-bold">
          {{ author.name }}
        </div>
        <div class="text-xs opacity-60">
          {{ author.description }}
        </div>
      </div>
      <div class="flex gap-3">
        <Button as-child variant="light-primary-hover" size="icon-lg" class="rounded-full">
          <NuxtLink :to="author.github" target="_blank">
            <GithubIcon class="size-5 shrink-0" />
          </NuxtLink>
        </Button>
        <Button as-child variant="light-primary-hover" size="icon-lg" class="rounded-full">
          <NuxtLink :to="`mailto:${author.email}`" target="_blank">
            <MailIcon class="size-5 shrink-0" />
          </NuxtLink>
        </Button>
      </div>
    </div>
  </div>
</template>
