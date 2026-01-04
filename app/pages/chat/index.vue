<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'
import { BotIcon, TrashIcon } from 'lucide-vue-next'
import { ChatPanel, PromptInput, PromptSubmit } from '~/components/chat'

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
})

const inputText = shallowRef('')

function onSubmit() {
  chat.sendMessage({ text: inputText.value })

  inputText.value = ''
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
      <CardHeader class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="flex items-center justify-center size-7 bg-primary text-white rounded-md">
            <BotIcon class="size-4 shrink-0" />
          </div>
          站点助手
        </div>
        <Button v-if="chat.status === 'error'" variant="ghost" size="icon-sm" @click="chat.clearError()">
          <TrashIcon class="text-muted-foreground size-4 shrink-0" />
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
          <PromptSubmit :status="chat.status" @reload="chat.regenerate()" @stop="chat.stop()" />
        </PromptInput>
      </CardFooter>
    </Card>
  </PageSection>
</template>
