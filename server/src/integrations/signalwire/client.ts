import { RestClient } from '@signalwire/compatibility-api'
import { config } from '@/config'
import { BaseIntegration, IntegrationConfig } from '../base/BaseIntegration'

export class SignalWireIntegration extends BaseIntegration {
  private client: any
  private static instance: SignalWireIntegration

  private constructor() {
    const integrationConfig: IntegrationConfig = {
      retryAttempts: config.signalWire.retryAttempts,
      retryDelay: config.signalWire.retryDelay,
      timeout: config.signalWire.timeout,
    }

    super('signalwire', integrationConfig)

    if (!config.signalWire.projectId || !config.signalWire.apiToken || !config.signalWire.spaceUrl) {
      throw new Error('SignalWire credentials are required')
    }

    this.client = new RestClient(
      config.signalWire.projectId,
      config.signalWire.apiToken,
      { signalwireSpaceUrl: config.signalWire.spaceUrl }
    )
  }

  public static getInstance(): SignalWireIntegration {
    if (!SignalWireIntegration.instance) {
      SignalWireIntegration.instance = new SignalWireIntegration()
    }
    return SignalWireIntegration.instance
  }

  public getClient(): any {
    return this.client
  }

  public async makeCall(params: {
    from: string
    to: string
    url: string
    timeout?: number
  }): Promise<any> {
    return this.executeWithRetry(
      async () => {
        return await this.client.calls.create({
          from: params.from,
          to: params.to,
          url: params.url,
          timeout: params.timeout || 30,
        })
      },
      'makeCall'
    )
  }

  public async sendMessage(params: {
    from: string
    to: string
    body: string
    mediaUrl?: string
  }): Promise<any> {
    return this.executeWithRetry(
      async () => {
        return await this.client.messages.create({
          from: params.from,
          to: params.to,
          body: params.body,
          mediaUrl: params.mediaUrl,
        })
      },
      'sendMessage'
    )
  }

  public async getCallDetails(callSid: string): Promise<any> {
    return this.executeWithRetry(
      async () => {
        const call = await this.client.calls(callSid).fetch()
        return {
          sid: call.sid,
          status: call.status,
          from: call.from,
          to: call.to,
          duration: call.duration,
          startTime: call.startTime,
          endTime: call.endTime,
        }
      },
      'getCallDetails'
    )
  }
}

export const signalwire = SignalWireIntegration.getInstance()