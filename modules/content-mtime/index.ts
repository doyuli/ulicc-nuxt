import type { FileAfterParseHook } from '@nuxt/content'
import { defineNuxtModule } from 'nuxt/kit'
import Git from 'simple-git'

export default defineNuxtModule({
  meta: {
    name: 'content-mtime',
  },
  setup(_, nuxt) {
    const git = Git()

    nuxt.hook('content:file:afterParse', async (ctx: FileAfterParseHook) => {
      const path = ctx.file.path

      if (!path.includes('posts/'))
        return

      if (path.includes('_template.md'))
        return

      try {
        const log = await git.log({
          file: path,
          maxCount: 1,
          strictDate: true,
        })

        if (log.latest) {
          ctx.content.updatedAt = new Date(log.latest.date)
        }
      }
      catch {
        console.warn(`[content-mtime] Failed to get git log for ${path}`)
      }
    })
  },
})
