import type { FileAfterParseHook } from '@nuxt/content'
import { execSync } from 'node:child_process'
import { defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'content-mtime',
  },
  setup(_, nuxt) {
    nuxt.hook('content:file:afterParse', async (ctx: FileAfterParseHook) => {
      const path = ctx.file.path

      if (!path.includes('posts/'))
        return

      if (path.includes('_template.md'))
        return

      try {
        const date = execSync(
          `git log -1 --format=%cI -- "${path}"`,
          { encoding: 'utf-8', cwd: nuxt.options.rootDir },
        ).trim()

        if (date) {
          ctx.content.updatedAt = new Date(date)
        }
      }
      catch {
        // File might not be tracked
      }
    })
  },
})
