let accessToken = '';

export const setToken = token => {
  accessToken = token;
};

export const getToken = () => {
  return accessToken;
};
