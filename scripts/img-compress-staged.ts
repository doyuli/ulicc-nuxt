import process from 'node:process'
import { cancel, confirm, isCancel, spinner } from '@clack/prompts'
import pico from 'picocolors'
import Git from 'simple-git'
import { batchCompress } from './img-compress.ts'

async function main() {
  const git = Git()
  const stagedFiles = (await git.diff(['--cached', '--name-only']))
    .split('\n')
    .map(i => i.trim())
    .filter(Boolean)

  const images = stagedFiles.filter(i => i.match(/\.(png|jpe?g|webp)$/i))

  if (images.length > 0) {
    console.log('Images to compress:\n', images)

    const shouldCompress = await confirm({
      message: `Compress ${pico.cyan(images.length)} images in staged area?`,
      initialValue: true,
    })

    if (isCancel(shouldCompress) || !shouldCompress) {
      cancel('Optimization skipped.')
      process.exit(0)
    }

    const s = spinner()
    s.start('Optimizing images...')

    const result = await batchCompress(images)

    s.stop('Optimization finished')

    console.log()

    for (const { type, message } of result)
      type === 'skip' ? console.log(pico.dim(message)) : console.log(pico.green(message))

    console.log()
  }
  else {
    console.log('No images found in staged area')
    process.exit(0)
  }
}

main().catch(console.error)
