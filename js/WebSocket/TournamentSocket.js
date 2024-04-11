import BaseWebSocket from './BaseWebSocket.js';

class TournamentSocket extends BaseWebSocket {
  static instance = null;

  constructor() {
    super();
  }

  connect(url) {
    new Promise((resolve, reject) => {
      super.connect(url);

      this.ws.onopen = () => {
        resolve();
      };

      this.ws.onclose = () => {
        reject();
      };
    });
  }

  send(message) {
    if (this.ws.readyState === WebSocket.OPEN) {
      super.send(message);
    }
  }

  static resetInstance() {
    TournamentSocket.instance = null;
  }

  static getInstance() {
    if (!TournamentSocket.instance) {
      TournamentSocket.instance = new TournamentSocket();
    }
    return TournamentSocket.instance;
  }
}

const tws = TournamentSocket.getInstance();
export default tws;
