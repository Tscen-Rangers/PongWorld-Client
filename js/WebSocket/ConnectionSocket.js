import BaseWebSocket from './BaseWebSocket.js';
import {getToken, refreshAccessToken} from '../tokenManager.js';

class ConnectionSocket extends BaseWebSocket {
  static instance = null;

  constructor() {
    super();
    this.reconnectTimer = null;
  }

  connect(url) {
    console.log('Connection WebSocket 연결 시도중');
    super.connect(url);

    this.ws.onopen = () => {
      console.log('Connection WebSocket 연결 성공!');
    };

    this.ws.onclose = () => {
      console.log('Connection WebSocket 닫힘');
    };

    // this.ws.onclose = async () => {
    //   console.log(
    //     'Connection WebSocket 연결이 끊어졌습니다. 재연결을 시도합니다.',
    //   );
    //   await refreshAccessToken();
    //   this.reconnect(url);
    // };
  }

  // reconnect(url) {
  //   this.reconnectTimer = setInterval(async () => {
  //     console.log('Connection WebSocket 재연결 시도 중...');
  //     if (this.ws.readyState === WebSocket.CLOSED) {
  //       await super.connect(url);
  //     }
  //   }, 1000);

  //   this.ws.onopen = () => {
  //     console.log('Connection WebSocket 재연결 성공!');
  //     if (this.reconnectTimer) {
  //       clearInterval(this.reconnectTimer);
  //       this.reconnectTimer = null;
  //     }
  //   };
  // }

  static getInstance() {
    if (!ConnectionSocket.instance) {
      ConnectionSocket.instance = new ConnectionSocket();
    }
    return ConnectionSocket.instance;
  }
}

const cws = ConnectionSocket.getInstance();
export default cws;
