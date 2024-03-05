import BaseWebSocket from './BaseWebSocket.js';

class DirectChatSocket extends BaseWebSocket {
  static instance = null;

  constructor() {
    super();
  }

  connect(url) {
    if (this.ws) {
      super.close();
      console.log('DirectSocket is Close!!! Trying to reconnect...');
    }
    super.connect(url);
  }

  static getInstance() {
    if (!DirectChatSocket.instance) {
      DirectChatSocket.instance = new DirectChatSocket();
    }
    return DirectChatSocket.instance;
  }
}

const dws = DirectChatSocket.getInstance();
export default dws;
