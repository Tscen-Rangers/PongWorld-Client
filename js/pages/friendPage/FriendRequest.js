import AbstractView from '../../AbstractView.js';
import {refreshAccessToken, getToken} from '../../tokenManager.js';
import {deleteFriend} from '../../FriendsRestApi.js';
let checkModalEvent = 0;

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('FriendRequest');
    this.recieved = null;
    this.sent = null;
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
    <div class="contentsContainer">
    <div class="friendContainer">
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
            style="background-color:rgb(185, 185, 185);"
            data-spa
            href="/friends/request">
            request
          </a>
        </nav>
        <div class="searchBarContainer"></div>
      </div>
      <div class="requestContainer">
        <div class="requestInnerContainer">
          <div class="recievedTitle">recieved</div>
          <div class="recievedListContainer" style="border:2px solid white; border-radius:10px; padding:20px">
          </div>
        </div>
        <div class="requestInnerContainer">
          <div class="sentTitle">sent</div>
          <div class="sentListContainer" style="border:2px solid white; border-radius:10px; padding:20px">
          </div>
              <div class="cancelRequestModalContainer">
      <div class="cancelRequestModal">
        <div class="cancelRequestModalMsg"></div>
        <div class="cancelRequestModalButtons">
          <button class="closeRequestModalBtn">cancel</button>
          <button class="cancelRequestModalBtn">yes</button>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  </div>
  
		`;
  }

  updateReceivedUserList() {
    const recievedListContainer = document.querySelector(
      '.recievedListContainer',
    );
    recievedListContainer.innerHTML = `${
      this.recieved
        ? this.recieved
            .map(
              (user, index) => `
        <div class="friendList" style="padding:0px 10px" key=${index}>
        <div class="friendProfile">
          <div class="friendProfileImg">
          <img class="profileImg" src=${user.user.profile_img}/> 
          ${
            user.user.is_online
              ? '<img class="onlineImg" src="/public/online.png"/>'
              : ''
          }</div> 
          <div class="friendname">${user.user.nickname}</div>
        </div>
        <div class="requestIcons">
        <svg class="rejectRecievedIcon" data-key='${index}' xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/></svg>
        <svg class="acceptIcon" data-key='${index}' xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7L10 17l-5-5"/></svg>
        </div>
    </div>
  `,
            )
            .join('')
        : ''
    }`;
    this.bindRecievedUserListEvents();
  }

  bindRecievedUserListEvents() {
    const acceptIcons = document.querySelectorAll('.acceptIcon');
    acceptIcons.forEach(acceptIcon => {
      acceptIcon.addEventListener('click', async e => {
        //친구에 추가
        const index = e.target.dataset.key;
        if (await this.acceptRequest(this.recieved[index].id)) {
          this.recieved.splice(index, 1);
          this.updateReceivedUserList();
        }
      });
    });
    const rejectRecievedIcons = document.querySelectorAll(
      '.rejectRecievedIcon',
    );
    rejectRecievedIcons.forEach(rejectRecievedIcon => {
      rejectRecievedIcon.addEventListener('click', e => {
        const index = e.target.dataset.key;
        // recieved.splice(index, 1);
        // this.updateReceivedUserList();
      });
    });
  }

  async recievedRequest() {
    const getRecieved = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/friends/followed/', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!res.ok) {
          if (res.status === 401) {
            await refreshAccessToken();
            return await getRecieved();
          }
          throw new Error(`Server responded with status: ${res.status}`);
        } else {
          const data = await res.json();
          this.recieved = data.data;
          console.log('recieved', this.recieved);
        }
      } catch (error) {
        console.log('get Recieved Request error', error);
      }
    };
    await getRecieved();
  }

  async acceptRequest(id) {
    const patchAccept = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/friends/follow/accept/${id}/`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
              friend_id: id,
            }),
          },
        );
        if (!res.ok) {
          if (res.status === 401) {
            await refreshAccessToken();
            return await patchAccept();
          } else {
            throw new Error(`Server responded with status: ${res.status}`);
          }
        } else {
          const data = await res.json();
          return 1;
        }
      } catch (error) {
        console.log('get Recieved Request error', error);
        return 0;
      }
    };
    return await patchAccept();
  }

  async deleteRecievedRequest() {}

  async sentRequest() {
    const getSent = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/friends/following/', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!res.ok) {
          if (res.status === 401) {
            await refreshAccessToken();
            return await getSent();
          } else {
            throw new Error(`Server responded with status: ${res.status}`);
          }
        } else {
          const data = await res.json();
          this.sent = data.data;
          console.log(this.sent);
        }
      } catch (error) {
        console.log('get Sent Request error', error);
      }
    };
    await getSent();
  }

  updateSentUserList() {
    const sentListContainer = document.querySelector('.sentListContainer');
    sentListContainer.innerHTML = `${
      this.sent
        ? this.sent
            .map(
              (user, index) => `
       <div class="friendList" style="padding:0% 4%" key=${index}>
       <div class="friendProfile">
         <div class="friendProfileImg"> 
         <img class="profileImg" src=${user.user.profile_img}/>
         ${
           user.user.is_online
             ? '<img class="onlineImg" src="/public/online.png"/>'
             : ''
         }</div> 
         <div class="friendname">${user.user.nickname}</div>
       </div>
       <div class="requestIcons">
       <svg class="cancelSentIcon" data-key='${index}' xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/></svg>
       </div> 
   </div>
 `,
            )
            .join('')
        : ''
    }`;
    this.bindSentUserListEvents();
  }

  bindSentUserListEvents() {
    const cancelRequestModal = document.querySelector(
      '.cancelRequestModalContainer',
    );
    const cancelRequestModalMsg = document.querySelector(
      '.cancelRequestModalMsg',
    );
    const cancelSentIcons = document.querySelectorAll('.cancelSentIcon');
    cancelSentIcons.forEach(cancelSentIcon => {
      cancelSentIcon.addEventListener('click', e => {
        const index = e.currentTarget.dataset.key;
        const user = this.sent[index].user.nickname;
        cancelRequestModalMsg.innerHTML = `Are you sure you want to delete friend request sent to ${user}?`;
        cancelRequestModal.classList.add('active');
        cancelRequestModal.setAttribute('data-key', index);
      });
    });
  }

  async afterRender() {
    await this.recievedRequest();
    await this.sentRequest();
    const cancelRequestModal = document.querySelector(
      '.cancelRequestModalContainer',
    );
    const cancelRequestModalBtn = document.querySelector(
      '.cancelRequestModalBtn',
    );
    const closeRequestModalBtn = document.querySelector(
      '.closeRequestModalBtn',
    );

    closeRequestModalBtn.addEventListener('click', () => {
      cancelRequestModal.classList.remove('active');
    });

    if (!checkModalEvent) {
      cancelRequestModalBtn.addEventListener('click', async e => {
        const index = cancelRequestModal.getAttribute('data-key');
        //친구요청 취소
        // sent.splice(index, 1);
        // console.log(this.sent[index].user);
        if (await deleteFriend(this.sent[index].id)) {
          this.sent.splice(index, 1);
          this.updateSentUserList();
        }
        cancelRequestModal.classList.remove('active');
      });
    }
    this.updateReceivedUserList();
    this.updateSentUserList();
  }
}
