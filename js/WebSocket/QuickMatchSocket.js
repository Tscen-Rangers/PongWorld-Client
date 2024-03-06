import BaseWebSocket from './BaseWebSocket.js';

class QuickMatchSocket extends BaseWebSocket {
  static instance = null;

  constructor() {
    super();
  }
  static getInstance() {
    if (!QuickMatchSocket.instance) {
      QuickMatchSocket.instance = new QuickMatchSocket();
    }
    return QuickMatchSocket.instance;
  }
  send(message) {
    this.ws.onopen = () => {
      //   console.log(123123123);
      super.send(message);
    };
  }
}

const rws = QuickMatchSocket.getInstance();
export default rws;
