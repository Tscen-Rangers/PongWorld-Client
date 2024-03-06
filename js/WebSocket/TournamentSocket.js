import BaseWebSocket from './BaseWebSocket.js';

class TournamentSocket extends BaseWebSocket {
  static instance = null;

  constructor() {
    super();
  }

  static getInstance() {
    if (!TournamentSocket.instance) {
      TournamentSocket.instance = new TournamentSocket();
    }
    return TournamentSocket.instance;
  }

  send(message) {
    this.ws.onopen = () => {
      super.send(message);
    };
  }
}

const tws = TournamentSocket.getInstance();
export default tws;
