import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-Hans',
      },
      link: [
        { rel: 'stylesheet', href: 'https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css' },
      ],
    },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    'shadcn-nuxt',
    'nuxt-auth-utils',
  ],
  css: [
    '~/assets/css/main.css',
  ],
  runtimeConfig: {
    aiGatewayApiKey: '',
    siteAccessCode: '',
    siteHostname: '',
    databaseUrl: '',
    siliconflowApiKey: '',
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'material-theme-lighter',
            dark: 'material-theme-palenight',
          },
        },
      },
    },
    experimental: {
      sqliteConnector: 'native',
    },
  },
  contentReadTime: {
    charsPerMinute: 300,
    wordsPerMinute: 180,
    codeLinesPerMinute: 60,
  },
  routeRules: {
    '/': { prerender: true },
    '/robots.txt': { prerender: true },
    '/sitemap.xml': { prerender: true },
  },
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
  colorMode: {
    classPrefix: '',
    preference: 'system',
    fallback: 'light',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-04-03',
})
