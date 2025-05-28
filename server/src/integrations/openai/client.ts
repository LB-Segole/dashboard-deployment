import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { config } from '@/config';
import { BaseIntegration, IntegrationConfig } from '../base/BaseIntegration';

export class OpenAIIntegration extends BaseIntegration {
  private client: OpenAI;
  private static instance: OpenAIIntegration;

  private constructor() {
    const integrationConfig: IntegrationConfig = {
      retryAttempts: config.openai.retryAttempts,
      retryDelay: 1000,
      timeout: config.openai.timeout,
    };

    super('openai', integrationConfig);

    if (!config.openai.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
      timeout: config.openai.timeout,
      maxRetries: 0, // We handle retries ourselves
    });
  }

  public static getInstance(): OpenAIIntegration {
    if (!OpenAIIntegration.instance) {
      OpenAIIntegration.instance = new OpenAIIntegration();
    }
    return OpenAIIntegration.instance;
  }

  public getClient(): OpenAI {
    return this.client;
  }

  public async createCompletion(params: {
    model?: string;
    messages: ChatCompletionMessageParam[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> {
    return this.executeWithRetry(
      async () => {
        const response = await this.client.chat.completions.create({
          model: params.model || config.openai.model,
          messages: params.messages,
          temperature: params.temperature ?? config.openai.temperature,
          max_tokens: params.maxTokens ?? config.openai.maxTokens,
        });

        return response.choices[0]?.message?.content || '';
      },
      'createCompletion'
    );
  }

  public async createAssistant(params: {
    name: string;
    instructions: string;
    model?: string;
  }): Promise<any> {
    return this.executeWithRetry(
      async () => {
        return await this.client.beta.assistants.create({
          name: params.name,
          instructions: params.instructions,
          model: params.model || config.openai.model,
        });
      },
      'createAssistant'
    );
  }

  public async createThread(): Promise<any> {
    return this.executeWithRetry(
      async () => {
        return await this.client.beta.threads.create();
      },
      'createThread'
    );
  }

  public async runAssistant(params: {
    threadId: string;
    assistantId: string;
    instructions?: string;
  }): Promise<string[]> {
    return this.executeWithRetry(
      async () => {
        const run = await this.client.beta.threads.runs.create(
          params.threadId,
          {
            assistant_id: params.assistantId,
            instructions: params.instructions,
          }
        );

        let retrievedRun = await this.client.beta.threads.runs.retrieve(
          params.threadId,
          run.id
        );

        while (
          retrievedRun.status !== 'completed' &&
          retrievedRun.status !== 'failed'
        ) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          retrievedRun = await this.client.beta.threads.runs.retrieve(
            params.threadId,
            run.id
          );
        }

        if (retrievedRun.status === 'failed') {
          throw new Error('Assistant run failed');
        }

        const messages = await this.client.beta.threads.messages.list(
          params.threadId
        );

        return messages.data
          .filter((m) => m.role === 'assistant')
          .map((m) => {
            const content = m.content[0];
            if (content && 'text' in content) {
              return content.text.value;
            }
            return '';
          })
          .filter(Boolean);
      },
      'runAssistant'
    );
  }
}

export const openai = OpenAIIntegration.getInstance();