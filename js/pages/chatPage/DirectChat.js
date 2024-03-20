import AbstractView from '../../AbstractView.js';
import {getToken, refreshAccessToken} from '../../tokenManager.js';
import cws from '../../WebSocket/ConnectionSocket.js';
import {checkConnectionSocket} from '../../webSocketManager.js';
import {responseBattleRequest} from '../../battleResponseEventHandler.js';
import {userProfileData} from '../../PlayersRestApi.js';
function findUser(id, rooms) {
  for (let i = 0; i < rooms.length; i++) {
    console.log(rooms[i]);
    if (rooms[i].user1 === id || rooms[i].user2 === id) return i;
  }
  return -1;
}
const $allHistoryBtn = document.querySelector('.allHistoryBtn');
export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('PongWorldㅣDirectChat');
    this.target = null;
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.nextChattingLog = null;
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
    <div class="contentsContainer">
    <div class="chatContainer">
      <div style="flex:0.35;">
        <div id="directChatHeader">
          <div style="height:32px">
            <h1 class="chatTitle">Chat</h1>
          </div>
          <nav class="chatNav">
            <a class="chat__nav" id="allChat" href="/chat" data-spa>
              all
            </a>
            <a
              class="chat__nav"
              id="directChat"
              href="/chat/direct"
              data-spa
              style="background-color:rgb(185, 185, 185)">
              direct
            </a>
          </nav>
        </div>
        <div class="chatLeftContainer" style="height: 85%;">
          <div class="chatUserInner"></div>
        </div>
      </div>
      <div class="chatRightContainer">
        <div class="chatRoom"></div>
        <form id="chattingForm">
          <input id="chattingInput" type="text" autocomplete="off" maxlength='300'/>
          <svg
            id="chattingSubmitImage"
            width="2rem"
            height="2rem"
            viewBox="0 0 32 32"
            fill="#ddd">
            <g>
              <path d="M16.693 7.667a1 1 0 0 0-1.386 0L9.994 12.78c-.649.624-.207 1.72.693 1.72h3.063a.25.25 0 0 1 .25.25v9.75a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-9.75a.25.25 0 0 1 .25-.25h3.063c.9 0 1.342-1.096.693-1.72z" />
              <path d="M6 1a5 5 0 0 0-5 5v20a5 5 0 0 0 5 5h20a5 5 0 0 0 5-5V6a5 5 0 0 0-5-5zM3 6a3 3 0 0 1 3-3h20a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" />
            </g>
          </svg>
        </form>
      </div>
    </div>
  </div>
		`;
  }

  async updateUserList(chattingRooms) {
    const chatUserInner = document.querySelector('.chatUserInner');

    chatUserInner.innerHTML = `${chattingRooms.data
      .map(room => {
        return `<div class="chatUserProfile" data-userid="${
          room.user1 === this.user.id ? room.user2 : room.user1
        }" data-chatroomid=${room.id}>
      <div class="chatUserProfileBlur"></div>
        <div class="chatUserInfo">
          <img class="directOnlineUserImage" src="/public/online.png" style="display : ${
            room.user1 === this.user.id
              ? room.user2_is_online
                ? 'block'
                : 'none'
              : room.user1_is_online
              ? 'block'
              : 'none'
          }"/>
          <img class="chatUserImage" data-id='${
            room.user1 === this.user.id ? room.user2 : room.user1
          }' src=${
          room.user1 === this.user.id
            ? room.user2_profile_img
            : room.user1_profile_img
        }/>
          <p class="chatUserName">${
            room.user1 === this.user.id
              ? room.user2_nickname
              : room.user1_nickname
          }</p>
        </div>
        <div class="unReadCount">${room.unread_count}</div>
        <div class="outDirectChatRoomContainer" data-chatroomid=${room.id}>
            <svg class="outDirectChatRoom" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 13.75V11H9.625V8.25H16.5V5.5L20.625 9.625L16.5 13.75ZM15.125 12.375V17.875H8.25V22L0 17.875V0H15.125V6.875H13.75V1.375H2.75L8.25 4.125V16.5H13.75V12.375H15.125Z"/>
            </svg>
        </div>
      </div>`;
      })
      .join('')}`;

    const $unReadCount = document.querySelectorAll('.unReadCount');
    const $chatUserProfiles = document.querySelectorAll('.chatUserProfile');
    this.$unReadCount = $unReadCount;
    this.$chatUserProfiles = $chatUserProfiles;
    console.log($chatUserProfiles);

    $unReadCount.forEach(e => {
      if (!Number(e.textContent)) e.style.opacity = 0;
    });

    if (Number($unReadCount.textContent)) $unReadCount;

    if (this.params.user && $chatUserProfiles.length) {
      let idx = findUser(Number(this.params.user), chattingRooms.data);
      this.$chattingForm.style.display = 'flex';
      this.$chatUserProfiles[idx].classList.add('active');
      // this.$chatUserProfiles[idx].click();
    }
    this.bindUserListEvents();
  }

  async renderPrevChat(chatRoomID) {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/chat/${chatRoomID}/messages`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      const data = await res.json();
      if (!res.ok) {
        if (data.status === 401) {
          await refreshAccessToken();
          return this.sendWebSocket();
        } else {
          throw console.log('renderPrevChat Error : ', data);
        }
      }
      if (data.data.next) this.nextChattingLog = data.data.next;
      const prevChat = data.data.results;
      prevChat.forEach(e => {
        this.renderChat(e, true);
      });
    } catch (error) {
      console.log(error);
    }
  }

  renderChat(data, moreChatLog) {
    const myMsgBox = document.createElement('div');
    const opponentMsgBox = document.createElement('div');
    const opponentName = document.createElement('div');
    const newMsg = document.createElement('div');
    const timeStamp = document.createElement('div');
    const date = new Date(data.created_at);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    myMsgBox.setAttribute('class', 'myMsgBox');
    opponentMsgBox.setAttribute('class', 'opponentMsgBox');
    newMsg.style.color = 'black';
    timeStamp.style.margin = '0 5px';
    timeStamp.textContent = `${hours}:${minutes}`;
    timeStamp.style.fontSize = '0.8rem';

    if ((data.sender ? data.sender : data.user_id) === this.user.id) {
      newMsg.textContent = data.message;
      newMsg.setAttribute('class', 'myChat');
      myMsgBox.appendChild(timeStamp);
      myMsgBox.appendChild(newMsg);
      if (moreChatLog) {
        this.$chatRoom.prepend(myMsgBox);
      } else {
        this.$chatRoom.appendChild(myMsgBox);
      }
      this.$chatRoom.scrollTop = this.$chatRoom.scrollHeight;
      this.$chattingSubmitImage.setAttribute('fill', '#ddd');
    } else {
      opponentName.textContent = data.nickname;
      opponentName.style.color = 'black';
      opponentName.style.marginBottom = '-10px';
      newMsg.textContent = data.message;
      newMsg.setAttribute('class', 'friendChat');
      opponentMsgBox.appendChild(newMsg);
      opponentMsgBox.appendChild(timeStamp);
      if (moreChatLog) {
        this.$chatRoom.prepend(opponentMsgBox);
        this.$chatRoom.prepend(opponentName);
      } else {
        this.$chatRoom.appendChild(opponentName);
        this.$chatRoom.appendChild(opponentMsgBox);
      }
      this.$chatRoom.scrollTop = this.$chatRoom.scrollHeight;
    }
  }

  loadPreviousMessagesOnScroll() {
    this.$chatRoom.addEventListener('scroll', async () => {
      if (this.$chatRoom.scrollTop === 0 && this.nextChattingLog) {
        const currentScrollHeight = this.$chatRoom.scrollHeight;

        const res = await fetch(this.nextChattingLog, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const data = await res.json();
        this.nextChattingLog = data.data.next;

        const prevChat = data.data.results;

        prevChat.forEach(e => {
          this.renderChat(e, true);
        });
        const newScrollHeight = this.$chatRoom.scrollHeight;
        const scrollOffset = newScrollHeight - currentScrollHeight;

        // 스크롤 위치를 조정
        this.$chatRoom.scrollTop = scrollOffset;
      }
    });
  }

  async deleteChatRoom(chatRoomId, cnt) {
    if (cnt) {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/chat/${chatRoomId}/leave/`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          },
        );
        const data = await res.json();
        if (res.ok) {
        } else {
          if (data.status === 401) {
            console.log('HLEOEOQWELQWLEQLWELQWELWQ');
            await refreshAccessToken();
            this.deleteChatRoom(chatRoomId, cnt - 1);
          }
        }
      } catch (error) {
        console.log('DeleteChatRoom REST API ERROR : ', error);
      }
    }
  }

  sendWebSocket() {
    console.log(this.target);
    cws.send({
      type: 'private_chat',
      status: 'enter',
      receiver_id: Number(this.target),
    });
  }

  leaveWebSocket() {
    cws.send({
      type: 'private_chat',
      status: 'leave',
    });
  }

  async bindUserListEvents() {
    const outDirectChatRoomContainer = document.querySelectorAll(
      '.outDirectChatRoomContainer',
    );
    const $chattingInput = document.querySelector('#chattingInput');

    this.loadPreviousMessagesOnScroll();

    $chattingInput.addEventListener('input', e => {
      if (e.target.value.length)
        this.$chattingSubmitImage.setAttribute('fill', 'black');
      else this.$chattingSubmitImage.setAttribute('fill', '#ddd');
    });

    this.$chattingForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!$chattingInput.value.length) return;
      cws.send({
        type: 'private_chat',
        status: 'message',
        message: $chattingInput.value,
      });
      $chattingInput.value = '';
    });

    outDirectChatRoomContainer.forEach((e, idx) =>
      e.addEventListener('click', e => {
        e.stopPropagation();
        this.leaveWebSocket();
        this.deleteChatRoom(
          Number(e.currentTarget.getAttribute('data-chatroomid')),
          1,
        );
        this.$chatRoom.innerHTML = '';
        const parentElement = e.currentTarget.parentNode;
        if (parentElement.parentNode) {
          parentElement.parentNode.removeChild(parentElement);
        }
      }),
    );

    this.$chatUserProfiles.forEach(profile => {
      profile.addEventListener('click', async e => {
        this.nextChattingLog = null;
        this.$chattingForm.style.display = 'flex';
        // 기존 active 클래스 삭제
        this.leaveWebSocket();
        this.$chatUserProfiles.forEach(profile => {
          profile.classList.remove('active');
        });

        e.currentTarget.classList.add('active');

        this.target = e.currentTarget.dataset.userid; //타겟 아이디
        this.sendWebSocket();
      });
    });
    const chatUserImages = document.querySelectorAll('.chatUserImage');
    chatUserImages.forEach(chatUserImage => {
      // console.log(chatUserImage);
      console.log('hehe');
      chatUserImage.addEventListener('click', e => {
        const id = e.target.dataset.id;
        userProfileData(id, 0, 0);
        $allHistoryBtn.classList.add('selected');
        // userProfileModalContainer.classList.add('active');
      });
    });
  }

  async getChattingRoom() {
    try {
      const res = await fetch(`http://127.0.0.1:8000/chat/rooms`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (res.ok) {
        const chattingRooms = await res.json();
        return chattingRooms;
      } else {
        if (res.status === 401) {
          await refreshAccessToken();
          return this.getChattingRoom();
        }
      }
    } catch (error) {
      console.error('Error fetching chatting rooms:', error);
    }
  }

  async afterRender() {
    const $chatRoom = document.querySelector('.chatRoom');
    this.$chatRoom = $chatRoom;

    document.querySelectorAll('a[data-spa]').forEach(link => {
      link.addEventListener('click', () => {
        this.leaveWebSocket();
      });
    });

    const $chattingSubmitImage = document.querySelector('#chattingSubmitImage');
    const $chattingForm = document.querySelector('#chattingForm');
    this.$chattingForm = $chattingForm;
    const chattingRooms = await this.getChattingRoom();
    this.$chattingSubmitImage = $chattingSubmitImage;

    await this.updateUserList(chattingRooms);

    await checkConnectionSocket(this.socketEventHendler.bind(this));
    if (this.params.user) {
      this.target = Number(this.params.user);
      this.sendWebSocket();
    }
  }

  async socketEventHendler(message) {
    if (!message.type) {
      if (message.is_new) {
        const chattingRooms = await this.getChattingRoom();
        await this.updateUserList(chattingRooms);
      }
      this.$chatRoom.innerHTML = '';
      const chatRoomdID = await message.chatroom_id;
      await this.renderPrevChat(chatRoomdID);
      this.$unReadCount.forEach(e => {
        if (
          chatRoomdID === Number(e.parentNode.getAttribute('data-chatroomid'))
        )
          e.style.opacity = 0;
      });
    } else if (message.type === 'private_chat') {
      this.renderChat(message);
    } else if (message.type === 'unread_count') {
      this.$unReadCount.forEach(e => {
        if (
          message.chatroom_id ===
            Number(e.parentNode.getAttribute('data-chatroomid')) &&
          e.parentNode.classList.length === 1
        ) {
          e.style.opacity = 1;
          e.innerHTML = message.unread_count;
        }
      });
    } else if (
      message.type === 'user_online' &&
      message.user_id !== this.user.id
    ) {
      this.$chatUserProfiles.forEach(user => {
        if (Number(user.getAttribute('data-userid')) === message.user_id) {
          user.querySelector('.directOnlineUserImage').style.display = 'block';
        }
      });
    } else if (message.type === 'user_offline') {
      this.$chatUserProfiles.forEach(user => {
        if (Number(user.getAttribute('data-userid')) === message.user_id)
          user.querySelector('.directOnlineUserImage').style.display = 'none';
      });
    }
    responseBattleRequest(message);
    console.log('onMessage : ', message);
  }
}
