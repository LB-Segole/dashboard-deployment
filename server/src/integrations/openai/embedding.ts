import { getOpenAIClient } from './client'
import { query } from '@/config/database'

export async function createEmbedding(
  text: string,
  model = 'text-embedding-ada-002'
) {
  const openai = getOpenAIClient()

  try {
    const startTime = Date.now()
    const response = await openai.embeddings.create({
      model,
      input: text,
    })

    // Log usage
    await query(
      `INSERT INTO openai_usage 
       (model, prompt_tokens, total_tokens, duration_ms)
       VALUES ($1, $2, $3, $4)`,
      [
        model,
        response.usage.prompt_tokens,
        response.usage.total_tokens,
        Date.now() - startTime,
      ]
    )

    return response.data[0]?.embedding
  } catch (error) {
    console.error('OpenAI embedding error:', error)
    throw new Error('Failed to create embedding')
  }
}

export async function createBatchEmbeddings(
  texts: string[],
  model = 'text-embedding-ada-002'
) {
  const openai = getOpenAIClient()

  try {
    const startTime = Date.now()
    const response = await openai.embeddings.create({
      model,
      input: texts,
    })

    // Log usage
    await query(
      `INSERT INTO openai_usage 
       (model, prompt_tokens, total_tokens, duration_ms)
       VALUES ($1, $2, $3, $4)`,
      [
        model,
        response.usage.prompt_tokens,
        response.usage.total_tokens,
        Date.now() - startTime,
      ]
    )

    return response.data.map((item) => item.embedding)
  } catch (error) {
    console.error('OpenAI batch embedding error:', error)
    throw new Error('Failed to create batch embeddings')
  }
}