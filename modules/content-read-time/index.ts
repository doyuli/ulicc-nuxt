import type { TransformOptions } from './runtime/transform'
import { defineNuxtModule } from 'nuxt/kit'
import { transformContent } from './runtime/transform'

export default defineNuxtModule<TransformOptions>({
  meta: {
    name: 'content-read-time',
    configKey: 'contentReadTime',
  },
  defaults: {
    charsPerMinute: 300,
    wordsPerMinute: 180,
    codeLinesPerMinute: 60,
  },
  setup(options, nuxt) {
    nuxt.hook('content:file:afterParse', (ctx) => {
      transformContent(ctx, options)
    })
  },
})
