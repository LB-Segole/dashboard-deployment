8. **signalwire.md**
```markdown
# SignalWire Integration Guide

## Overview
This guide covers the integration of SignalWire for telephony services in the AI Voice Calling Agent system, including voice calls, real-time audio streaming, and call management.

## Configuration

### Environment Variables
```bash
# Required environment variables
SIGNALWIRE_PROJECT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
SIGNALWIRE_TOKEN=PTxxxxxxxxxxxxxxxx
SIGNALWIRE_SPACE_URL=example.signalwire.com
SIGNALWIRE_CONTEXTS=["voiceai"]
SIGNALWIRE_WEBHOOK_URL=https://api.yourdomain.com/webhooks/signalwire
```

### Client Setup
```typescript
import { SignalWire } from '@signalwire/realtime-api';

interface SignalWireConfig {
  project: string;
  token: string;
  spaceUrl: string;
  contexts: string[];
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

const config: SignalWireConfig = {
  project: process.env.SIGNALWIRE_PROJECT_ID!,
  token: process.env.SIGNALWIRE_TOKEN!,
  spaceUrl: process.env.SIGNALWIRE_SPACE_URL!,
  contexts: JSON.parse(process.env.SIGNALWIRE_CONTEXTS!),
  logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
};

export const signalwireClient = new SignalWire.Client(config);
```

## Call Handling

### Inbound Call Flow
```typescript
interface CallHandler {
  onInboundCall: (call: SignalWire.Call) => Promise<void>;
  onStreamStart: (stream: AudioStream) => void;
  onStreamData: (data: AudioBuffer) => void;
  onStreamEnd: () => void;
}

class VoiceAICallHandler implements CallHandler {
  async onInboundCall(call: SignalWire.Call) {
    try {
      // 1. Answer the call
      await call.answer();
      
      // 2. Setup audio stream
      const stream = await call.startStream({
        direction: 'both',
        sampleRate: 16000,
        channels: 1,
      });
      
      // 3. Initialize call processors
      await this.initializeProcessors(call, stream);
      
      // 4. Setup event listeners
      this.setupEventListeners(call);
      
    } catch (error) {
      logger.error('Error handling inbound call', { error, callId: call.id });
      await this.handleCallError(call, error);
    }
  }
  
  // ... implementation of other methods
}
```

### Outbound Call Management
```typescript
interface OutboundCallConfig {
  to: string;
  from: string;
  callerId: string;
  maxDuration: number;
  recordCall: boolean;
  transcribe: boolean;
}

async function makeOutboundCall(config: OutboundCallConfig) {
  try {
    const call = await signalwireClient.calling.dial({
      to: config.to,
      from: config.from,
      timeout: 30,
      callerId: config.callerId,
      maxDuration: config.maxDuration,
      record: {
        enabled: config.recordCall,
        format: 'mp3',
        direction: 'both',
      },
    });
    
    return call;
  } catch (error) {
    logger.error('Failed to initiate outbound call', { error, config });
    throw new CallInitiationError('Failed to start call', { cause: error });
  }
}
```

## Audio Stream Processing

### Stream Configuration
```typescript
const AUDIO_CONFIG = {
  sampleRate: 16000,
  channels: 1,
  encoding: 'pcm',
  bitDepth: 16,
};

class AudioStreamProcessor {
  private buffer: AudioBuffer;
  private deepgramStream: DeepgramStream;
  
  constructor() {
    this.buffer = new AudioBuffer(AUDIO_CONFIG);
    this.deepgramStream = new DeepgramStream(AUDIO_CONFIG);
  }
  
  processAudioChunk(chunk: Buffer) {
    // Process audio in real-time
    this.buffer.append(chunk);
    this.deepgramStream.send(chunk);
  }
}
```

### Media Handling
```typescript
interface MediaConfig {
  playAudio: boolean;
  recordCall: boolean;
  transcribe: boolean;
}

class MediaHandler {
  async playPrompt(call: SignalWire.Call, audioUrl: string) {
    try {
      await call.playAudio({
        url: audioUrl,
        volume: 1.0,
      });
    } catch (error) {
      logger.error('Failed to play audio prompt', { error, callId: call.id });
    }
  }
  
  async startRecording(call: SignalWire.Call) {
    try {
      const recording = await call.record({
        format: 'mp3',
        direction: 'both',
        stereo: false,
        sampleRate: 16000,
      });
      return recording;
    } catch (error) {
      logger.error('Failed to start recording', { error, callId: call.id });
      throw error;
    }
  }
}
```

## Error Handling & Recovery

### Circuit Breaker
```typescript
import CircuitBreaker from 'opossum';

const breaker = new CircuitBreaker(signalwireClient.calling.dial, {
  timeout: 30000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
});

breaker.fallback(() => {
  // Fallback to secondary provider
  return backupTelephonyProvider.dial();
});
```

### Failover Configuration
```typescript
const FAILOVER_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  failoverProviders: ['twilio', 'vonage'],
};

async function handleFailover(error: Error, call: SignalWire.Call) {
  logger.warn('Initiating failover procedure', { error, callId: call.id });
  
  for (const provider of FAILOVER_CONFIG.failoverProviders) {
    try {
      const newCall = await failoverTo(provider, call.params);
      return newCall;
    } catch (failoverError) {
      logger.error('Failover attempt failed', { provider, error: failoverError });
    }
  }
  
  throw new Error('All failover attempts exhausted');
}
```

## Monitoring & Metrics

### Call Metrics
```typescript
const METRIC_KEYS = {
  callsTotal: 'signalwire_calls_total',
  callDuration: 'signalwire_call_duration_seconds',
  callErrors: 'signalwire_call_errors_total',
  streamErrors: 'signalwire_stream_errors_total',
};

function trackCallMetrics(call: SignalWire.Call) {
  metrics.increment(METRIC_KEYS.callsTotal);
  metrics.timing(METRIC_KEYS.callDuration, call.duration);
  
  if (call.error) {
    metrics.increment(METRIC_KEYS.callErrors, {
      type: call.error.type,
      code: call.error.code,
    });
  }
}
```

### Health Checks
```typescript
async function checkSignalWireHealth(): Promise<HealthStatus> {
  try {
    await signalwireClient.connect();
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

## Security

### Authentication
- Use environment variables for credentials
- Rotate API tokens regularly
- Implement IP whitelisting
- Use webhook signatures

### Compliance
- Call recording consent
- GDPR compliance
- Data retention policies
- Audit logging

## Best Practices

### 1. Call Management
- Set appropriate timeouts
- Implement graceful termination
- Monitor call quality
- Handle disconnections

### 2. Audio Processing
- Buffer management
- Noise reduction
- Echo cancellation
- Bandwidth optimization

### 3. Error Recovery
- Implement retry logic
- Use circuit breakers
- Monitor error rates
- Maintain fallback options

### 4. Performance
- Connection pooling
- Resource cleanup
- Memory management
- Load balancing

## Testing

### Unit Tests
```typescript
describe('SignalWire Integration', () => {
  beforeEach(() => {
    // Setup test environment
  });
  
  it('should handle inbound calls', async () => {
    // Test implementation
  });
  
  it('should manage call recordings', async () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
describe('Call Flow', () => {
  it('should process full call lifecycle', async () => {
    // Test implementation
  });
  
  it('should handle failover scenarios', async () => {
    // Test implementation
  });
});
```

## Troubleshooting

### Common Issues

1. Connection Problems
- Check network connectivity
- Verify credentials
- Monitor WebSocket status
- Check SSL certificates

2. Audio Issues
- Verify audio format
- Check stream configuration
- Monitor packet loss
- Test bandwidth capacity

3. Call Quality
- Monitor latency
- Check codec settings
- Verify network conditions
- Test different regions

## Support

### Internal Resources
- Voice Team: voice-team@yourdomain.com
- Documentation: /internal/docs/voice
- Monitoring: /grafana/signalwire

### External Resources
- [SignalWire Documentation](https://docs.signalwire.com)
- [SignalWire Status](https://status.signalwire.com)
- [SignalWire Support](https://signalwire.com/support)