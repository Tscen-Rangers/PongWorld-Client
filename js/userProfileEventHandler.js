document.addEventListener('DOMContentLoaded', () => {
  const $userProfileCloseBtn = document.querySelector('#userProfileCloseBtn');
  const $userProfileModalContainer = document.querySelector(
    '.userProfileModalContainer',
  );
  $userProfileCloseBtn.addEventListener('click', () => {
    $userProfileModalContainer.classList.remove('active');
  });
});
