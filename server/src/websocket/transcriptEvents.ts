import { WebSocket } from 'ws';

export class TranscriptEvents {
  static sendLiveTranscript(client: WebSocket, transcriptData: any) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        event: 'live_transcript',
        data: transcriptData,
        timestamp: new Date().toISOString()
      }));
    }
  }

  static notifyTranscriptReady(wsClients: Set<WebSocket>, userId: string, callId: string) {
    wsClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && (client as any).userId === userId) {
        client.send(JSON.stringify({
          event: 'transcript_ready',
          data: { callId },
          timestamp: new Date().toISOString()
        }));
      }
    });
  }
}