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

export const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    const res = await fetch('http://127.0.0.1:8000/tcen-auth/refresh-token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });
    const data = await res.json();
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
