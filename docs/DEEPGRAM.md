# Deepgram Integration Guide

## Overview
This document outlines the integration of Deepgram's speech-to-text services for real-time transcription in the AI Voice Calling Agent system.

## Configuration

### Environment Variables
```bash
# Required Deepgram configuration
DEEPGRAM_API_KEY=your-api-key
DEEPGRAM_PROJECT_ID=your-project-id
DEEPGRAM_VERSION=v1
DEEPGRAM_TIER=enhanced # or nova/base
```

### Client Setup
```typescript
import { Deepgram } from '@deepgram/sdk';

interface DeepgramConfig {
  apiKey: string;
  projectId: string;
  version: string;
  tier: string;
  callbackUrl?: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

const config: DeepgramConfig = {
  apiKey: process.env.DEEPGRAM_API_KEY!,
  projectId: process.env.DEEPGRAM_PROJECT_ID!,
  version: process.env.DEEPGRAM_VERSION || 'v1',
  tier: process.env.DEEPGRAM_TIER || 'enhanced',
  logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
};

export const deepgramClient = new Deepgram(config.apiKey, {
  global: {
    url: 'api.deepgram.com',
    version: config.version,
  },
});
```

## Usage Patterns

### Real-time Streaming
```typescript
interface StreamConfig {
  language?: string;
  model?: string;
  punctuate?: boolean;
  numerals?: boolean;
  profanity_filter?: boolean;
  smart_format?: boolean;
}

class DeepgramStreamHandler {
  private socket: WebSocket;
  private transcriptionBuffer: string[] = [];
  
  constructor(private config: StreamConfig) {
    this.socket = deepgramClient.transcription.live(config);
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    this.socket.on('open', () => {
      logger.info('Deepgram WebSocket connected');
    });
    
    this.socket.on('transcriptReceived', (message: TranscriptionMessage) => {
      const transcript = message.channel.alternatives[0].transcript;
      if (transcript && message.is_final) {
        this.handleFinalTranscript(transcript);
      }
    });
    
    this.socket.on('error', (error) => {
      logger.error('Deepgram error', { error });
      this.handleStreamError(error);
    });
    
    this.socket.on('close', () => {
      logger.info('Deepgram WebSocket closed');
      this.cleanup();
    });
  }
  
  public async sendAudio(audioChunk: Buffer) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(audioChunk);
    }
  }
  
  private handleFinalTranscript(transcript: string) {
    this.transcriptionBuffer.push(transcript);
    this.processTranscription();
  }
  
  private async processTranscription() {
    // Implement transcription processing logic
  }
}
```

### Pre-recorded Audio
```typescript
interface PreRecordedConfig {
  url: string;
  mimetype?: string;
  language?: string;
  model?: string;
  punctuate?: boolean;
  numerals?: boolean;
}

async function transcribeAudioFile(config: PreRecordedConfig) {
  try {
    const response = await deepgramClient.transcription.preRecorded({
      url: config.url,
      mimetype: config.mimetype,
    }, {
      punctuate: config.punctuate ?? true,
      numerals: config.numerals ?? true,
      language: config.language ?? 'en-US',
      model: config.model ?? 'enhanced',
    });
    
    return response.results;
  } catch (error) {
    logger.error('Pre-recorded transcription failed', { error, config });
    throw new TranscriptionError('Failed to transcribe audio', { cause: error });
  }
}
```

## Rate Limiting & Usage Management

### Rate Limits
```typescript
const RATE_LIMITS = {
  CONCURRENT_STREAMS: 50,  // Per project
  REQUESTS_PER_MINUTE: 1000,
  MAX_AUDIO_LENGTH: 4 * 60 * 60,  // 4 hours in seconds
};

class RateLimitManager {
  private activeStreams = 0;
  private requestCount = 0;
  private lastResetTime = Date.now();
  
  public async acquireStream(): Promise<boolean> {
    if (this.activeStreams >= RATE_LIMITS.CONCURRENT_STREAMS) {
      return false;
    }
    
    this.activeStreams++;
    return true;
  }
  
  public releaseStream() {
    this.activeStreams = Math.max(0, this.activeStreams - 1);
  }
  
  public async checkRequestLimit(): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastResetTime >= 60000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }
    
    if (this.requestCount >= RATE_LIMITS.REQUESTS_PER_MINUTE) {
      return false;
    }
    
    this.requestCount++;
    return true;
  }
}
```

## Error Handling

### Transcription Errors
```typescript
class TranscriptionErrorHandler {
  public async handleError(error: any, context: TranscriptionContext) {
    if (error.status === 429) {
      await this.handleRateLimit(error);
    } else if (error.status === 400) {
      await this.handleBadRequest(error, context);
    } else if (error.status >= 500) {
      await this.handleServerError(error, context);
    }
    
    metrics.increment('deepgram.errors', { type: error.type });
    throw new TranscriptionError(error.message, { cause: error });
  }
  
  private async handleRateLimit(error: RateLimitError) {
    const retryAfter = parseInt(error.headers['retry-after'] || '1');
    await delay(retryAfter * 1000);
  }
}
```

## Monitoring & Metrics

### Key Metrics
```typescript
const DEEPGRAM_METRICS = {
  streamLatency: 'deepgram.stream.latency',
  transcriptionAccuracy: 'deepgram.transcription.accuracy',
  streamErrors: 'deepgram.stream.errors',
  requestLatency: 'deepgram.request.latency',
  activeStreams: 'deepgram.streams.active',
  usageSeconds: 'deepgram.usage.seconds',
};

function trackMetrics(context: TranscriptionContext) {
  metrics.gauge(DEEPGRAM_METRICS.streamLatency, context.latency);
  metrics.gauge(DEEPGRAM_METRICS.transcriptionAccuracy, context.accuracy);
  metrics.gauge(DEEPGRAM_METRICS.activeStreams, context.activeStreams);
}
```

### Health Checks
```typescript
async function checkDeepgramHealth(): Promise<HealthStatus> {
  try {
    await deepgramClient.projects.list();
    return {
      status: 'healthy',
      latency: await measureLatency(),
      lastError: null,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      latency: null,
      lastError: error.message,
    };
  }
}
```

## Best Practices

### 1. Audio Quality
- Use 16kHz sample rate
- Single channel audio
- PCM format
- Clear audio source
- Noise reduction

### 2. Stream Management
- Monitor stream health
- Implement reconnection logic
- Buffer management
- Close inactive streams
- Handle partial results

### 3. Error Recovery
- Implement retry logic
- Use fallback options
- Monitor error rates
- Circuit breaker pattern
- Graceful degradation

### 4. Performance
- Optimize audio chunks
- Buffer management
- Resource cleanup
- Load balancing
- Caching strategies

## Testing

### Unit Tests
```typescript
describe('Deepgram Integration', () => {
  let streamHandler: DeepgramStreamHandler;
  
  beforeEach(() => {
    streamHandler = new DeepgramStreamHandler(testConfig);
  });
  
  it('should handle streaming audio', async () => {
    // Test implementation
  });
  
  it('should manage stream lifecycle', async () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
describe('Speech Recognition', () => {
  it('should transcribe audio accurately', async () => {
    // Test implementation
  });
  
  it('should handle audio streaming', async () => {
    // Test implementation
  });
});
```

## Troubleshooting

### Common Issues

1. Connection Problems
- Check API credentials
- Verify network connectivity
- Monitor WebSocket status
- Check rate limits

2. Audio Issues
- Verify audio format
- Check sample rate
- Monitor streaming stats
- Test different models

3. Transcription Quality
- Check audio clarity
- Verify language settings
- Test different models
- Monitor accuracy metrics

## Support

### Internal Resources
- Speech Team: speech-team@yourdomain.com
- Documentation: /internal/docs/speech
- Monitoring: /grafana/deepgram

### External Resources
- [Deepgram Documentation](https://developers.deepgram.com)
- [Deepgram Status](https://status.deepgram.com)
- [Deepgram Support](https://deepgram.com/support)