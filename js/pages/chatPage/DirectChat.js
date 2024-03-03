import AbstractView from '../../AbstractView.js';
import {getToken, refreshAccessToken} from '../../tokenManager.js';

function findUser(userName, rooms) {
  for (let i = 0; i < rooms.length; i++) {
    if (
      rooms[i].user1_nickname === userName ||
      rooms[i].user2_nickname === userName
    )
      return i;
  }
  return -1;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('PongWorldㅣDirectChat');
    this.target = null;
    this.user = JSON.parse(sessionStorage.getItem('user'));
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
          <img class="chatUserImage" src="/public/huipark.jpg"/>
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

    this.bindUserListEvents(chattingRooms);
  }

  bindUserListEvents(chattingRooms) {
    const outDirectChatRoomContainer = document.querySelectorAll(
      '.outDirectChatRoomContainer',
    );
    const $chatUserProfiles = document.querySelectorAll('.chatUserProfile');
    const $chattingForm = document.querySelector('#chattingForm');
    const $chattingInput = document.querySelector('#chattingInput');
    const $chattingSubmitImage = document.querySelector('#chattingSubmitImage');
    const $chatRoom = document.querySelector('.chatRoom');
    let directSocket = null;
    let chatRoomID = null;
    let msgTarget = null;
    let TargetNickName = null;
    let nextChattingLog = null;

    $chatRoom.addEventListener('scroll', async () => {
      if ($chatRoom.scrollTop === 0 && nextChattingLog) {
        const res = await fetch(nextChattingLog, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const data = await res.json();
        nextChattingLog = data.data.next;
        console.log(data);

        const prevChat = data.data.results;

        prevChat.forEach(e => {
          renderChat(e, TargetNickName, true);
        });
      }
    });

    const renderChat = (data, targetNickName, moreChatLog) => {
      const opponentName = document.createElement('div');
      const newMsg = document.createElement('div');
      newMsg.style.color = 'black';

      if ((data.sender ? data.sender : data.user_id) === this.user.id) {
        newMsg.textContent = data.message;
        newMsg.setAttribute('class', 'myChat');
        moreChatLog ? $chatRoom.prepend(newMsg) : $chatRoom.appendChild(newMsg);
        $chatRoom.scrollTop = $chatRoom.scrollHeight;
        $chattingSubmitImage.setAttribute('fill', '#ddd');
      } else {
        opponentName.textContent = targetNickName;
        opponentName.style.color = 'black';
        opponentName.style.marginBottom = '-10px';
        newMsg.textContent = data.message;
        newMsg.setAttribute('class', 'friendChat');
        moreChatLog
          ? $chatRoom.prepend(opponentName)
          : $chatRoom.appendChild(opponentName);
        moreChatLog ? $chatRoom.prepend(newMsg) : $chatRoom.appendChild(newMsg);
        $chatRoom.scrollTop = $chatRoom.scrollHeight;
      }
    };

    const connectWebSocket = () => {
      if (directSocket) {
        directSocket.close();
        console.log('DirectSocket is Close!!! Trying to reconnect...');
      }
      directSocket = new WebSocket(
        `ws://127.0.0.1:8000/ws/chat/private/${this.user.id}/${msgTarget}/`,
      );
      directSocket.onopen = () => {
        console.log('DirectSocket is Connected!!!');
      };
      directSocket.onerror = error => {
        console.error('WebSocket error:', error);
      };
      directSocket.onmessage = async e => {
        const data = JSON.parse(e.data);

        if (data.chatroom_id) {
          chatRoomID = data.chatroom_id;
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
                return connectWebSocket();
              } else {
                throw new Error('Network response was not ok');
              }
            }
            nextChattingLog = data.data.next;
            const prevChat = data.data.results;

            console.log(prevChat);

            prevChat.forEach(e => {
              renderChat(e, TargetNickName);
            });
          } catch (error) {
            console.error(error);
          }
        } else renderChat(data, data.nickname);
      };
    };

    $chattingInput.addEventListener('input', e => {
      if (e.target.value.length)
        $chattingSubmitImage.setAttribute('fill', 'black');
      else $chattingSubmitImage.setAttribute('fill', '#ddd');
    });

    outDirectChatRoomContainer.forEach((e, idx) =>
      e.addEventListener('click', e => {
        users.splice(idx, 1);
        this.updateUserList();
      }),
    );

    $chattingForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!$chattingInput.value.length) return;
      if (directSocket && directSocket.readyState === WebSocket.OPEN) {
        directSocket.send(
          JSON.stringify({
            user_id: this.user.id,
            chatroom_id: Number(chatRoomID),
            message: $chattingInput.value,
          }),
        );
      } else {
        console.error('WebSocket 연결이 닫혔거나 닫히는 중입니다.');
      }
      $chattingInput.value = '';
    });

    $chatUserProfiles.forEach(profile => {
      profile.addEventListener('click', async e => {
        // 기존 active 클래스 삭제
        $chatUserProfiles.forEach(profile => {
          profile.classList.remove('active');
        });

        e.currentTarget.classList.add('active');

        msgTarget = e.currentTarget.dataset.userid; //타겟 아이디
        TargetNickName = e.currentTarget.innerText;
        $chatRoom.innerHTML = '';
        connectWebSocket();
      });
    });

    if (this.params.user) {
      let idx = findUser(this.params.user, chattingRooms.data);
      if (idx === -1) {
        // 채팅방 목록에 없을떄!!
      } else {
        $chatUserProfiles[idx].classList.add('active');
        this.target = this.params.user;
      }
    }
  }

  async getChattingRoom() {
    try {
      const res = await fetch(`http://127.0.0.1:8000/chat/rooms`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      // console.log(await chattingRooms.json());
      if (res.ok) {
        const chattingRooms = await res.json();
        return chattingRooms;
      } else {
        await refreshAccessToken();
        return this.getChattingRoom();
      }
      // console.log(chattingRooms);
    } catch (error) {
      console.error('Error fetching chatting rooms:', error);
    }
  }

  async afterRender() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // const chattingForm = document.querySelector('#chattingForm');
    // const chattingInput = document.querySelector('#chattingInput');
    // const chattingSubmitImage = document.querySelector('#chattingSubmitImage');
    // const chatRoom = document.querySelector('.chatRoom');

    const chattingRooms = await this.getChattingRoom();
    this.updateUserList(chattingRooms);
  }
}
