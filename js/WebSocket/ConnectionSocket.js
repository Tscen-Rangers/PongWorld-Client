import BaseWebSocket from './BaseWebSocket.js';
import {getToken, refreshAccessToken} from '../tokenManager.js';
import {checkConnectionSocket} from '../webSocketManager.js';

class ConnectionSocket extends BaseWebSocket {
  static instance = null;

  constructor() {
    super();
    this.reconnectTimer = null;
  }

  async connect(url) {
    console.log('Connection WebSocket 연결 시도중');
    super.connect(url);

    return new Promise(async (resolve, reject) => {
      this.ws.onopen = () => {
        console.log('Connection WebSocket 연결 성공!');
        resolve();
      };

      this.ws.onclose = async () => {
        console.log('Connection WebSocket 닫힘');
        await checkConnectionSocket();
      };
    });
  }

  setEvent(handler) {
    if (handler) {
      this.ws.onmessage = e => {
        handler(JSON.parse(e.data));
      };
    }
  }

  static getInstance() {
    if (!ConnectionSocket.instance) {
      ConnectionSocket.instance = new ConnectionSocket();
    }
    return ConnectionSocket.instance;
  }
}

const cws = ConnectionSocket.getInstance();
export default cws;
