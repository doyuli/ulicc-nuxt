export default defineAppConfig({
  global: {
    /**
     * Shared class applied to app shell containers (header, main, footer)
     * Used to keep global horizontal spacing consistent
     */
    appShellClass: 'px-4 sm:px-8 w-full max-w-[1400px]',
  },
  site: {
    title: 'Doyuli',
    description: 'Doyuli\'s Blog',
    since: '2024-09-13',
  },
  author: {
    name: '阿沥',
    description: '分享技术与生活',
    github: 'https://github.com/doyuli',
    email: 'doyulicc@gmail.com',
  },
  content: {
    summary: true,
  },
  footer: {
    copyright: {
      icp: '粤ICP备2022120906号',
      startYear: 2022,
      owner: '阿沥',
    },
  },
})
