import AbstractView from '../../AbstractView.js';
import {getToken, refreshAccessToken} from '../../tokenManager.js';
import {
  block,
  unblock,
  deleteFriend,
  friendRequest,
} from '../../FriendsRestApi.js';
import {checkConnectionSocket} from '../../webSocketManager.js';
import {router} from '../../route.js';
import {responseBattleRequest} from '../../battleResponseEventHandler.js';
import {userProfileData} from '../../PlayersRestApi.js';
import API_URL from '../../../config.js';
export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('SearchFriends');
    this.currentAction = '';
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
    <a class="friends_nav__link" style="background-color:rgb(185, 185, 185);" data-spa href="/friends/search">Search</a>
    <a class="friends_nav__link" data-spa href="/friends/blocked">blocked</a>
    <a class="friends_nav__link" id="request_nav__link" data-spa href="/friends/request">request      <div class="requestBadge"><div class="requestBadgeInner"></div></div></a>
    </nav>
    <div class="searchBarContainer">
    <div class="searchBar">
    <input type="text" name="search" id="searchInput"/>
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

  updateBlockedUserList() {
    const friendListContainer = document.querySelector('.friendListContainer');
    // console.log(this.users);
    friendListContainer.innerHTML = ` ${
      this.users
        ? this.users
            .map(
              (user, index) => `
        <div class="friendList" key=${index}>
          <div class="friendProfile">
            <div class="friendProfileImg" >
            <img class="profileImg"  data-id='${user.id}' src=${
                user.profile_img
              }/>
            ${
              user.is_online
                ? '<img class="onlineImg" src="/public/online.png"/>'
                : ''
            }
            </div>
            <div class="friendname"  data-id='${user.id}'>${user.nickname}</div>
          </div>
            <div class="searchOptionBtns">
            <div class="searchOptionBlockBtn" data-key='${index}'> ${
                user.is_blocking ? 'unblock' : 'block'
              }</div>
            </div>
        </div>
      `,
            )
            .join('')
        : ''
    }`;
    this.bindBlockedUserListEvents();
  }

  bindBlockedUserListEvents() {
    // 이벤트 리스너를 여기서 바인딩
    const confirmModal = document.querySelector('.confirmModalContainer');
    const confirmModalMsg = document.querySelector('.confirmModalMsg');
    const blockBtns = document.querySelectorAll('.searchOptionBlockBtn');
    blockBtns.forEach(blockBtn => {
      blockBtn.addEventListener('click', async e => {
        const index = e.target.dataset.key;
        if (this.users[index].is_blocking === true) {
          if (await unblock(this.users[index].id)) {
            this.users[index].is_blocking = false;
            this.users[index].friend_status = 0;
          }
        } else {
          if (await block(this.users[index].id)) {
            this.users[index].is_blocking = true;
          }
        }
        this.updateBlockedUserList();
      });
    });

    const searchOptionRequestBtns = document.querySelectorAll(
      '.searchOptionRequestBtn',
    );
    // searchOptionRequestBtns.forEach(searchOptionRequestBtn => {
    //   searchOptionRequestBtn.addEventListener('click', e => {
    //     const index = e.target.dataset.key;
    //     const user = this.users[index].nickname;
    //     if (this.users[index].friend_status === 0) {
    //       confirmModalMsg.innerHTML = `Would you like to send a friend request to ${user}?`;
    //       this.currentAction = 'request';
    //     } else if (this.users[index].friend_status === 1) {
    //       confirmModalMsg.innerHTML = `Are you sure you want to delete friend request sent to ${user}?`;
    //       this.currentAction = 'cancel';
    //     }
    //     confirmModal.classList.add('active');
    //     confirmModal.setAttribute('data-key', index);
    //   });
    // });
    const $allHistoryBtn = document.querySelector('.allHistoryBtn');
    const profileImgs = document.querySelectorAll('.profileImg');
    profileImgs.forEach(profileImg => {
      profileImg.addEventListener('click', e => {
        const id = e.target.dataset.id;
        userProfileData(id, 0, 0);
        $allHistoryBtn.classList.add('selected');
        // userProfileModalContainer.classList.add('active');
      });
    });
    const friendNames = document.querySelectorAll('.friendname');
    friendNames.forEach(friendName => {
      friendName.addEventListener('click', e => {
        const id = e.target.dataset.id;
        userProfileData(id, 0, 0);
        $allHistoryBtn.classList.add('selected');
        // userProfileModalContainer.classList.add('active');
      });
    });
  }
  //친구요청 보내기
  // async friendRequest(id) {
  //   const sendRequest = async () => {
  //     try {
  //       const res = await fetch(`${API_URL}/friends/follow/${id}/`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${getToken()}`,
  //         },
  //         body: JSON.stringify({
  //           followed_id: id,
  //         }),
  //       });
  //       if (!res.ok) {
  //         if (res.status === 401) {
  //           await refreshAccessToken();
  //           return sendRequest();
  //         } else {
  //           throw new Error(`Server responded with status: ${res.status}`);
  //         }
  //       } else {
  //         const data = await res.json();
  //         return data.data.id;
  //       }
  //     } catch (error) {
  //       console.log('post friend request error', error);
  //       return 0;
  //     }
  //   };
  //   return await sendRequest();
  // }

  //모든 유저 렌더링 or 검색된 유저 렌더링
  async searchPlayers(name) {
    const url = name.length
      ? `${API_URL}/players/search/${name}/`
      : `${API_URL}/players/search/`;
    const getPlayers = async () => {
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!res.ok) {
          if (res.status === 401) {
            await refreshAccessToken();
            return getPlayers();
          }
        } else {
          const data = await res.json();
          this.users = data.data;
        }
        // this.users = data;
      } catch (error) {
        console.log('get searchPlayers error', error);
      }
    };
    await getPlayers();
  }

  async afterRender() {
    await checkConnectionSocket(this.socketEventHandler.bind(this));
    await this.searchPlayers('');
    // const confirmModal = document.querySelector('.confirmModalContainer');
    // const confirmBtn = document.querySelector('.confirmBtn');
    // const cancelBtn = document.querySelector('.cancelBtn');
    const searchInput = document.querySelector('#searchInput');

    searchInput.addEventListener('keydown', async e => {
      if (e.keyCode === 13) {
        const query = e.target.value;
        await this.searchPlayers(query);
        this.updateBlockedUserList();
      }
    });
    // cancelBtn.addEventListener('click', () => {
    //   confirmModal.classList.remove('active');
    // });

    // confirmBtn.addEventListener('click', async e => {
    //   const index = confirmModal.getAttribute('data-key');

    //   // 서버에서 friend_id 받아서 하기!
    //   if (this.currentAction === 'cancel') {
    //     if (await deleteFriend(this.users[index].friend_id))
    //       this.users[index].friend_status = 0;
    //   } else {
    //     let id = await friendRequest(this.users[index].id);
    //     if (id) {
    //       this.users[index].friend_status = 1;
    //       this.users[index].friend_id = id;
    //     }
    //   }
    //   this.updateBlockedUserList(); // UI 업데이트
    //   confirmModal.classList.remove('active');
    // });
    const requestBadge = document.querySelector('.requestBadge');
    requestBadge.firstChild.innerText = sessionStorage.getItem('newRequest');
    if (parseInt(sessionStorage.getItem('newRequest')))
      requestBadge.classList.add('active');
    else requestBadge.classList.remove('active');
    this.updateBlockedUserList();
  }

  async socketEventHandler(message) {
    responseBattleRequest(message);
  }
}
