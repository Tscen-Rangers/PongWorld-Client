export default class BaseWebSocket {
  constructor() {
    this.ws = null;
  }

  connect(url) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket 연결 성공');
    };

    this.ws.onclose = () => {
      console.log('WebSocket 연결 해제');
    };

    this.ws.onerror = error => {
      console.error('WebSocket 에러 발생:', error);
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
}
