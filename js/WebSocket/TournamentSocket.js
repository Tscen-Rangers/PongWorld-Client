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
    if (this.ws.readyState === WebSocket.OPEN) {
      super.send(message);
      console.log('send');
    }
    console.log('ghelwelqleqlwelqwel');
  }
}

const tws = TournamentSocket.getInstance();
export default tws;
