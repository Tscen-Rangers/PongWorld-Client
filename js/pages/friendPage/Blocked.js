import AbstractView from '../../AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Blocked');
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
    <div class="contentsContainer">
    <div style="padding:10px 20px; height:100%;">
    <h1 id="friendspageTitle">Friends</h1>
    <div class="friendsHeader">
    <nav class="friends_nav">
    <a class="friends_nav__link"  data-spa href="/friends">friends</a>
    <a class="friends_nav__link"  data-spa href="/friends/search">Search</a>
    <a class="friends_nav__link" style="background-color:rgba(111,111,111,0.38)"data-spa href="/friends/blocked">blocked</a>
    <a class="friends_nav__link"  data-spa href="/friends/request">request</a>
    </nav>
    <div class="searchBarContainer">
    <div class="searchBar">
    <input type="text" name="search"/>
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#979191" stroke-miterlimit="10" stroke-width="32" d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64Z"/><path fill="none" stroke="#979191" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"/></svg>
    </div>
    </div>
    </div>
    <div class="friendListContainer">
    <div class="friendList">
    <div class="friendProfile"> </div>
    <text class="blockText">unblock</text>
    </div>
    <div class="friendList">
    <div class="friendProfile"> </div>
    <text class="blockText">unblock</text>
    </div> 
    <div class="friendList">
    <div class="friendProfile"> </div>
    <text class="blockText">unblock</text>
    </div>
    </div>
    </div>
    </div>
		`;
  }
}
