import { queryCollection } from '@nuxt/content/server'
import { SitemapStream, streamToPromise } from 'sitemap'

export default defineCachedEventHandler(
  async (event) => {
    const hostname = useRuntimeConfig().siteHostname
    if (!hostname)
      throw new Error('Missing Site Hostname')

    setHeader(event, 'Content-Type', 'application/xml')

    const stream = new SitemapStream({ hostname })

    const staticRoutes = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/archive', changefreq: 'weekly', priority: 0.8 },
      { url: '/tags', changefreq: 'weekly', priority: 0.8 },
      { url: '/tools', changefreq: 'weekly', priority: 0.6 },
      { url: '/snippets', changefreq: 'weekly', priority: 0.6 },
      { url: '/about', changefreq: 'monthly', priority: 0.3 },
    ]

    for (const route of staticRoutes) {
      stream.write(route)
    }

    const posts = await queryCollection(event, 'posts')
      .where('hidden', '<>', true)
      .order('date', 'DESC')
      .select('path')
      .all()

    for (const post of posts) {
      stream.write({ url: post.path, changefreq: 'weekly', priority: 0.7 })
    }

    stream.end()

    const sitemap = await streamToPromise(stream)

    return sitemap.toString()
  },
  {
    maxAge: 60 * 60,
    name: 'sitemap-cache',
  },
)
