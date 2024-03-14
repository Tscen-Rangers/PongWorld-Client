import BaseWebSocket from './BaseWebSocket.js';

class QuickMatchSocket extends BaseWebSocket {
  static instance = null;

  constructor() {
    super();
  }
  async connect(url) {
    super.connect(url);
    this.ws.onclose = async () => {
      console.log('quickmatch WebSocket 닫힘');
    };
  }
  static getInstance() {
    if (!QuickMatchSocket.instance) {
      QuickMatchSocket.instance = new QuickMatchSocket();
    }
    return QuickMatchSocket.instance;
  }
  send(message) {
    this.ws.onopen = () => {
      super.send(message);
    };
  }
}

const qws = QuickMatchSocket.getInstance();
export default qws;
