import { Alert, AlertConfig } from '@voiceai/monitoring';
import { z } from 'zod';

// Environment variable validation
const envSchema = z.object({
  SLACK_ALERT_WEBHOOK: z.string().url(),
  PAGERDUTY_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
});

// Validate environment variables
const env = envSchema.parse(process.env);

const apiAlertConfig: AlertConfig = {
  endpoints: [
    {
      path: '/v1/calls',
      method: 'POST',
      thresholds: {
        responseTime: 1000, // ms
        errorRate: 0.01, // 1%
        sampleWindow: '5m'
      }
    },
    {
      path: '/v1/agents',
      method: 'GET',
      thresholds: {
        responseTime: 500,
        errorRate: 0.01,
        sampleWindow: '5m'
      }
    },
    {
      path: '/health',
      method: 'GET',
      thresholds: {
        responseTime: 200,
        errorRate: 0.001,
        sampleWindow: '1m'
      }
    }
  ],
  notificationChannels: [
    {
      type: 'slack',
      webhook: env.SLACK_ALERT_WEBHOOK,
      throttle: {
        maxAlerts: 10,
        perTimeWindow: '1h'
      }
    },
    {
      type: 'pagerduty',
      integrationKey: env.PAGERDUTY_KEY,
      throttle: {
        maxAlerts: 5,
        perTimeWindow: '1h'
      }
    }
  ],
  customMetrics: {
    memory: {
      threshold: 85, // Alert if memory usage > 85%
      sampleWindow: '5m'
    },
    cpu: {
      threshold: 80, // Alert if CPU usage > 80%
      sampleWindow: '5m'
    }
  }
};

class APIMonitoring {
  private static instance: APIMonitoring;
  private alert: Alert;

  private constructor() {
    this.alert = new Alert(apiAlertConfig);
  }

  public static getInstance(): APIMonitoring {
    if (!APIMonitoring.instance) {
      APIMonitoring.instance = new APIMonitoring();
    }
    return APIMonitoring.instance;
  }

  public startMonitoring() {
    this.alert.startMonitoring();
    console.log('API monitoring started');
  }

  public stopMonitoring() {
    this.alert.stopMonitoring();
    console.log('API monitoring stopped');
  }
}

export const apiMonitoring = APIMonitoring.getInstance();