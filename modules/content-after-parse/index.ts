import { defineNuxtModule } from 'nuxt/kit'
import { transformContent } from './runtime/transform'

export default defineNuxtModule({
  meta: {
    name: 'content-after-parse',
  },
  setup(_, nuxt) {
    nuxt.hooks.hook('content:file:afterParse', transformContent)
  },
})
