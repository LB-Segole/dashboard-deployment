import { getOpenAIClient } from './client'
import { query } from '@/config/database'

export async function createChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  model = 'gpt-4-1106-preview',
  options = {}
) {
  const openai = getOpenAIClient()

  try {
    const startTime = Date.now()
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      ...options,
    })

    // Log usage
    await query(
      `INSERT INTO openai_usage 
       (model, prompt_tokens, completion_tokens, total_tokens, duration_ms)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        model,
        response.usage?.prompt_tokens,
        response.usage?.completion_tokens,
        response.usage?.total_tokens,
        Date.now() - startTime,
      ]
    )

    return response.choices[0]?.message?.content
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate completion')
  }
}

export async function createStreamingChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  model = 'gpt-4-1106-preview',
  options = {}
) {
  const openai = getOpenAIClient()

  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
      ...options,
    })

    return response
  } catch (error) {
    console.error('OpenAI streaming error:', error)
    throw new Error('Failed to create streaming completion')
  }
}