import AbstractView from '../../AbstractView.js';
import {getToken, refreshAccessToken} from '../../tokenManager.js';
import cws from '../../WebSocket/ConnectionSocket.js';
import {
  checkConnectionSocket,
  connectionSocketConnect,
} from '../../webSocketManager.js';

function findUser(id, rooms) {
  for (let i = 0; i < rooms.length; i++) {
    console.log(rooms[i]);
    if (rooms[i].user1 === id || rooms[i].user2 === id) return i;
  }
  return -1;
}

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
          <input id="chattingInput" type="text" autocomplete="off" />
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

  updateUserList(chattingRooms) {
    const chatUserInner = document.querySelector('.chatUserInner');

    chatUserInner.innerHTML = `${chattingRooms.data
      .map(room => {
        return `<div class="chatUserProfile" data-userid="${
          room.user1 === this.user.id ? room.user2 : room.user1
        }">
        <div class="chatUserProfileBlur"></div>
          <div class="chatUserInfo">
          <img class="chatUserImage" src=${
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
          <div class="outDirectChatRoomContainer">
            <svg class="outDirectChatRoom" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 13.75V11H9.625V8.25H16.5V5.5L20.625 9.625L16.5 13.75ZM15.125 12.375V17.875H8.25V22L0 17.875V0H15.125V6.875H13.75V1.375H2.75L8.25 4.125V16.5H13.75V12.375H15.125Z"/>
            </svg>
          </div>
        </div>`;
      })
      .join('')}`;

    const $chatUserProfiles = document.querySelectorAll('.chatUserProfile');
    this.$chatUserProfiles = $chatUserProfiles;

    if (this.params.user) {
      let idx = findUser(Number(this.params.user), chattingRooms.data);
      this.$chatUserProfiles[idx].classList.add('active');
    }
    this.bindUserListEvents(chattingRooms);
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

  sendWebSocket() {
    cws.send({
      type: 'private_chat',
      status: 'enter',
      receiver_id: Number(this.target),
    });
  }

  async bindUserListEvents(chattingRooms) {
    const outDirectChatRoomContainer = document.querySelectorAll(
      '.outDirectChatRoomContainer',
    );
    const $chattingForm = document.querySelector('#chattingForm');
    const $chattingInput = document.querySelector('#chattingInput');

    this.loadPreviousMessagesOnScroll();

    $chattingInput.addEventListener('input', e => {
      if (e.target.value.length)
        this.$chattingSubmitImage.setAttribute('fill', 'black');
      else this.$chattingSubmitImage.setAttribute('fill', '#ddd');
    });

    // 채팅룸 삭제 아직 미완성
    outDirectChatRoomContainer.forEach((e, idx) =>
      e.addEventListener('click', e => {
        cws.send({
          type: 'private_chat',
          status: 'leave',
        });
        users.splice(idx, 1);
        this.updateUserList();
      }),
    );

    $chattingForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!$chattingInput.value.length) return;
      cws.send({
        type: 'private_chat',
        status: 'message',
        message: $chattingInput.value,
      });
      $chattingInput.value = '';
    });

    this.$chatUserProfiles.forEach(profile => {
      profile.addEventListener('click', async e => {
        this.nextChattingLog = null;
        // 기존 active 클래스 삭제
        this.$chatUserProfiles.forEach(profile => {
          profile.classList.remove('active');
        });

        e.currentTarget.classList.add('active');

        this.target = e.currentTarget.dataset.userid; //타겟 아이디
        this.sendWebSocket();
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
        await refreshAccessToken();
        return this.getChattingRoom();
      }
    } catch (error) {
      console.error('Error fetching chatting rooms:', error);
    }
  }

  async afterRender() {
    await checkConnectionSocket(this.socketEventHendler.bind(this));
    const $chatRoom = document.querySelector('.chatRoom');
    this.$chatRoom = $chatRoom;

    if (this.params.user) {
      this.target = Number(this.params.user);
      this.sendWebSocket();
    }
    const $chattingSubmitImage = document.querySelector('#chattingSubmitImage');
    const chattingRooms = await this.getChattingRoom();
    this.$chattingSubmitImage = $chattingSubmitImage;

    this.updateUserList(chattingRooms);
  }

  async socketEventHendler(message) {
    if (message.chatroom_id) {
      this.$chatRoom.innerHTML = '';
      const chatRoomdID = await message.chatroom_id;
      this.renderPrevChat(chatRoomdID);
      try {
      } catch (error) {
        console.error(error);
      }
    } else if (message.type === 'private_chat') {
      this.renderChat(message);
    }
    console.log('onMessage : ', message);
  }
}
