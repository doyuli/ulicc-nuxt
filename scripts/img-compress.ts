import fs from 'node:fs/promises'
import sharp from 'sharp'

const MAX_SIZE = 1440

export async function processImage(inputPath: string, outputPath: string) {
  const buffer = await fs.readFile(inputPath)

  let pipeline = sharp(buffer)

  const { format, width, height } = await pipeline.metadata()

  if (format !== 'jpeg' && format !== 'png' && format !== 'webp')
    throw new Error(`Unsupported format ${format} of ${inputPath}`)

  if (!format || !width || !height)
    throw new Error(`Could not determine metadata of ${inputPath}`)

  if (width > MAX_SIZE || height > MAX_SIZE)
    pipeline = pipeline.resize(MAX_SIZE)

  pipeline = pipeline[format]({
    quality: format === 'png' ? 100 : 80,
    compressionLevel: 9,
  })

  const outputBuffer = await pipeline.withMetadata().toBuffer()

  const size = buffer.byteLength
  const outputSize = outputBuffer.byteLength
  const percent = (outputSize - size) / size

  return {
    pipeline,
    outputBuffer,
    size,
    outputSize,
    percent,
    inputPath,
    outputPath,
  }
}

export async function batchCompress(files: string[]) {
  return Promise.all(files.map(async (file) => {
    const { percent, size, outputSize, inputPath, outputPath, outputBuffer } = await processImage(file, file)

    const ratioText = `${(percent * 100).toFixed(1).padStart(6, ' ')}%`
    const diffText = `${bytesToHuman(size).padStart(7)} -> ${bytesToHuman(outputSize).padEnd(7)}`

    const isEfficient = percent <= -0.10

    if (isEfficient)
      await fs.writeFile(outputPath, outputBuffer)

    const type = isEfficient ? 'comp' : 'skip'
    return {
      type,
      message: `[${type.toLocaleUpperCase()}] ${diffText} ${ratioText}  ${inputPath}`,
    }
  }))
}

function bytesToHuman(size: number) {
  if (!size)
    return '0 B'.padStart(10, ' ')

  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / 1024 ** i).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`.padStart(10, ' ')
}
