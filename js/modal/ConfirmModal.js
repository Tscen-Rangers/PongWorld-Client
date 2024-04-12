import {friendRequest, deleteFriend} from '../FriendsRestApi.js';
import {userProfileData} from '../PlayersRestApi.js';
import {router} from '../route.js';
import AbstractModal from './AbstractModal.js';

class ConfirmModal extends AbstractModal {
  constructor() {
    super();
  }

  async getHtml() {
    return `
<div class="modalBack">
	<div class="modal confirm-modal">
	  <div class="userProfile-confirmModalMsg"></div>
	  <div class="userProfile-confirmButtons">
		<button class="userProfile-cancelBtn">cancel</button>
		<button class="userProfile-confirmBtn">yes</button>
	  </div>
	</div>
  </div>`;
  }

  cancelBtnEventListener() {
    const cancelBtn = document.querySelector('.userProfile-cancelBtn');

    cancelBtn.addEventListener('click', () => {
      this.closeModal();
    });
  }

  confirmBtnEventListener() {
    const confirmBtn = document.querySelector('.userProfile-confirmBtn');
    const $modalBack = document.querySelector('.modalBack');

    confirmBtn.addEventListener('click', async e => {
      const data = JSON.parse($modalBack.getAttribute('data-user'));
      if (data.friend_status === 0) {
        if (await friendRequest(data.id)) {
          if (!sessionStorage.getItem('friendRequest'))
            userProfileData(data.id, 0, 2);
          else sessionStorage.removeItem('friendRequest');
        }
      } else {
        if (await deleteFriend(data.friend_id)) {
          if (!sessionStorage.getItem('friendRequest'))
            userProfileData(data.id, 0, 2);
          else sessionStorage.removeItem('friendRequest');
        }
      }
      router();
      this.closeModal();
    });
  }

  async openModal(html, backdropFlag) {
    const $testModal = document.getElementById('testModal');
    $testModal.classList.add('active');
    $testModal.insertAdjacentHTML('beforeend', html);
  }

  closeModal() {
    const $testModal = document.getElementById('testModal');
    const $target = $testModal.querySelector('.confirm-modal').parentNode;
    if ($target) {
      $target.remove();
    }
  }

  async renderModal() {
    await this.openModal(await this.getHtml(), false);

    this.cancelBtnEventListener();
    this.confirmBtnEventListener();
  }
}

export default ConfirmModal;
