import type { EmbeddingModel } from 'ai'
import { embed, embedMany } from 'ai'

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

export async function generateEmbeddings(
  texts: string[],
  model: EmbeddingModel,
) {
  const values = texts.map(t => t.trim().replace(/\s+/g, ' '))
  const { embeddings } = await embedMany({
    model,
    values,
  })

  return embeddings
}
