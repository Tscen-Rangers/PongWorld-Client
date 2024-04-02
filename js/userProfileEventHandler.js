import {userProfileData} from './PlayersRestApi.js';
import {router} from './route.js';
document.addEventListener('DOMContentLoaded', () => {
  const $userProfileCloseBtn = document.querySelector('#userProfileCloseBtn');
  const $userProfileModalContainer = document.querySelector(
    '.userProfileModalContainer',
  );
  const $allHistoryBtn = document.querySelector('.allHistoryBtn');
  const $historyWithMeBtn = document.querySelector('.historyWithMeBtn');
  const $chatButton = document.querySelector('.chatbutton');
  const $userProfileConfirmModalMsg = document.querySelector(
    '.userProfile-confirmModalMsg',
  );
  const $userProfileConfirmModal = document.querySelector(
    '.userProfile-confirmModalContainer',
  );
  const $divide = document.querySelector('.divide');
  console.log($userProfileConfirmModal);
  console.log($userProfileConfirmModalMsg);
  const $userProfileFriendRequestBtn = document.querySelector(
    '.userProfile-friendRequestBtn',
  );
  $userProfileCloseBtn.addEventListener('click', () => {
    $allHistoryBtn.classList.remove('selected');
    $historyWithMeBtn.classList.remove('selected');
    $userProfileFriendRequestBtn.style.display = 'flex';
    $historyWithMeBtn.style.display = 'inline';
    $divide.style.display = 'inline';
    $userProfileModalContainer.classList.remove('active');
    // window.history.pushState(null, null, '/'); // '/gameScreenURL'은 게임 화면의 URL로 변경해야 합니다.
    // router();
  });
  $allHistoryBtn.addEventListener('click', () => {
    const user = JSON.parse(
      $userProfileFriendRequestBtn.getAttribute('userProfileData'),
    );
    userProfileData(user.id, 0, 1);
    $allHistoryBtn.classList.add('selected');
    $historyWithMeBtn.classList.remove('selected');
  });
  $historyWithMeBtn.addEventListener('click', () => {
    const user = JSON.parse(
      $userProfileFriendRequestBtn.getAttribute('userProfileData'),
    );
    userProfileData(user.id, 1, 1);
    $historyWithMeBtn.classList.add('selected');
    $allHistoryBtn.classList.remove('selected');
  });
  $chatButton.addEventListener('click', () => {
    $userProfileModalContainer.classList.remove('active');
  });
  $userProfileFriendRequestBtn.addEventListener('click', () => {
    const user = JSON.parse(
      $userProfileFriendRequestBtn.getAttribute('userProfileData'),
    );
    console.log(user);
    if (user.friend_status === 0)
      $userProfileConfirmModalMsg.innerHTML = `Would you like to send a friend request to ${user.nickname}?`;
    else if (user.friend_status === 1)
      $userProfileConfirmModalMsg.innerHTML = `Are you sure you want to delete friend request sent to ${user.nickname}?`;
    $userProfileConfirmModal.setAttribute('data-user', JSON.stringify(user));
    $userProfileConfirmModal.classList.add('active');
  });
});
