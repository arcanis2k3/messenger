// This service will manage the WebSocket connection for real-time messaging.
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import NotificationService from './notifications';
import { getAuth } from 'firebase/auth';

const WS_URL = 'wss://chat.zmodelz.com/messenger/ws';

class WebSocketService {
  private client: W3CWebSocket | null = null;
  private static instance: WebSocketService;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(): void {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('WebSocket: No user is authenticated.');
      return;
    }

    const userId = user.uid;

    if (this.client && this.client.readyState === this.client.OPEN) {
      console.log('WebSocket is already connected.');
      return;
    }

    this.client = new W3CWebSocket(`${WS_URL}/${userId}`);

    this.client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    this.client.onmessage = (message) => {
      const data = JSON.parse(message.data as string);
      // Assuming the message data has a `content` and `sender` property
      NotificationService.schedulePushNotification('New Message', data.content, { data });
    };

    this.client.onclose = () => {
      console.log('WebSocket Client Closed');
      // Optional: implement reconnection logic here
    };

    this.client.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };
  }

  public getClient(): W3CWebSocket | null {
    return this.client;
  }

  public sendMessage(message: any): void {
    if (this.client && this.client.readyState === this.client.OPEN) {
      this.client.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  public disconnect(): void {
    if (this.client) {
      this.client.close();
    }
  }
}

export default WebSocketService.getInstance();
