import AbstractView from '../../AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('PongWorldㅣ404');
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
			<div id="notFoundPageContainer">
				<img id="notFoundImgae" src="/public/404Image.png" />
        <nav id="notFoundPageNav">
          <a class="notFoundPageLink" href="/home" data-spa>Game</a> |
          <a class="notFoundPageLink" href="/chat" data-spa>Chat</a> |
          <a class="notFoundPageLink" href="/friends" data-spa>Friends</a> |
          <a class="notFoundPageLink" href="/mypage" data-spa>MyPage</a>
        </nav>
			</div>
		`;
  }

  afterRender() {}
}
