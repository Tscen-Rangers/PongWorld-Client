import AbstractView from '../../AbstractView.js';
import {getToken, refreshAccessToken} from '../../tokenManager.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('PongWorldㅣMypage');
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.$myPageSettingIntro = null;
    this.$myPageSettingNickName = null;
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
    <div class="contentsContainer">
    <div id="myPageConatiner">
      <svg
      id="myPageSettingBtn"
      viewBox="0 0 1024 1024">
      <path
        fill="black"
        d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357 357 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a352 352 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357 357 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088l-24.512 11.968a294 294 0 0 0-34.816 20.096l-22.656 15.36l-116.224-25.088l-65.28 113.152l79.68 88.192l-1.92 27.136a293 293 0 0 0 0 40.192l1.92 27.136l-79.808 88.192l65.344 113.152l116.224-25.024l22.656 15.296a294 294 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152l24.448-11.904a288 288 0 0 0 34.752-20.096l22.592-15.296l116.288 25.024l65.28-113.152l-79.744-88.192l1.92-27.136a293 293 0 0 0 0-40.256l-1.92-27.136l79.808-88.128l-65.344-113.152l-116.288 24.96l-22.592-15.232a288 288 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384a192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256a128 128 0 0 0 0-256"
      />
      </svg>
      <div class="profile-container">
        <img src=${
          this.user.profile_img
        } class="myPageProfileImg" alt="Player 1 Image">
        <div  class="profile-string">
          <div class="profile-name">
            ${this.user.nickname}
          </div>
          <div class="profile-card">
            <p id="myPageIntro">${this.user.intro}</p>
          </div>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><span class="stat-title">Ranking</span><br><span class="stat-value">3</span></div>
        <div class="stat"><span class="stat-title">Matches</span><br><span class="stat-value">3</span></div>
        <div class="stat"><span class="stat-title">Win</span><br><span class="stat-value">2</span></div>
        <div class="stat"><span class="stat-title">Score</span><br><span class="stat-value">1042</span></div>
      </div>
      <div class="match-history">
        <div class="match">
          <img src="../public/hacho.png" class="player-image" alt="Player 1 Image">
          <img src="../public/jimin.png" class="player-image" alt="Player 2 Image">
          <span class="players">hacho VS jimpark</span>
          <span class="score"><span class="score-first">3</span>:2</span>
          <span class="result">win</span>
          <span class="time-ago">2 days ago</span>
        </div>
        <div class="match">
          <img src="../public/hacho.png" class="player-image" alt="Player 1 Image">
          <img src="../public/jimin.png" class="player-image" alt="Player 2 Image">
          <span class="players">hacho VS jimpark</span>
          <span class="score"><span class="score-first">1</span>:2</span>
          <span class="result">lose</span>
          <span class="time-ago">3 days ago</span>
        </div>
        <div class="match">
          <img src="../public/hacho.png" class="player-image" alt="Player 1 Image">
          <img src="../public/jimin.png" class="player-image" alt="Player 2 Image">
          <span class="players">hacho VS jimpark</span>
          <span class="score"><span class="score-first">0</span>:2</span>
          <span class="result">win</span>
          <span class="time-ago">4 days ago</span>
        </div>
      </div>
    </div>
    </div>
    <div id="myPageSettingModalContainer">
      <div id="myPageSettingModal">
        <div id="myPageInfoSection">
          <form id="myPageSettingForm">
            <input class="myPageSettingInputs" id="myPageSettingProfileImage" type="image" id="profileImg" src=${
              this.user.profile_img
            } />
            <input id="myPageSettingFileInput" type="file" accept="image/*"  hidden/>
            <span>choose profile image</span>
            <input class="myPageSettingInputs" id="myPageSettingNickName" placeholder=${
              this.user.nickname
            } />
            <input class="myPageSettingInputs" id="myPageSettingIntro" placeholder=${
              this.user.intro.length ? this.user.intro : 'intro...'
            } />
          </form>
        </div>
        <div id="myPageBtnsSection">
          <button class="myPageSettingBtns">Two-factor authentication</button>
          <button class="myPageSettingBtns">logout</button>
          <button class="myPageSettingBtns">delete account</button>
        </div>
        <button id="myPageSettingUpdateBtn">update</button>
      </div>
    </div>
  `;
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
      if (res.ok) {
        const data = await res.json();
        const user = JSON.parse(sessionStorage.getItem('user'));
        user['intro'] = data.data.intro;
        user['nickname'] = data.data.nickname;
        user['profile_img'] = data.data.profile_img;
        this.user = user;
        sessionStorage.setItem('user', JSON.stringify(user));
        this.updateUI(user);
        this.$myPageSettingNickName.value = '';
        this.$myPageSettingIntro.value = '';
        document
          .getElementById('myPageSettingModalContainer')
          .classList.remove('active');
      } else {
        if (res.status === 401) {
          await refreshAccessToken();
          return this.update(formData);
        } else {
          console.log('MyPage Setting Update Error : ', await res.json());
        }
      }
    } catch (error) {
      console.log('MyPage Setting Update Error : ', error);
    }
  }

  updateUI(user) {
    const $myPageNickName = document.querySelector('.profile-name');
    const $myPageIntro = document.querySelector('#myPageIntro');
    const $myPageProfileImg = document.querySelector('.myPageProfileImg');
    const $myPageSettingNickName = document.getElementById(
      'myPageSettingNickName',
    );
    const $myPageSettingIntro = document.getElementById('myPageSettingIntro');

    $myPageNickName.textContent = user.nickname;
    $myPageIntro.textContent = user.intro;
    $myPageProfileImg.src = user.profile_img;
    $myPageSettingNickName.placeholder = user.nickname;
    $myPageSettingIntro.placeholder = user.intro;
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
      console.log(123123);
    });

    $myPageSettingModalContainer.addEventListener('click', e => {
      if (e.target === $myPageSettingModalContainer)
        $myPageSettingModalContainer.classList.remove('active');
    });
  }

  afterRender() {
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
    const $myPageSettingIntro = document.getElementById('myPageSettingIntro');
    this.$myPageSettingNickName = $myPageSettingNickName;
    this.$myPageSettingIntro = $myPageSettingIntro;

    $myPageSettingUpdateBtn.addEventListener('click', () => {
      this.onClickUpdate($myPageSettingFileInput);
    });

    $myPageSettingInputs.forEach((input, idx) => {
      input.addEventListener('click', e => {
        e.preventDefault();
        if (idx === 0) $myPageSettingFileInput.click();
      });
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

    this.onClickSettingBtn();
  }
}
