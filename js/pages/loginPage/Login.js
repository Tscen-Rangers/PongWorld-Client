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
			<a id="loginBtn" href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c63b5c4a6696ac3283b3ce23815d81eb8627df2b3e3ad479393791c7dbf5e55a&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2Fhome&response_type=code">
				<div style="display: flex; align-items: center; justify-content: center;">
					<span>Login&nbsp</span>
					<span style="font-size:17px;">with&nbsp&nbsp</span>
					<img id="logo42" src="/public/42_logo.svg"/>
					<span>&nbsp;OAuth</span>
				</div>
			</a>
		`;
  }
}
