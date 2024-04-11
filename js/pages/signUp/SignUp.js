import AbstractView from '../../AbstractView.js';
import {getToken, setToken, refreshAccessToken} from '../../tokenManager.js';
import {router} from '../../route.js';
import {setSignUpCompleted, isSignUpCompleted} from '../../signUpCompleted.js';
import API_URL from '../../../config.js';

function locationHrefToHome() {
  window.history.pushState(null, null, '/home');
  router();
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('PongWorldㅣSignUp');
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
  }

  async getHtml() {
    return `
			<div id="signUpContainer">
        <div id="signUpPhotoContainer">
          <img id="signUpPhoto" src=${this.user.profile_img}>
          <input id="signUpImageInput" type="file" accept = "image/*" hidden>
        </div >
        <div id="signUpInfoContainer">
          <input id="signUpNickNameInput" placeholder=${this.user.nickname}>
          You can change your nickname and profile picture.
        </div>
        <div id="errorMsg"></div>
      </div>
      <a id="signUpPlayGameBtn">Play Game</a>
		`;
  }

  async afterRender() {
    const $playGameBtn = document.getElementById('signUpPlayGameBtn');
    const $nickNameInput = document.getElementById('signUpNickNameInput');
    const $imageInput = document.getElementById('signUpImageInput');
    const $errorMsg = document.getElementById('errorMsg');

    const patchUserData = async formData => {
      try {
        const res = await fetch(`${API_URL}/players/setting/${this.user.id}/`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          const user = JSON.parse(sessionStorage.getItem('user'));
          user['intro'] = data.data.intro;
          user['nickname'] = data.data.nickname;
          user['profile_img'] = data.data.profile_img;
          sessionStorage.setItem('user', JSON.stringify(user));
          setSignUpCompleted(true);
          locationHrefToHome();
        } else {
          if (data.status === 401) {
            await refreshAccessToken();
            patchUserData(formData);
          } else $errorMsg.innerText = data.data.nickname[0];
        }
      } catch (error) {
        console.log(error);
      }
    };

    // 회원가입 절차를 이미 완료했는지 확인
    if (isSignUpCompleted()) {
      if (
        window.confirm(
          'You have already completed the registration process. Would you like to stay on this page?',
        )
      ) {
        locationHrefToHome();
      } else {
        window.history.pushState(null, null, '/');
        router();
      }
    }

    $playGameBtn.addEventListener('click', async e => {
      if (!$nickNameInput.value.length && !$imageInput.files[0]) {
        setSignUpCompleted(true);
        locationHrefToHome();
      }

      const formData = new FormData();
      if ($imageInput.files[0])
        formData.append('profile_img', $imageInput.files[0]);
      if ($nickNameInput.value.length)
        formData.append('nickname', $nickNameInput.value);
      await patchUserData(formData);
    });

    document.getElementById('signUpPhoto').addEventListener('click', () => {
      document.getElementById('signUpImageInput').click();
    });

    document
      .getElementById('signUpImageInput')
      .addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            document.getElementById('signUpPhoto').src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
  }
}
