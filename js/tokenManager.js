import {router} from './route.js';

let accessToken = '';

export const setToken = token => {
  sessionStorage.setItem('access_token', token); // 세션 스토리지에 액세스 토큰 저장 TODO: check 필요
};

export const getToken = () => {
  return sessionStorage.getItem('access_token'); // 세션 스토리지에서 액세스 토큰 가져오기 TODO: check 필요
};

export const setRefreshToken = token => {
  sessionStorage.setItem('refresh_token', token);
};

export const getRefreshToken = () => {
  return sessionStorage.getItem('refresh_token');
};

export const refreshAccessToken = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/tcen-auth/refresh-token/', {
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
