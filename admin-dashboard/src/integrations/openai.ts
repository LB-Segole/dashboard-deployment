import OpenAI from 'openai';
import { ChatCompletionCreateParams } from 'openai/resources/chat';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAIResponse = async (
  messages: ChatCompletionCreateParams['messages'],
  model: string = 'gpt-4-1106-preview'
) => {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate AI response');
  }
};

export const createEmbedding = async (text: string) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    return response.data[0]?.embedding || [];
  } catch (error) {
    console.error('OpenAI Embedding error:', error);
    throw new Error('Failed to create text embedding');
  }
};