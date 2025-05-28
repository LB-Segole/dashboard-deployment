import { WebSocket } from 'ws';

export class CallEvents {
  static sendCallUpdate(client: WebSocket, callData: any) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        event: 'call_update',
        data: callData,
        timestamp: new Date().toISOString()
      }));
    }
  }

  static broadcastCallEnded(wsClients: Set<WebSocket>, callId: string) {
    wsClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          event: 'call_ended',
          data: { callId },
          timestamp: new Date().toISOString()
        }));
      }
    });
  }
}