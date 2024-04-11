import API_URL from '../config.js';
import {logout} from './pages/myPage/Mypage.js';

let accessToken = null;

export const setToken = token => {
  accessToken = token;
};

export const getToken = () => {
  return accessToken;
};

export const removeRefreshToken = () => {
  sessionStorage.removeItem('refresh_token');
};

export const refreshAccessToken = async () => {
  try {
    const res = await fetch(`${API_URL}/tcen-auth/refresh-token/`, {
      method: 'POST',
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.data.access);
    } else {
      alert('Please try again.');
      logout();
    }
  } catch (error) {
    console.log(error);
  }
};
