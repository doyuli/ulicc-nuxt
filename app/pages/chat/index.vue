<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'
import { ChatMessage, PromptInput, PromptSubmit } from '~/components/chat'

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
</script>

<template>
  <PageSection class="flex-1 justify-center gap-1!">
    <div class="flex-1 h-full px-4">
      <div class="max-w-4xl mx-auto divide-y divide-border/40">
        <ChatMessage
          v-for="m in chat.messages"
          :key="m.id"
          :message="m"
        />
      </div>
    </div>
    <div class="max-w-4xl mx-auto w-full p-4">
      <PromptInput v-model="inputText" @submit="onSubmit">
        <PromptSubmit :status="chat.status" @reload="chat.regenerate()" @stop="chat.stop()" />
      </PromptInput>
    </div>
  </PageSection>
</template>
