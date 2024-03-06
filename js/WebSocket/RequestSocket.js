import BaseWebSocket from './BaseWebSocket.js';

class RequestSocket extends BaseWebSocket {
  static instance = null;

  constructor() {
    super();
  }

  static getInstance() {
    if (!RequestSocket.instance) {
      RequestSocket.instance = new RequestSocket();
    }
    return RequestSocket.instance;
  }

  send(message) {
    this.ws.onopen = () => {
      super.send(message);
    };
  }
}

const rws = RequestSocket.getInstance();
export default rws;
