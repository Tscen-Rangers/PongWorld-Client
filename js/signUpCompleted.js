export const setSignUpCompleted = completed => {
  sessionStorage.setItem('signUpCompleted', completed);
};

export const isSignUpCompleted = () => {
  return sessionStorage.getItem('signUpCompleted') === 'true';
};
