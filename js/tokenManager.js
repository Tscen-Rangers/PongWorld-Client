import API_URL from '../config.js';
import {router} from './route.js';

let accessToken = '';

export const setToken = token => {
  accessToken = token;
};

export const getToken = () => {
  return accessToken;
};

export const setRefreshToken = token => {
  sessionStorage.setItem('refresh_token', token);
};

export const getRefreshToken = () => {
  return sessionStorage.getItem('refresh_token');
};

export const removeRefreshToken = () => {
  sessionStorage.removeItem('refresh_token');
};

export const refreshAccessToken = async () => {
  try {
    const res = await fetch(`${API_URL}/tcen-auth/refresh-token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: sessionStorage.getItem('refresh_token'),
      }),
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      setToken(data.data.access);
    } else {
      alert('Please try again.');
      window.history.pushState(null, null, '/');
      router();
    }
  } catch (error) {
    console.log(error);
  }
};
