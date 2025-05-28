# OpenAI Integration Guide

## Overview
This guide covers the integration of OpenAI's language models for powering the AI Voice Calling Agent's conversational capabilities.

## Configuration

### Environment Setup
```bash
# Required environment variables
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
OPENAI_ORG_ID=org-xxxxxxxxxxxxxxxx  # Optional
OPENAI_API_VERSION=2024-01  # Optional, for API versioning
```

### Model Configuration

#### Primary Model (GPT-4)
```typescript
export const PRIMARY_MODEL_CONFIG = {
  model: 'gpt-4-1106-preview',
  temperature: 0.7,
  max_tokens: 2000,
  top_p: 0.95,
  frequency_penalty: 0.5,
  presence_penalty: 0.5,
  user: 'system-agent',  // For request tracking
}
```

#### Fallback Model (GPT-3.5)
```typescript
export const FALLBACK_MODEL_CONFIG = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  max_tokens: 1000,
  top_p: 0.9,
  frequency_penalty: 0.3,
  presence_penalty: 0.3,
  user: 'system-agent',
}
```

## Prompt Engineering

### Base System Prompt
```typescript
const BASE_SYSTEM_PROMPT = `You are VoiceAI, a professional calling agent designed to handle customer interactions with expertise and empathy. Your communication style should be:

1. Professional yet warm
2. Clear and concise
3. Adaptive to customer's tone
4. Solution-oriented
5. Respectful of time and boundaries

You should always:
- Identify yourself as an AI assistant
- Stay within the defined scope
- Handle objections professionally
- End calls gracefully when appropriate
- Maintain compliance with regulations`;
```

### Context Integration
```typescript
const createConversationPrompt = (context: CallContext) => {
  return {
    systemMessage: BASE_SYSTEM_PROMPT,
    contextMessage: `
      Call Purpose: ${context.purpose}
      Customer Name: ${context.customerName}
      Previous Interactions: ${context.history}
      Relevant Products/Services: ${context.products}
      Special Instructions: ${context.specialInstructions}
      Compliance Requirements: ${context.complianceNotes}
    `
  };
};
```

## Error Handling

### Rate Limiting
```typescript
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const handleRateLimit = async (error: OpenAIError) => {
  if (error.status === 429) {
    const retryAfter = parseInt(error.headers['retry-after'] || '1');
    await delay(retryAfter * 1000);
    return true;
  }
  return false;
};
```

### Fallback Strategy
```typescript
const getCompletion = async (prompt: string, context: CallContext) => {
  try {
    return await getGPT4Completion(prompt, context);
  } catch (error) {
    logger.warn('GPT-4 request failed, falling back to GPT-3.5', { error });
    return await getGPT35Completion(prompt, context);
  }
};
```

## Cost Management

### Token Budget Control
```typescript
interface TokenBudget {
  maxTokensPerTurn: number;
  maxTokensPerCall: number;
  reservedTokens: number;
}

const DEFAULT_TOKEN_BUDGET: TokenBudget = {
  maxTokensPerTurn: 2000,
  maxTokensPerCall: 15000,
  reservedTokens: 500,
};
```

### Usage Tracking
```typescript
interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

const trackTokenUsage = (usage: TokenUsage) => {
  metrics.gauge('openai.tokens.prompt', usage.promptTokens);
  metrics.gauge('openai.tokens.completion', usage.completionTokens);
  metrics.gauge('openai.tokens.total', usage.totalTokens);
  metrics.gauge('openai.cost', usage.cost);
};
```

## Best Practices

### 1. Prompt Management
- Keep system prompts concise and focused
- Update prompts through configuration, not code
- Test prompts thoroughly before deployment
- Version control your prompts

### 2. Context Handling
- Summarize long conversation histories
- Prioritize recent and relevant information
- Clear sensitive data from context
- Maintain conversation coherence

### 3. Performance Optimization
- Use token counting utilities
- Cache common responses
- Implement request batching
- Monitor response times

### 4. Cost Optimization
- Use cheaper models for simple tasks
- Implement token budgeting
- Monitor and alert on usage spikes
- Regular cost analysis and optimization

## Monitoring and Logging

### Metrics to Track
```typescript
const OPENAI_METRICS = {
  requestLatency: 'openai.request.latency',
  requestSuccess: 'openai.request.success',
  requestFailure: 'openai.request.failure',
  tokenUsage: 'openai.tokens.used',
  costPerRequest: 'openai.request.cost',
  modelUsage: 'openai.model.usage',
};
```

### Logging Strategy
```typescript
const logOpenAIRequest = (requestData: OpenAIRequestData) => {
  logger.info('OpenAI API Request', {
    model: requestData.model,
    promptTokens: requestData.usage.prompt_tokens,
    completionTokens: requestData.usage.completion_tokens,
    duration: requestData.duration,
    success: requestData.success,
    error: requestData.error,
  });
};
```

## Security Considerations

### API Key Management
- Use environment variables
- Rotate keys regularly
- Monitor for unauthorized usage
- Implement key access logging

### Data Privacy
- Sanitize PII before sending to OpenAI
- Implement data retention policies
- Regular security audits
- Compliance documentation

## Testing

### Unit Tests
```typescript
describe('OpenAI Integration', () => {
  it('should handle rate limiting', async () => {
    // Test implementation
  });

  it('should fall back to GPT-3.5', async () => {
    // Test implementation
  });

  it('should respect token budgets', async () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
describe('OpenAI Call Flow', () => {
  it('should complete a successful call', async () => {
    // Test implementation
  });

  it('should handle conversation context', async () => {
    // Test implementation
  });
});
```

## Troubleshooting

### Common Issues

1. Rate Limiting
- Implement exponential backoff
- Monitor rate limit headers
- Use request queuing

2. Token Overflows
- Implement truncation strategies
- Monitor token usage
- Use sliding windows for context

3. Response Quality
- Tune temperature and top_p
- Refine system prompts
- Implement feedback loops

## Support

### Internal Resources
- AI Team: ai-team@yourdomain.com
- Documentation: /internal/docs/ai
- Monitoring Dashboard: /grafana/openai

### External Resources
- [OpenAI Documentation](https://platform.openai.com/docs)
- [OpenAI Status Page](https://status.openai.com)
- [OpenAI Support](https://help.openai.com)