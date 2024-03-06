import BaseWebSocket from './BaseWebSocket.js';

class ConnectionSocket extends BaseWebSocket {
  static instance = null;

  constructor() {
    super();
  }

  static getInstance() {
    if (!ConnectionSocket.instance) {
      ConnectionSocket.instance = new ConnectionSocket();
    }
    return ConnectionSocket.instance;
  }

  // send(message) {
  //   this.ws.onopen = () => {
  //     super.send(message);
  //   };
  // }
}

const cws = ConnectionSocket.getInstance();
export default cws;
