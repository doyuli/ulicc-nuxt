<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'
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
</script>

<template>
  <PageSection class="max-w-3xl mx-auto w-full">
    <ChatPanel :class="chat.messages?.length && 'h-[calc(100vh-380px)]'" :messages="chat.messages" :status="chat.status" />
    <PromptInput v-model="inputText" @submit="onSubmit">
      <PromptSubmit :status="chat.status" @reload="chat.regenerate()" @stop="chat.stop()" />
    </PromptInput>
  </PageSection>
</template>
