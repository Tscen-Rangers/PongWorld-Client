import API_URL from '../config.js';
import {getToken, refreshAccessToken} from './tokenManager.js';
import {updateUserModal} from './updateUserProfile.js';

const $allHistoryBtn = document.querySelector('.allHistoryBtn');

export const userProfileData = async (id, type, all) => {
  const getUserProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/players/profile/${id}/${type}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      console.log(getToken());
      if (!res.ok) {
        if (res.status === 401) {
          await refreshAccessToken();
          return await getUserProfile();
        } else {
          throw new Error(`Server responded with status: ${res.status}`);
        }
      } else {
        const data = await res.json();
        console.log(data.data);
        updateUserModal(data.data, all);
      }
    } catch (error) {
      console.log('get new request error', error);
    }
  };
  getUserProfile();
};
