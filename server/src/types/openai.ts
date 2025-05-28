export interface AgentPromptConfig {
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
}

export interface ConversationAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  keyTopics: string[];
  actionItems: string[];
  summary: string;
  customerIntent: string;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}