import BaseWebSocket from "./BaseWebSocket.js";

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
}

const rws = QuickMatchSocket.getInstance();
export default rws;