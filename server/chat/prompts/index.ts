import { NEKO_SYSTEM_PROMPT } from './neko'
import { BLOG_ASSISTANT_PROMPT } from './system'

const prompts = {
  system: BLOG_ASSISTANT_PROMPT,
  neko: NEKO_SYSTEM_PROMPT,
}

export type PromptsKey = keyof typeof prompts

export {
  prompts,
}
