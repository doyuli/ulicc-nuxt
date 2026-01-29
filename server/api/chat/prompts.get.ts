import { prompts } from '~~/server/chat/prompts'

export default defineEventHandler(() => {
  return Object.keys(prompts).map(k => ({
    label: k.charAt(0).toUpperCase() + k.slice(1),
    value: k,
  }))
})
