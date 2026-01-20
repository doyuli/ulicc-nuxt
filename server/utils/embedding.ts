import type { EmbeddingModel } from 'ai'
import { embed } from 'ai'

export async function generateEmbedding(
  text: string,
  model: EmbeddingModel,
) {
  const value = text.trim().replace(/\s+/g, ' ')
  const { embedding } = await embed({
    model,
    value,
  })

  return embedding
}
