import antfu from '@antfu/eslint-config'

export default antfu(
  {
    pnpm: false,
    formatters: true,
  },
  {
    files: ['content/**/*.md'],
    rules: {
      'no-irregular-whitespace': 'off',
    },
  },
)
