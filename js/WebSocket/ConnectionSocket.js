import BaseWebSocket from './BaseWebSocket.js';
import {getToken, refreshAccessToken} from '../tokenManager.js';
import {checkConnectionSocket} from './webSocketManager.js';

class ConnectionSocket extends BaseWebSocket {
  static instance = null;
  attemptCount = 0; // 연결 시도 횟수를 추적하는 변수
  maxAttempts = 2; // 최대 연결 시도 횟수

  constructor() {
    super();
    this.reconnectTimer = null;
  }

  async connect(url) {
    if (this.maxAttempts > this.attemptCount) {
      this.attemptCount++;
      super.connect(url);

      return new Promise(async (resolve, reject) => {
        this.ws.onopen = () => {
          resolve();
        };

        this.ws.onclose = async () => {
          await checkConnectionSocket();
        };
      });
    }
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
