import {userProfileData} from '../PlayersRestApi.js';
import AbstractModal from './AbstractModal.js';
import ConfirmModal from './ConfirmModal.js';

class UserProfileModal extends AbstractModal {
  constructor() {
    super();
  }

  async getHtml() {
    return `
    <div class="modalBack">
      <div class="modal user-profile-modal">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="userProfileCloseBtn"
          width="3em"
          height="3em"
          viewBox="0 0 16 16">
          <path
            fill="currentColor"
            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8L4.646 5.354a.5.5 0 0 1 0-.708" />
        </svg>
        <div class="userProfileName"></div>
        <div class="userProfileContainer">
          <div class="userProfileImgContainer">
            <img class="userProfileImg" src="/public/huipark.jpg" />
          </div>
          <img class="userProfileOnlineImg" src="/public/online.png" />
          <div class="userProfile-card">
            <p id="userProfileIntro"></p>
          </div>
        </div>
        <div class="userProfileStats">
          <div class="userProfile-stat">
            <span class="userProfile-stat-title">Ranking</span><br /><span
              class="userProfile-stat-value"
              id="userProfile-stat-ranking"
              >3</span
            >
          </div>
          <div class="userProfile-stat">
            <span class="userProfile-stat-title">Matches</span><br /><span
              class="userProfile-stat-value"
              id="userProfile-stat-matches"
              >3</span
            >
          </div>
          <div class="userProfile-stat">
            <span class="userProfile-stat-title">Win</span><br /><span
              class="userProfile-stat-value"
              id="userProfile-stat-win"
              >2</span
            >
          </div>
          <div class="userProfile-stat">
            <span class="userProfile-stat-title">Score</span><br /><span
              class="userProfile-stat-value"
              id="userProfile-stat-score"
              >1042</span
            >
          </div>
        </div>
        <div class="historyBtn">
          <text class="allHistoryBtn">최근 전적</text>
          <text class="divide" style="color: black">|</text>
          <text class="historyWithMeBtn">나와의 전적</text>
        </div>
        <div class="userProfile-match-history"></div>
        <div class="userProfileBtns">
          <a class="chatbutton" href="" data-spa
            >chat<svg
              class="chatMsgImage"
              style="margin-left: 5px"
              width="0.9em"
              height="0.9em"
              viewBox="0 0 19 19"
              xmlns="http://www.w3.org/2000/svg">
              <path
                class="directMsgPath"
                d="M18.5304 0.456145C18.3255 0.252659 18.0684 0.109609 17.7875 0.042717C17.5065 -0.0241752 17.2126 -0.0123206 16.9379 0.076978L1.08878 5.36364C0.794839 5.45678 0.535093 5.63494 0.342348 5.87562C0.149603 6.1163 0.0325054 6.40869 0.0058437 6.71588C-0.020818 7.02307 0.0441527 7.33127 0.19255 7.60156C0.340947 7.87184 0.566114 8.09209 0.839612 8.23448L7.41544 11.4845L10.6654 18.082C10.7961 18.3402 10.996 18.557 11.2428 18.7082C11.4896 18.8593 11.7735 18.9388 12.0629 18.9378H12.1713C12.4812 18.915 12.7771 18.7995 13.0205 18.6063C13.264 18.4131 13.4437 18.1511 13.5363 17.8545L18.8988 2.04864C18.9945 1.77557 19.0107 1.48092 18.9455 1.19898C18.8803 0.91705 18.7364 0.65944 18.5304 0.456145ZM1.76045 6.85864L15.5946 2.24364L7.91378 9.92448L1.76045 6.85864ZM12.1388 17.2261L9.06211 11.0728L16.7429 3.39198L12.1388 17.2261Z"
                fill="#636363" />
            </svg>
          </a>
          <div class="userProfile-friendRequestBtn">
            friend request
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M16.67 13.13C18.04 14.06 19 15.32 19 17v3h4v-3c0-2.18-3.57-3.47-6.33-3.87" />
              <circle
                cx="9"
                cy="8"
                r="4"
                fill="currentColor"
                fill-rule="evenodd" />
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4c-.47 0-.91.1-1.33.24a5.98 5.98 0 0 1 0 7.52c.42.14.86.24 1.33.24m-6 1c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4" />
            </svg>
          </div>
        </div>
      </div>
    </div>`;
  }

  profileCloseEventListener() {
    const $userProfileCloseBtn = document.getElementById('userProfileCloseBtn');
    $userProfileCloseBtn.addEventListener('click', () => {
      this.closeModal();
    });
  }

  onClickAllHistoryBtn() {
    this.$allHistoryBtn.addEventListener('click', () => {
      const user = JSON.parse(
        this.$userProfileFriendRequestBtn.getAttribute('userProfileData'),
      );
      userProfileData(user.id, 0, 1);
      this.$allHistoryBtn.classList.add('selected');
      this.$historyWithMeBtn.classList.remove('selected');
    });
  }

  onClickHistoryWithMeBtn() {
    this.$historyWithMeBtn.addEventListener('click', () => {
      const user = JSON.parse(
        this.$userProfileFriendRequestBtn.getAttribute('userProfileData'),
      );
      userProfileData(user.id, 1, 1);
      this.$historyWithMeBtn.classList.add('selected');
      this.$allHistoryBtn.classList.remove('selected');
    });
  }

  onClickChat() {
    const $chatButton = document.querySelector('.chatbutton');

    $chatButton.addEventListener('click', () => {
      this.closeModal();
    });
  }

  onClickFriendRequest() {
    this.$userProfileFriendRequestBtn.addEventListener('click', async () => {
      await new ConfirmModal().renderModal();
      const $userProfileConfirmModalMsg = document.querySelector(
        '.userProfile-confirmModalMsg',
      );
      const $modalBack = document.querySelector('.modalBack');
      const user = JSON.parse(
        this.$userProfileFriendRequestBtn.getAttribute('userProfileData'),
      );
      if (user.friend_status === 0)
        $userProfileConfirmModalMsg.innerHTML = `Would you like to send a friend request to ${user.nickname}?`;
      else if (user.friend_status === 1)
        $userProfileConfirmModalMsg.innerHTML = `Are you sure you want to delete friend request sent to ${user.nickname}?`;
      $modalBack.setAttribute('data-user', JSON.stringify(user));
    });
  }

  initializeDOM() {
    this.$allHistoryBtn = document.querySelector('.allHistoryBtn');
    this.$historyWithMeBtn = document.querySelector('.historyWithMeBtn');
    this.$userProfileFriendRequestBtn = document.querySelector(
      '.userProfile-friendRequestBtn',
    );
  }

  async renderModal() {
    await this.openModal(await this.getHtml(), true);

    this.initializeDOM();
    this.$allHistoryBtn.classList.add('selected');
    this.profileCloseEventListener();
    this.onClickAllHistoryBtn();
    this.onClickChat();
    this.onClickFriendRequest();
    this.onClickHistoryWithMeBtn();
  }
}

export default UserProfileModal;
