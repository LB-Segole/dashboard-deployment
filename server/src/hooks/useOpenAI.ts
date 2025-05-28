import OpenAI from 'openai';
import { config } from '../config';

let openaiClient: OpenAI | null = null;

export function useOpenAI() {
  const getClient = (): OpenAI => {
    if (!openaiClient) {
      openaiClient = new OpenAI({
        apiKey: config.openai.apiKey,
      });
    }
    return openaiClient;
  };

  const generateResponse = async (params: {
    prompt: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }) => {
    const client = getClient();
    try {
      const completion = await client.chat.completions.create({
        model: params.model || config.openai.model,
        messages: [{ role: 'user', content: params.prompt }],
        temperature: params.temperature ?? config.openai.temperature,
        max_tokens: params.maxTokens || config.openai.maxTokens,
      });
      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      throw new Error(`Failed to generate OpenAI response: ${error}`);
    }
  };

  const generateEmbedding = async (text: string) => {
    const client = getClient();
    try {
      const response = await client.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      throw new Error(`Failed to generate embedding: ${error}`);
    }
  };

  const moderateContent = async (text: string) => {
    const client = getClient();
    try {
      const response = await client.moderations.create({
        input: text,
      });
      return response.results[0];
    } catch (error) {
      throw new Error(`Failed to moderate content: ${error}`);
    }
  };

  return {
    getClient,
    generateResponse,
    generateEmbedding,
    moderateContent,
  };
} 