import BaseWebSocket from './BaseWebSocket.js';

class ChatSocket extends BaseWebSocket {
  static instance = null;

  constructor() {
    super();
  }

  connect(url) {
    console.log('전체 채팅 웹소켓 연결 시도!');
    super.connect(url);
  }

  static getInstance() {
    if (!ChatSocket.instance) {
      ChatSocket.instance = new ChatSocket();
    }
    return ChatSocket.instance;
  }
}

const cws = ChatSocket.getInstance();
export default cws;
