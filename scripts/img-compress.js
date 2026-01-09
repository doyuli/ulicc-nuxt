// @ts-check
import fs from 'node:fs/promises'
import sharp from 'sharp'

const MAX_SIZE = 1440
const SUPPORTED = ['jpeg', 'png', 'webp']

export async function compressWithSharp(image, inBuffer, inFile, outFile) {
  const { format, width, height } = await image.metadata()

  if (!format || !width || !height)
    throw new Error(`Could not determine metadata of ${inFile}`)

  if (!SUPPORTED.includes(format))
    throw new Error(`Unsupported format ${format} of ${inFile}`)

  if (width > MAX_SIZE || height > MAX_SIZE)
    image = image.resize(MAX_SIZE)

  image = image[format]({
    quality: format === 'png' ? 100 : 80,
    compressionLevel: 9,
  })

  const outBuffer = await image.withMetadata().toBuffer()
  const size = inBuffer.byteLength
  const outSize = outBuffer.byteLength
  const percent = (outSize - size) / size

  return {
    image,
    outBuffer,
    size,
    outSize,
    percent,
    inFile,
    outFile,
  }
}

export async function compressImages(files) {
  return Promise.all(files.map(async (file) => {
    const buffer = await fs.readFile(file)
    const image = sharp(buffer)
    const { percent, size, outSize, inFile, outFile, outBuffer } = await compressWithSharp(image, buffer, file, file)

    const ratioText = `${(percent * 100).toFixed(1).padStart(6, ' ')}%`
    const diffText = `${bytesToHuman(size).padStart(7)} -> ${bytesToHuman(outSize).padEnd(7)}`

    const isEfficient = percent <= -0.10

    if (isEfficient)
      await fs.writeFile(outFile, outBuffer)

    const type = isEfficient ? 'comp' : 'skip'
    return {
      type,
      message: `[${type.toLocaleUpperCase()}] ${diffText} ${ratioText}  ${inFile}`,
    }
  }))
}

function bytesToHuman(size) {
  if (!size)
    return '0 B'.padStart(10, ' ')

  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / 1024 ** i).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`.padStart(10, ' ')
}
