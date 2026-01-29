export default defineCachedEventHandler(
  async (event) => {
    const hostname = useRuntimeConfig().siteHostname
    if (!hostname)
      throw new Error('Missing Site Hostname')

    setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

    const robots = [
      'User-agent: *',
      '',
      'Allow: /',
      '',
      'Disallow: /admin/',
      '',
      `Sitemap: ${hostname}/sitemap.xml`,
    ]

    return robots.join('\n')
  },
  {
    maxAge: 60 * 60,
    name: 'robots-cache',
  },
)
