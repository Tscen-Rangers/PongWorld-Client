import cws from './WebSocket/ConnectionSocket.js';
import {refreshAccessToken, getToken} from './tokenManager.js';

let tempHandler = null;

export const checkConnectionSocket = async handler => {
  if (handler) tempHandler = handler;
  console.log('HELLO');
  return new Promise(async (resolve, reject) => {
    console.log(cws.getWS());
    // 새로고침 상황
    if (!cws.getWS()) {
      try {
        await connectionSocketConnect(handler);
        console.log('connectionSocket 재연결!');
        resolve();
      } catch (error) {
        console.log('checkConnectionSocket Error : ', error);
        reject(error);
      }
      //소켓이 닫혔을때
    } else if (cws.getWS().readyState === WebSocket.CLOSED) {
      try {
        await connectionSocketConnect(tempHandler);
        resolve();
      } catch (error) {
        console.log('checkConnectionSocket Error : ', error);
        reject(error);
      }
    } else resolve();
    cws.setEvent(handler);
  });
};

export const connectionSocketConnect = async handler => {
  if (!getToken()) await refreshAccessToken();
  await cws.connect('ws://127.0.0.1:8000/ws/connection/');
  cws.setEvent(handler);
};
