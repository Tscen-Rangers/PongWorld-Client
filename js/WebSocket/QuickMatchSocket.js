import BaseWebSocket from './BaseWebSocket.js';

class QuickMatchSocket extends BaseWebSocket {
  static instance = null;

  constructor() {
    super();
  }
  async connect(url) {
    super.connect(url);

    return new Promise(async (resolve, reject) => {
      this.ws.onopen = () => {
        console.log('quickmatck WebSocket OPEN!');
        resolve();
      };
      this.ws.onclose = async () => {
        console.log('quickmatch WebSocket CLOSE!');
        reject();
      };
    });
  }
  static getInstance() {
    if (!QuickMatchSocket.instance) {
      QuickMatchSocket.instance = new QuickMatchSocket();
    }
    return QuickMatchSocket.instance;
  }
  send(message) {
    super.send(message);
  }
}

const qws = QuickMatchSocket.getInstance();
export default qws;
