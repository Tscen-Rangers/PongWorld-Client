import {friendRequest, deleteFriend} from './FriendsRestApi.js';
import {userProfileData} from './PlayersRestApi.js';
import {router} from './route.js';

const confirmModal = document.querySelector(
  '.userProfile-confirmModalContainer',
);
const confirmBtn = document.querySelector('.userProfile-confirmBtn');
const cancelBtn = document.querySelector('.userProfile-cancelBtn');

document.addEventListener('DOMContentLoaded', () => {
  cancelBtn.addEventListener('click', () => {
    confirmModal.classList.remove('active');
  });

  confirmBtn.addEventListener('click', async e => {
    const data = JSON.parse(confirmModal.getAttribute('data-user'));
    if (data.friend_status === 0) {
      if (await friendRequest(data.id)) {
        userProfileData(data.id, 0, 2);
      }
    } else {
      if (await deleteFriend(data.friend_id)) {
        userProfileData(data.id, 0, 2);
      }
    }
    router();
    confirmModal.classList.remove('active');
  });
});
