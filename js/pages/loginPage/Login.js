import AbstractView from '../../AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('PongWorldㅣLogin');
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
			<div id="loginHeaderContainer">
				<header id="loginHeader">PONG</br>WORLD</header>
				<p>|  Welcome to the Pong World !</p>
			</div>
			<img id="stickImg" src="/public/stick3.png" />
			<a id="loginBtn">
				<div style="display: flex; align-items: center; justify-content: center;">
					<span>Login&nbsp</span>
					<span style="font-size:17px;">with&nbsp&nbsp</span>
					<img id="logo42" src="/public/42_logo.svg"/>
					<span>&nbsp;OAuth</span>
				</div>
			</a>
		`;
  }

  async afterRender() {
    const $loginBtn = document.getElementById('loginBtn');

    $loginBtn.addEventListener('click', async e => {
      try {
        const res = await fetch(
          'https://b364-121-135-181-35.ngrok-free.app/tcen-auth/42-login/',
        );
        console.log(res);
        const data = await res.json();
        console.log(data);
        window.location.href = data.data.oauth_login_url;
      } catch (error) {
        console.log(error);
      }
    });
  }
}
