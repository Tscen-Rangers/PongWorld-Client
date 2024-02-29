import AbstractView from '../../AbstractView.js';
import {getToken, setToken} from '../../tokenManager.js';

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
      </div>
      <a id="signUpPlayGameBtn" href="/home" data-spa>Play Game</a>
		`;
  }

  async afterRender() {
    // headers: {
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${accessToken}` // 여기에 액세스 토큰 포함
    // }
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
