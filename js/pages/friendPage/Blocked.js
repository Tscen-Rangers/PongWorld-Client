import AbstractView from '../../AbstractView.js';

const users = [
  {
    name: 'junpark',
    state: true,
  },
  {
    name: 'hacho',
    state: true,
  },
  {
    name: 'hacho',
    state: true,
  },
  {
    name: 'hacho',
    state: true,
  },
  {
    name: 'hacho',
    state: true,
  },
  {
    name: 'hacho',
    state: true,
  },
  {
    name: 'hacho',
    state: true,
  },
  {
    name: 'hacho',
    state: true,
  },
];

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Blocked');
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
    <div class="contentsContainer">
    <div class="friendContainer">
    <h1 id="friendspageTitle">Friends</h1>
    <div class="friendsHeader">
    <nav class="friends_nav">
    <a class="friends_nav__link"  data-spa href="/friends">friends</a>
    <a class="friends_nav__link"  data-spa href="/friends/search">Search</a>
    <a class="friends_nav__link" style="background-color:rgb(185, 185, 185);"data-spa href="/friends/blocked">blocked</a>
    <a class="friends_nav__link" id="request_nav__link" data-spa href="/friends/request">request<div class="requestBadge"><div class="requestBadgeInner"></div></div></a>
    </nav>
    <div class="searchBarContainer">
    <div class="searchBar">
    <input type="text" name="search"/>
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#979191" stroke-miterlimit="10" stroke-width="32" d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64Z"/><path fill="none" stroke="#979191" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"/></svg>
    </div>
    </div>
    </div>
    <div class="friendListContainer">
    </div>
    </div>
    </div>
		`;
  }

  updateUserList() {
    const friendListContainer = document.querySelector('.friendListContainer');
    friendListContainer.innerHTML = `${users
      .map(
        (user, index) => `
    <div class="friendList" key=${index}>
      <div class="friendProfile">
        <div class="friendProfileImg">
        ${user.state ? '<img class="onlineImg" src="/public/online.png"/>' : ''}
        </div>
        <div class="friendname">${user.name}</div>
      </div>
      <text class="blockText" data-key="${index}">unblock</text>
    </div>
    `,
      )
      .join('')}`;
    this.bindUserListEvents();
  }

  bindUserListEvents() {
    // 이벤트 리스너를 여기서 바인딩
    const blockBtns = document.querySelectorAll('.blockText');
    blockBtns.forEach(blockBtn => {
      blockBtn.addEventListener('click', e => {
        const index = e.target.dataset.key;
        users.splice(index, 1); // 상태 업데이트
        console.log(users);
        this.updateUserList();
      });
    });
  }

  afterRender() {
    const requestBadge = document.querySelector('.requestBadge');
    requestBadge.firstChild.innerText = localStorage.getItem('newRequest');
    if (parseInt(localStorage.getItem('newRequest')))
      requestBadge.classList.add('active');
    else requestBadge.classList.remove('active');
    this.updateUserList();
  }
}
