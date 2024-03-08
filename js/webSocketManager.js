import cws from './WebSocket/ConnectionSocket.js';
import {refreshAccessToken, getToken} from './tokenManager.js';

export const checkConnectionSocket = async () => {
  if (!cws.getWS()) {
    connectionSocketConnect();
  }
};

export const connectionSocketConnect = async () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const onlineUsersObj = {};

  if (!getToken().length) await refreshAccessToken();
  await cws.connect('ws://127.0.0.1:8000/ws/connection/');

  cws.onMessage(msg => {
    if (msg.online_users) {
      msg.online_users.forEach(id => {
        if (id !== user.id) onlineUsersObj[Number(id)] = 0;
      });
      sessionStorage.setItem('online_users', JSON.stringify(onlineUsersObj));
    } else {
      if (msg.type === 'user_online' && msg.user_id !== user.id) {
        onlineUsersObj[msg.user_id] = 0;
      } else if (msg.type === 'user_offline') {
        delete onlineUsersObj[msg.user_id];
      }
      sessionStorage.setItem('online_users', JSON.stringify(onlineUsersObj));
    }
    console.log(JSON.parse(sessionStorage.getItem('online_users')));
  });
};
