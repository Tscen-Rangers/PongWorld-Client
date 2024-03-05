import AbstractView from '../../AbstractView.js';

const users = [
  {
    name: 'jimpark',
    state: false,
    request: true,
    blocked: false,
  },
  {
    name: 'huipark',
    state: true,
    request: false,
    blocked: false,
  },
  {
    name: 'hwankim',
    state: true,
    request: false,
    blocked: false,
  },
  {
    name: 'jihyeole',
    state: false,
    request: true,
    blocked: false,
  },
  {
    name: 'yubchoi',
    state: true,
    request: false,
    blocked: false,
  },
];

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('SearchFriends');
    this.currentAction = '';
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
    <a class="friends_nav__link" style="background-color:rgb(185, 185, 185);" data-spa href="/friends/search">Search</a>
    <a class="friends_nav__link" data-spa href="/friends/blocked">blocked</a>
    <a class="friends_nav__link" id="request_nav__link" data-spa href="/friends/request">request      <div class="requestBadge"><div class="requestBadgeInner"></div></div></a>
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
    <div class="confirmModalContainer">
    <div class="confirmModal">
      <div class="confirmModalMsg"></div>
      <div class="confirmButtons">
        <button class="cancelBtn">cancel</button>
        <button class="confirmBtn">yes</button>
      </div>
    </div>
  </div>
    </div>
    </div>
		`;
  }

  updateBlockedUserList() {
    const friendListContainer = document.querySelector('.friendListContainer');
    friendListContainer.innerHTML = ` ${users
      .map(
        (user, index) => `
        <div class="friendList" key=${index}>
          <div class="friendProfile">
            <div class="friendProfileImg">
            <img class="profileImg" src="/public/huipark.jpg"/>
            ${
              user.state
                ? '<img class="onlineImg" src="/public/online.png"/>'
                : ''
            }
            </div>
            <div class="friendname">${user.name}</div>
          </div>
            <div class="searchOptionBtns">
            ${
              user.blocked
                ? ''
                : `<div class="searchOptionRequestBtn" id="friendRequestBtn" style='color: ${
                    user.request ? 'rgb(255, 0, 0)' : 'rgb(0,0,0)'
                  };' data-key='${index}'>
                    ${user.request ? 'request cancel' : 'friend request'}
                  </div>`
            }     
            <div class="searchOptionBlockBtn" data-key='${index}'> ${
          user.blocked ? 'unblock' : 'block'
        }</div>
            </div>
        </div>
      `,
      )
      .join('')}`;
    this.bindBlockedUserListEvents();
  }

  bindBlockedUserListEvents() {
    // 이벤트 리스너를 여기서 바인딩
    const confirmModal = document.querySelector('.confirmModalContainer');
    const confirmModalMsg = document.querySelector('.confirmModalMsg');
    const blockBtns = document.querySelectorAll('.searchOptionBlockBtn');
    blockBtns.forEach(blockBtn => {
      blockBtn.addEventListener('click', e => {
        const index = e.target.dataset.key;
        if (users[index].blocked === true) {
          users[index].blocked = false;
          users[index].request = false;
        } else {
          users[index].blocked = true;
        }
        this.updateBlockedUserList();
      });
    });

    const searchOptionRequestBtns = document.querySelectorAll(
      '.searchOptionRequestBtn',
    );
    searchOptionRequestBtns.forEach(searchOptionRequestBtn => {
      searchOptionRequestBtn.addEventListener('click', e => {
        const index = e.target.dataset.key;
        const user = users[index].name;
        if (users[index].request === false) {
          confirmModalMsg.innerHTML = `Would you like to send a friend request to ${user}?`;
        } else if (users[index].request === true) {
          confirmModalMsg.innerHTML = `Are you sure you want to delete friend request sent to ${user}?`;
        }
        this.currentAction = 'request';
        confirmModal.classList.add('active');
        confirmModal.setAttribute('data-key', index);
      });
    });
  }

  afterRender() {
    const confirmModal = document.querySelector('.confirmModalContainer');
    const confirmBtn = document.querySelector('.confirmBtn');
    const cancelBtn = document.querySelector('.cancelBtn');
    cancelBtn.addEventListener('click', () => {
      confirmModal.classList.remove('active');
    });

    confirmBtn.addEventListener('click', e => {
      const index = confirmModal.getAttribute('data-key');

      if (this.currentAction === 'request')
        users[index].request = !users[index].request;
      this.updateBlockedUserList(); // UI 업데이트
      confirmModal.classList.remove('active');
    });
    const requestBadge = document.querySelector('.requestBadge');
    requestBadge.firstChild.innerText = localStorage.getItem('newRequest');
    if (parseInt(localStorage.getItem('newRequest')))
      requestBadge.classList.add('active');
    else requestBadge.classList.remove('active');
    this.updateBlockedUserList();
  }
}
3;
