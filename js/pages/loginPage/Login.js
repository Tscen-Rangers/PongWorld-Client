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
			<img id="stickImg" src="/public/stick.png" />
			<a id="loginBtn" href="/game" data-spa >
				42 Login
			</a>
		`;
  }
}