import {getToken} from '../tokenManager.js';

export default class BaseWebSocket {
  constructor() {
    this.ws = null;
  }

  connect(url) {
    this.ws = new WebSocket(`${url}?token=${getToken()}`);

    this.ws.onerror = async error => {
      console.error('WebSocket 에러 발생:');
    };
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket이 연결되지 않았습니다.');
    }
  }

  onMessage(callback) {
    this.ws.onmessage = event => {
      const message = JSON.parse(event.data);
      callback(message);
    };
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }

  getWS() {
    return this.ws;
  }
}
