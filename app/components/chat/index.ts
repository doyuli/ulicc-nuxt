import type { ToolUIPart } from 'ai'

export { default as ChatMarkdownRenderer } from './ChatMarkdownRenderer.vue'
export { default as ChatTool } from './ChatTool.vue'
export { default as Conversation } from './Conversation.vue'
export { default as ConversationContent } from './ConversationContent.vue'
export { default as ConversationSubmitted } from './ConversationSubmitted.vue'
export { default as Message } from './Message.vue'
export { default as MessageAvatar } from './MessageAvatar.vue'
export { default as MessageContent } from './MessageContent.vue'
export { default as PromptInput } from './PromptInput.vue'
export { default as PromptSubmit } from './PromptSubmit.vue'

export const isTool = (part: any): part is ToolUIPart => part.type.startsWith('tool-')
