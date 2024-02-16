import AbstractView from '../../AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('FriendRequest');
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
    <div class="contentsContainer">
    <div style="padding:10px 20px; height:100%; display:flex; flex-direction:column">
      <h1 id="friendspageTitle">Friends</h1>
      <div class="friendsHeader">
        <nav class="friends_nav">
          <a class="friends_nav__link" data-spa href="/friends">
            friends
          </a>
          <a class="friends_nav__link" data-spa href="/friends/search">
            Search
          </a>
          <a class="friends_nav__link" data-spa href="/friends/blocked">
            blocked
          </a>
          <a
            class="friends_nav__link"
            style="background-color:rgba(111,111,111,0.38)"
            data-spa
            href="/friends/request">
            request
          </a>
        </nav>
        <div class="searchBarContainer"></div>
      </div>
      <div class="requestContainer">
      <div class="recievedRequestContainer">
        <text class="recievedTitle">recieved<text/>
        </div>
        <div class="sentRequestContainer">
        <text class="sentTitle">sent<text/></div>
      </div>
    </div>
  </div>
		`;
  }
}
