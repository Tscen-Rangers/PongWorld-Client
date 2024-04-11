import {getToken, refreshAccessToken} from './tokenManager.js';
import API_URL from '../config.js';

export const unblock = async id => {
  const deleteBlocked = async () => {
    try {
      const res = await fetch(`${API_URL}/block/cancel/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          blocked_id: id,
        }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          await refreshAccessToken();
          return await deleteBlocked();
        } else {
          throw new Error(`Server responded with status: ${res.status}`);
        }
      } else {
        return 1;
      }
    } catch (error) {
      console.log('post Unblock error', error);
      return 0;
    }
  };
  return await deleteBlocked();
};

///특정 id block 하기
export const block = async id => {
  const postBlock = async () => {
    try {
      const res = await fetch(`${API_URL}/block/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          to_block_id: id,
        }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          await refreshAccessToken();
          return await postBlock();
        } else {
          throw new Error(`Server responded with status: ${res.status}`);
        }
      } else {
        return 1;
      }
      //해당 id의 user block 상태로 바꿔주기
    } catch (error) {
      console.log('post block player error', error);
      return 0;
    }
  };
  return await postBlock();
};

export const deleteFriend = async id => {
  const deleteRequest = async () => {
    try {
      const res = await fetch(`${API_URL}/friends/delete/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          friend_id: id,
        }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          await refreshAccessToken();
          return await deleteRequest();
        } else {
          throw new Error(`Server responded with status: ${res.status}`);
        }
      } else {
        return 1;
      }
    } catch (error) {
      console.log('delete Request error', error);
      return 0;
    }
  };
  return await deleteRequest();
};

export const getNewRequest = async () => {
  const getNewRequestCount = async () => {
    try {
      const res = await fetch(`${API_URL}/friends/followed/count`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          await refreshAccessToken();
          return await getNewRequestCount();
        } else throw new Error(`Server responded with status: ${res.status}`);
      } else {
        const data = await res.json();
        sessionStorage.setItem('newRequest', data.data.request_cnt);
      }
    } catch (error) {
      console.log('get new request error', error);
    }
  };
  return await getNewRequestCount();
};

export const friendRequest = async id => {
  const sendRequest = async () => {
    try {
      const res = await fetch(`${API_URL}/friends/follow/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          followed_id: id,
        }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          await refreshAccessToken();
          return sendRequest();
        } else {
          throw new Error(`Server responded with status: ${res.status}`);
        }
      } else {
        const data = await res.json();
        return data.data.id;
      }
    } catch (error) {
      console.log('post friend request error', error);
      return 0;
    }
  };
  return await sendRequest();
};
