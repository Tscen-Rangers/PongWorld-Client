import AbstractView from '../../AbstractView.js';
import {getToken, refreshAccessToken} from '../../tokenManager.js';
import {responseBattleRequest} from '../../battleResponseEventHandler.js';
import {checkConnectionSocket} from '../../webSocketManager.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('PongWorldㅣMypage');
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.$myPageSettingIntro = null;
    this.$myPageSettingNickName = null;
    this.$errorMessage = null;
    this.profileInfo = null;
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
    <div class="contentsContainer">
    <div id="myPageConatiner">
    </div>
    <div id="myPageSettingModalContainer">
      <div id="myPageSettingModal">
        <div id="myPageInfoSection">
          <form id="myPageSettingForm">
            <img class="myPageSettingInputs" id="myPageSettingProfileImage"  id="profileImg" src=${this.user.profile_img} />
            <input id="myPageSettingFileInput" type="file" accept="image/*"  hidden/>
            <span style="margin-bottom:5px;">choose profile image</span>
            <input class="myPageSettingInputs" type="text" id="myPageSettingNickName" placeholder=${this.user.nickname} autocomplete='off' />
            <input class="myPageSettingInputs" type="text" id="myPageSettingIntro" value="${this.user.intro}" maxlength="30" autocomplete='off'/>
            <p id="errorMessage"></p>
          </form>
        </div>
        <div id="myPageBtnsSection">
          <button id="twoFactorAuthButton" class="myPageSettingBtns">Two-factor authentication</button>
          <button id="logoutBtn" class="myPageSettingBtns">logout</button>
          <button id="deleteAccountButton" class="myPageSettingBtns">delete account</button>
        </div>
        <button id="myPageSettingUpdateBtn">update</button>
      </div>
    </div>
    </div>
    <div id="twoFactorAuthModal" class="modal" style="display:none;">
      <div class="twoFactorAuthContent">
        <span class="twoFactorAuthclose">&times;</span>
        <h2><i class="fas fa-envelope"></i> 본인확인(메일)</h2>
        <div class="sendAndInput">
          <input type="text" id="code" placeholder="인증 코드 입력">
          <button id="sendEmailButton">메일 전송</button>
        </div>
        <button id="verifyCodeButton">인증 확인</button>
        <p style="color: red" id="error"></p>
      </div>
    </div>
  `;
  }

  updateMyPage() {
    const myPageConatiner = document.querySelector('#myPageConatiner');
    myPageConatiner.innerHTML = `
<svg
id="myPageSettingBtn"
viewBox="0 0 1024 1024">
<path
  fill="black"
  d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357 357 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a352 352 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357 357 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088l-24.512 11.968a294 294 0 0 0-34.816 20.096l-22.656 15.36l-116.224-25.088l-65.28 113.152l79.68 88.192l-1.92 27.136a293 293 0 0 0 0 40.192l1.92 27.136l-79.808 88.192l65.344 113.152l116.224-25.024l22.656 15.296a294 294 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152l24.448-11.904a288 288 0 0 0 34.752-20.096l22.592-15.296l116.288 25.024l65.28-113.152l-79.744-88.192l1.92-27.136a293 293 0 0 0 0-40.256l-1.92-27.136l79.808-88.128l-65.344-113.152l-116.288 24.96l-22.592-15.232a288 288 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384a192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256a128 128 0 0 0 0-256"
/>
</svg>
<div class="profile-container">
<div class="profile-name">
${this.profileInfo.player.nickname}
</div>
  <div  class="profile-string">
  <div class="myPageProfileImgContainer">
    <img src=${
      this.profileInfo.player.profile_img
    } class="myPageProfileImg" alt="Player 1 Image" />
  </div>
    <div class="profile-card">
      <p id="myPageIntro">${this.profileInfo.player.intro}</p>
    </div>
  </div>
</div>
<div class="stats">
  <div class="stat"><span class="stat-title">Ranking</span><br /><span class="stat-value" id="myPageRanking">${
    this.profileInfo.player.ranking
  }</span></div>
  <div class="stat"><span class="stat-title">Matches</span><br /><span class="stat-value" id="myPageMatches">${
    this.profileInfo.player.matches
  }</span></div>
  <div class="stat"><span class="stat-title">Win</span><br /><span class="stat-value" id="myPageWin">${
    this.profileInfo.player.wins
  }</span></div>
  <div class="stat"><span class="stat-title">Score</span><br /><span class="stat-value" id="myPageScore">${
    this.profileInfo.player.total_score
  }</span></div>
</div>
<div class="match-history">
${
  this.profileInfo.games !== 'No game'
    ? this.profileInfo.games
        .map(
          (game, index) => `
<div class="match">
    <div id="myPageMatchImg">
      <img src=${
        game.player1.player_profile_img
      } class="player-image" alt="Player 1 Image" />
      <img src=${
        game.player2.player_profile_img
      } class="player-image" alt="Player 2 Image" />
    </div>
      <div class="players">${game.player1.nickname} VS ${
            game.player2.nickname
          }</div>
      <div class="score"><text style="color: ${
        game.player1_score === 10 ? 'black' : 'white'
      }">${game.player1_score}</text> &nbsp;: &nbsp;<text style=color: ${
            game.player2_score === 10 ? 'black' : 'white'
          }>${game.player2_score}</text></div>
      <div class="result">${game.is_win ? 'win' : 'lose'}</div>
      <div class="time-ago">${game.date}</div>
  </div>
  ${
    index !== this.profileInfo.games.length - 1
      ? ` <div style="width:100%; min-height:2px; background-color:rgba(255,255,255,0.4); box-shadow: 0px 2px 1px 1px rgba(111, 111, 111, 0.3);
    }"></div>`
      : ''
  }
`,
        )
        .join('')
    : '<div style="height:100%; text-align:center; font-size:1.4rem; color:darkgrey">No game records found</div>'
}
</div>
</div>`;
  }

  async getProfile() {
    try {
      const res = await fetch('http://127.0.0.1:8000/players/profile/', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          await refreshAccessToken();
          return await this.getProfile();
        } else throw new Error(`Server responded with status: ${res.status}`);
      } else {
        const data = await res.json();
        this.profileInfo = data.data;
        console.log(this.profileInfo);
      }
    } catch (error) {
      console.log('get myProfile error', error);
    }
  }

  async update(formData) {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/players/setting/${this.user.id}/`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        },
      );
      const data = await res.json();
      if (res.ok) {
        this.updateUserInfo(data);
        this.closeMyPageSettingModal();
      } else {
        if (res.status === 401) {
          await refreshAccessToken();
          return this.update(formData);
        } else if (res.status === 400) {
          this.errorMsgHandler(data);
        } else {
          console.log('MyPage Setting Update Error : ', await res.json());
        }
      }
    } catch (error) {
      console.log('MyPage Setting Update Error : ', error);
    }
  }

  errorMsgHandler(data) {
    const $errorMessage = document.getElementById('errorMessage');
    $errorMessage.textContent = data.data.nickname[0];
  }

  updateUserInfo(data) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    user['intro'] = data.data.intro;
    user['nickname'] = data.data.nickname;
    user['profile_img'] = data.data.profile_img;
    sessionStorage.setItem('user', JSON.stringify(user));
    this.user = user;
    this.updateUI(user);
  }

  closeMyPageSettingModal() {
    this.$myPageSettingNickName.value = '';
    this.$errorMessage.textContent = '';
    document
      .getElementById('myPageSettingModalContainer')
      .classList.remove('active');
  }

  updateUI(user) {
    console.log(user);
    const $myPageNickName = document.querySelector('.profile-name');
    const $myPageIntro = document.querySelector('#myPageIntro');
    const $myPageProfileImg = document.querySelector('.myPageProfileImg');
    const $myPageSettingNickName = document.getElementById(
      'myPageSettingNickName',
    );
    const $myPageSettingIntro = document.getElementById('myPageSettingIntro');
    console.log(user);

    $myPageNickName.textContent = user.nickname;
    $myPageIntro.textContent = user.intro;
    $myPageProfileImg.src = user.profile_img;
    $myPageSettingNickName.placeholder = user.nickname;
    $myPageSettingIntro.value = user.intro;
  }

  async onClickUpdate($fileInput) {
    const formData = new FormData();

    if (this.$myPageSettingNickName.value.length)
      formData.append('nickname', this.$myPageSettingNickName.value);
    if ($fileInput.files[0])
      formData.append('profile_img', $fileInput.files[0]);
    if (this.$myPageSettingIntro.value.length)
      formData.append('intro', this.$myPageSettingIntro.value);

    await this.update(formData);
  }

  onClickSettingBtn() {
    const $myPageSettingBtn = document.getElementById('myPageSettingBtn');
    const $myPageSettingModalContainer = document.getElementById(
      'myPageSettingModalContainer',
    );

    $myPageSettingBtn.addEventListener('click', () => {
      $myPageSettingModalContainer.classList.add('active');
      console.log(this.user);
    });

    $myPageSettingModalContainer.addEventListener('click', e => {
      if (e.target === $myPageSettingModalContainer)
        this.closeMyPageSettingModal();
    });
  }

  myPageSettingModalEvent() {
    const $myPageSettingInputs = document.querySelectorAll(
      '.myPageSettingInputs',
    );
    const $myPageSettingFileInput = document.getElementById(
      'myPageSettingFileInput',
    );
    const $myPageSettingUpdateBtn = document.getElementById(
      'myPageSettingUpdateBtn',
    );
    const $myPageSettingNickName = document.getElementById(
      'myPageSettingNickName',
    );
    const $myPageSettingForm = document.getElementById('myPageSettingForm');
    const $myPageSettingIntro = document.getElementById('myPageSettingIntro');
    const $errorMessage = document.getElementById('errorMessage');
    this.$errorMessage = $errorMessage;
    this.$myPageSettingNickName = $myPageSettingNickName;
    this.$myPageSettingIntro = $myPageSettingIntro;

    this.onClickSettingBtn();

    $myPageSettingUpdateBtn.addEventListener('click', () => {
      this.onClickUpdate($myPageSettingFileInput);
    });

    $myPageSettingForm.addEventListener('submit', e => {
      e.preventDefault();
    });

    $myPageSettingInputs[0].addEventListener('click', () => {
      $myPageSettingFileInput.click();
    });

    $myPageSettingFileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          document.getElementById('myPageSettingProfileImage').src =
            e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  async updateUserProfile() {
    const userProfile = await this.getUserProfile();
    const $matches = document.getElementById('myPageMatches');
    const $win = document.getElementById('myPageWin');
    const $score = document.getElementById('myPageScore');
    const $ranking = document.getElementById('myPageRanking');

    $matches.innerHTML = userProfile.player.matches;
    $ranking.innerHTML = userProfile.player.ranking;
    $win.innerHTML = userProfile.player.wins;
    $score.innerHTML = userProfile.player.total_score;
  }

  async sendEmail() {
    const accessToken = getToken();
    try {
      const response = await fetch('http://localhost:8000/tcen-auth/verify/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        alert('인증 이메일이 발송되었습니다.');
      } else {
        console.error('이메일 발송 실패.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async verifyCode() {
    const code = document.getElementById('code').value;
    const accessToken = getToken();
    try {
      const response = await fetch('http://localhost:8000/tcen-auth/verify/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: code }),
      });
      if (response.ok) {
        alert('인증 성공');
        // 인증 성공 후 로직, 예: 모달 닫기
      } else {
        document.getElementById('error').textContent = '인증 실패';
      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('error').textContent = '오류 발생';
    }
  }

  async TwoFactorAuthentication() {
    const twoFactorAuthButton = document.querySelector('#twoFactorAuthButton');
    const twoFactorAuthModal = document.getElementById('twoFactorAuthModal');
    const sendEmailButton = document.getElementById('sendEmailButton');
    const verifyCodeButton = document.getElementById('verifyCodeButton');
    const closeModal = document.querySelector('.twoFactorAuthclose');
  
    twoFactorAuthButton.addEventListener('click', () => {
      twoFactorAuthModal.style.display = 'block';
    });
  
    closeModal.addEventListener('click', () => {
      twoFactorAuthModal.style.display = 'none';
      document.getElementById('code').value = ''; // 인증 코드 입력 필드 초기화
      document.getElementById('error').textContent = ''; // 인증 실패 메시지 초기화
    });
  
    sendEmailButton.addEventListener('click', () => {
      this.sendEmail();
    });
  
    verifyCodeButton.addEventListener('click', () => {
      this.verifyCode();
    });
  }

  async AccountDeletion() {
    const deleteAccountButton = document.querySelector('#deleteAccountButton');
    const accessToken = getToken();
  
    deleteAccountButton.addEventListener('click', async () => {
      const confirmed = confirm('계정을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.');
      if (confirmed) {
        try {
          const response = await fetch('http://localhost:8000/tcen-auth/delete/', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
          });
          if (response.ok) {
            alert('계정이 성공적으로 삭제되었습니다.');
            window.location.href = 'http://localhost:5500'; // 계정 삭제 후 처리 로직
          } else {
            console.error('Failed to delete account.');
            alert('이메일 인증을 완료 후 계정을 삭제 할 수 있습니다.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('계정을 삭제하는 동안 오류가 발생했습니다.');
        }
      }
    });
  }

  async afterRender() {
    await this.getProfile();
    this.updateMyPage();
    await checkConnectionSocket(this.socketEventHandler.bind(this));
    // this.updateUserProfile();
    this.myPageSettingModalEvent();
    this.TwoFactorAuthentication();
    this.AccountDeletion();
    const logoutBtn = document.querySelector('#logoutBtn');
    logoutBtn.addEventListener('click', () => {});
  }
  async socketEventHandler(message) {
    responseBattleRequest(message);
  }
}
