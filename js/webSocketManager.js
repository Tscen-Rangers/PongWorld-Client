import cws from './WebSocket/ConnectionSocket.js';
import {refreshAccessToken, getToken} from './tokenManager.js';

export const checkConnectionSocket = async handler => {
  return new Promise(async (resolve, reject) => {
    if (!cws.getWS()) {
      try {
        await connectionSocketConnect(handler);
        console.log('connectionSocket 재연결!');
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
  if (!getToken().length) await refreshAccessToken();
  await cws.connect('ws://127.0.0.1:8000/ws/connection/');
  cws.setEvent(handler);
};
