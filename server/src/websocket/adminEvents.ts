import { WebSocket } from 'ws';

export class AdminEvents {
  static broadcastSystemUpdate(wsClients: Set<WebSocket>, data: any) {
    const message = JSON.stringify({
      event: 'system_update',
      data,
      timestamp: new Date().toISOString()
    });

    wsClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  static notifyAdmins(wsClients: Set<WebSocket>, adminIds: string[], data: any) {
    const message = JSON.stringify({
      event: 'admin_notification',
      data,
      timestamp: new Date().toISOString()
    });

    wsClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && adminIds.includes((client as any).userId)) {
        client.send(message);
      }
    });
  }
}