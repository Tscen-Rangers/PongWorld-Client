import AbstractView from '../../AbstractView.js';
import {getToken, refreshAccessToken} from '../../tokenManager.js';
import {unblock} from '../../FriendsRestApi.js';
import {responseBattleRequest} from '../../battleResponseEventHandler.js';
import {checkConnectionSocket} from '../../WebSocket/webSocketManager.js';
import API_URL from '../../../config.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Blocked');
    this.users = null;
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
    <input type="text" id="searchBlockInput" name="search"/>
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
    friendListContainer.innerHTML = `${
      this.users
        ? this.users
            .map(
              (user, index) => `
    <div class="friendList" key=${index}>
      <div class="friendProfile">
        <div class="friendProfileImg">
        <img class="profileImg" src=${user.blocked.profile_img}>
        </div>
        <div class="friendname" >${user.blocked.nickname}</div>
      </div>
      <text class="blockText" data-key="${index}">unblock</text>
    </div>
    `,
            )
            .join('')
        : ''
    }`;
    this.bindUserListEvents();
  }

  async renderBlocked(name) {
    const url =
      name.length === 0
        ? `${API_URL}/block/search/`
        : `${API_URL}/block/search/${name}/`;
    const getBlocked = async () => {
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!res.ok) {
          if (res.status === 401) {
            await refreshAccessToken();
            return getBlocked();
          } else {
            throw new Error(`Server responded with status: ${res.status}`);
          }
        } else {
          const data = await res.json();
          this.users = data.data;
        }
      } catch (error) {
        console.log('get Blocked error', error);
      }
    };
    await getBlocked();
  }

  bindUserListEvents() {
    // 이벤트 리스너를 여기서 바인딩
    const blockBtns = document.querySelectorAll('.blockText');
    blockBtns.forEach(blockBtn => {
      blockBtn.addEventListener('click', async e => {
        const index = e.target.dataset.key;
        if (await unblock(this.users[index].blocked.id)) {
          this.users.splice(index, 1); // 상태 업데이트
          this.updateUserList();
        }
      });
    });
  }

  async afterRender() {
    await checkConnectionSocket(this.socketEventHandler.bind(this));
    await this.renderBlocked('');
    const searchBlockInput = document.querySelector('#searchBlockInput');

    searchBlockInput.addEventListener('keydown', async e => {
      if (e.keyCode === 13) {
        const query = e.target.value;
        await this.renderBlocked(query);
        this.updateUserList();
      }
    });
    const requestBadge = document.querySelector('.requestBadge');
    requestBadge.firstChild.innerText = sessionStorage.getItem('newRequest');
    if (parseInt(sessionStorage.getItem('newRequest')))
      requestBadge.classList.add('active');
    else requestBadge.classList.remove('active');
    this.updateUserList();
  }
  async socketEventHandler(message) {
    responseBattleRequest(message);
  }
}
