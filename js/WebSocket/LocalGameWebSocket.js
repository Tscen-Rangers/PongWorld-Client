import BaseWebSocket from './BaseWebSocket.js';

class LocalGameWebSocket extends BaseWebSocket {
  static instance = null;

  constructor() {
    super();
  }

  async connect(url) {
    super.connect(url);

    console.log(this.ws);

    return new Promise(async (resolve, reject) => {
      this.ws.onopen = () => {
        console.log('HELLO');
        resolve();
      };
      this.ws.onclose = () => {
        reject();
      };
    });
  }

  static getInstance() {
    if (!LocalGameWebSocket.instance)
      LocalGameWebSocket.instance = new LocalGameWebSocket();
    return LocalGameWebSocket.instance;
  }

  send(msg) {
    super.send(msg);
  }
}

const lws = LocalGameWebSocket.getInstance();
export default lws;
