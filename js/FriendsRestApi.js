import {getToken, refreshAccessToken} from './tokenManager.js';

export const unblock = async id => {
  const deleteBlocked = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/block/cancel/${id}/`, {
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
        } else throw new Error(`Server responded with status: ${res.status}`);
      } else {
        const data = await res.json();
        console.log(data);
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
      const res = await fetch(`http://127.0.0.1:8000/block/${id}/`, {
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
          //   console.log(await res.json());
          throw new Error(`Server responded with status: ${res.status}`);
        }
      } else {
        const data = await res.json();
        console.log(data);
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
      const res = await fetch(`http://127.0.0.1:8000/friends/delete/${id}/`, {
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
          console.log(await res.json());
          throw new Error(`Server responded with status: ${res.status}`);
        }
      } else {
        const data = await res.json();
        console.log(data);
        return 1;
      }
    } catch (error) {
      console.log('delete Request error', error);
      return 0;
    }
  };
  return await deleteRequest();
};
