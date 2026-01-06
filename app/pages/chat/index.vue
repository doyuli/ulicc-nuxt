<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'
import { Trash2Icon } from 'lucide-vue-next'
import { ChatPanel, PromptInput, PromptSubmit } from '~/components/chat'

definePageMeta({
  middleware: 'auth',
})

usePageMeta({
  title: '站点助手',
})

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
})

const inputText = shallowRef('')
const disabled = computed(() => !inputText.value.trim() && chat.status === 'ready')

function onSubmit() {
  if (disabled.value)
    return

  chat.sendMessage({ text: inputText.value })

  inputText.value = ''
}

function clearMessages() {
  chat.messages = []
}

const suggestions = [
  '帮我构思一篇关于 2026 年前端发展的博客大纲',
  '如何写出吸引人的博客标题？',
  '帮我润色一段关于‘极简主义’的文字',
  '介绍一下最近流行的人工智能技术',
]
</script>

<template>
  <PageSection class="max-w-3xl mx-auto w-full">
    <Card class="rounded-2xl">
      <CardHeader class="flex items-center justify-between border-b">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <Avatar class="size-8 ">
              <AvatarFallback class="text-primary-foreground uppercase text-xs font-bold bg-primary-light">
                AI
              </AvatarFallback>
            </Avatar>
            <div class="absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-500 border-2 border-primary-foreground rounded-full" />
          </div>
          <div>
            <h2 class="text-sm font-bold tracking-tight">
              SiteAssistant
            </h2>
            <p class="text-[10px] text-muted-foreground/70 uppercase tracking-tighter">
              ONLINE
            </p>
          </div>
        </div>
        <Button v-if="chat.messages.length" variant="ghost" size="icon-sm" @click="clearMessages">
          <Trash2Icon class="text-muted-foreground/60 size-4 shrink-0" />
        </Button>
      </CardHeader>
      <CardContent>
        <ChatPanel
          :suggestions="suggestions"
          class="h-[calc(100vh-400px)]"
          :messages="chat.messages"
          :status="chat.status"
          @suggest="(text) => chat.sendMessage({ text })"
        />
      </CardContent>
      <CardFooter>
        <PromptInput v-model="inputText" @submit="onSubmit">
          <PromptSubmit :status="chat.status" :disabled="disabled" @reload="chat.regenerate()" @stop="chat.stop()" />
        </PromptInput>
      </CardFooter>
    </Card>
  </PageSection>
</template>
