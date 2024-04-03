import AbstractView from '../../AbstractView.js';
import cws from '../../WebSocket/ConnectionSocket.js';
import {checkConnectionSocket} from '../../webSocketManager.js';
import {getToken, refreshAccessToken} from '../../tokenManager.js';
import {responseBattleRequest} from '../../battleResponseEventHandler.js';
import {userProfileData} from '../../PlayersRestApi.js';
import API_URL from '../../../config.js';
const users = [
  {
    name: 'jimpark',
    state: false,
    image: '/public/huipark.jpg',
  },
  {
    name: 'huipark',
    state: true,
    image: '/public/huipark.jpg',
  },
  {
    name: 'hwankim',
    state: true,
    image: '/public/huipark.jpg',
  },
  {
    name: 'jihyeole',
    state: false,
    image: '/public/huipark.jpg',
  },
  {
    name: 'jimpark',
    state: false,
    image: '/public/huipark.jpg',
  },
  {
    name: 'huipark',
    state: true,
    image: '/public/huipark.jpg',
  },
  {
    name: 'hwankim',
    state: true,
    image: '/public/huipark.jpg',
  },
  {
    name: 'jihyeole',
    state: false,
    image: '/public/huipark.jpg',
  },
  {
    name: 'jimpark',
    state: false,
    image: '/public/huipark.jpg',
  },
  {
    name: 'huipark',
    state: true,
    image: '/public/huipark.jpg',
  },
  {
    name: 'hwankim',
    state: true,
    image: '/public/huipark.jpg',
  },
  {
    name: 'jihyeole',
    state: false,
    image: '/public/huipark.jpg',
  },
  {
    name: 'jimpark',
    state: false,
    image: '/public/huipark.jpg',
  },
  {
    name: 'huipark',
    state: true,
    image: '/public/huipark.jpg',
  },
  {
    name: 'hwankim',
    state: true,
    image: '/public/huipark.jpg',
  },
  {
    name: 'jihyeole',
    state: false,
    image: '/public/huipark.jpg',
  },
];
const $allHistoryBtn = document.querySelector('.allHistoryBtn');
export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('PongWorldㅣChat');
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.onlineUsers = null;
  }
  async getHtml() {
    return `
    <div class="contentsContainer">
  <div class="chatContainer">
    <div style="flex:0.35;">
      <div id="chatHeader">
        <div style="height:32px">
          <h1 class="chatTitle">Chat</h1>
        </div>
        <nav class="chatNav">
          <a
            class="chat__nav"
            id="allChat"
            href="/chat"
            data-spa
            style="background-color:rgb(185, 185, 185)">
            all
          </a>
          <a class="chat__nav" id="directChat" href="/chat/direct" data-spa>
            direct
          </a>
        </nav>
        <div class="chatSearchFormContainer">
          <form id="chatSearchUserForm" action="" method="GET">
            <label for="chatSearchUserInput"></label>
            <input
              id="chatSearchUserInput"
              type="search"
              autocomplete="off"
              placeholder="user"
            />
          </form>
          <svg id="searchUserImage" width="5rem" viewBox="0 0 24 24">
            <g fill="none" fill-rule="evenodd">
              <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
              <path
                fill="currentColor"
                d="M6 7a5 5 0 1 1 10 0A5 5 0 0 1 6 7m-1.178 7.672C6.425 13.694 8.605 13 11 13c.447 0 .887.024 1.316.07a1 1 0 0 1 .72 1.557A5.968 5.968 0 0 0 12 18c0 .92.207 1.79.575 2.567a1 1 0 0 1-.89 1.428c-.226.003-.455.005-.685.005c-2.229 0-4.335-.14-5.913-.558c-.785-.208-1.524-.506-2.084-.956C2.41 20.01 2 19.345 2 18.5c0-.787.358-1.523.844-2.139c.494-.625 1.177-1.2 1.978-1.69ZM17.5 16a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M14 17.5a3.5 3.5 0 1 1 6.58 1.665l.834.835A1 1 0 1 1 20 21.414l-.835-.835A3.5 3.5 0 0 1 14 17.5"
              />
            </g>
          </svg>
        </div>
      </div>
      <div class="chatLeftContainer">
        <div class="chatUserInner">
        </div>
      </div>
    </div>
    <div class="chatRightContainer">
      <div class="chatRoom"></div>
      <form id="chattingForm">
        <input id="chattingInput" type="text" autocomplete="off" maxlength='300' />
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

  async renderOnlineUsers(nickname) {
    const $chatUserInner = document.querySelector('.chatUserInner');
    const url = nickname
      ? `${API_URL}/players/online/${nickname}/`
      : `${API_URL}/players/online`;

    const getOnlineUsers = async () => {
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          this.onlineUsers = data.data.results;
        } else {
          if (data.status === 401) {
            await refreshAccessToken();
            return getOnlineUsers();
          }
        }
      } catch (error) {
        console.log('getOnlineUsers Error', error);
      }
    };
    await getOnlineUsers();

    $chatUserInner.innerHTML = ` ${this.onlineUsers
      .map(user => {
        return `<div class="chatUserProfile">
    <div class="chatUserProfileBlur"></div>
    <div class="chatUserInfo">
      <img class="chatUserImage" data-id='${user.id}' src=${user.profile_img}/>
      <p class="chatUserName" data-id='${user.id}'>${user.nickname}</p>
    </div>
    <a class="directMsgImageContainer" href='/chat/direct/${user.id}' data-spa>
      <svg class="directMsgImage" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg">
      <path class="directMsgPath" d="M18.5304 0.456145C18.3255 0.252659 18.0684 0.109609 17.7875 0.042717C17.5065 -0.0241752 17.2126 -0.0123206 16.9379 0.076978L1.08878 5.36364C0.794839 5.45678 0.535093 5.63494 0.342348 5.87562C0.149603 6.1163 0.0325054 6.40869 0.0058437 6.71588C-0.020818 7.02307 0.0441527 7.33127 0.19255 7.60156C0.340947 7.87184 0.566114 8.09209 0.839612 8.23448L7.41544 11.4845L10.6654 18.082C10.7961 18.3402 10.996 18.557 11.2428 18.7082C11.4896 18.8593 11.7735 18.9388 12.0629 18.9378H12.1713C12.4812 18.915 12.7771 18.7995 13.0205 18.6063C13.264 18.4131 13.4437 18.1511 13.5363 17.8545L18.8988 2.04864C18.9945 1.77557 19.0107 1.48092 18.9455 1.19898C18.8803 0.91705 18.7364 0.65944 18.5304 0.456145ZM1.76045 6.85864L15.5946 2.24364L7.91378 9.92448L1.76045 6.85864ZM12.1388 17.2261L9.06211 11.0728L16.7429 3.39198L12.1388 17.2261Z" fill="#858585"/>
      </svg>
    </a>
    </div>`;
      })
      .join('')}
    `;

    const chatUserImages = document.querySelectorAll('.chatUserImage');
    const chatUserNames = document.querySelectorAll('.chatUserName');
    chatUserImages.forEach(chatUserImage => {
      chatUserImage.addEventListener('click', e => {
        const id = e.target.dataset.id;
        userProfileData(id, 0, 0);
        $allHistoryBtn.classList.add('selected');
      });
    });
    chatUserNames.forEach(chatUserName => {
      chatUserName.addEventListener('click', e => {
        const id = e.target.dataset.id;
        userProfileData(id, 0, 0);
        $allHistoryBtn.classList.add('selected');
      });
    });
  }

  bindSearchUserInputEvent() {
    const $chatSearchUserInput = document.getElementById('chatSearchUserInput');
    const $chatSearchFormContainer = document.querySelector(
      '.chatSearchFormContainer',
    );

    $chatSearchFormContainer.addEventListener('submit', e => {
      e.preventDefault();
      this.renderOnlineUsers($chatSearchUserInput.value);
    });
    // chatSearchUserInput.addEventListener('input', e => {});
  }

  async connectionChatSocket() {
    const $chattingForm = document.querySelector('#chattingForm');
    const $chattingInput = document.querySelector('#chattingInput');

    $chattingForm.style.display = 'flex';

    $chattingForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!$chattingInput.value.length) return;

      cws.send({
        type: 'public_chat',
        message: $chattingInput.value,
      });
      $chattingInput.value = '';
    });
  }

  renderChatting(message) {
    const myMsgBox = document.createElement('div');
    const opponentMsgBox = document.createElement('div');
    const opponentName = document.createElement('div');
    const newMsg = document.createElement('div');
    const timeStamp = document.createElement('div');
    const date = new Date(message.created_at);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    newMsg.style.color = 'black';
    myMsgBox.setAttribute('class', 'myMsgBox');
    opponentMsgBox.setAttribute('class', 'opponentMsgBox');
    newMsg.style.color = 'black';
    timeStamp.style.margin = '0 5px';
    timeStamp.textContent = `${hours}:${minutes}`;
    timeStamp.style.fontSize = '0.8rem';

    if (Number(message.user_id) === this.user.id) {
      newMsg.textContent = message.message;
      newMsg.setAttribute('class', 'myChat');
      myMsgBox.appendChild(timeStamp);
      myMsgBox.appendChild(newMsg);
      this.$chatRoom.appendChild(myMsgBox);
      this.$chatRoom.scrollTop = this.$chatRoom.scrollHeight;
      chattingSubmitImage.setAttribute('fill', '#ddd');
    } else {
      opponentName.textContent = message.nickname;
      opponentName.style.color = 'black';
      opponentName.style.marginBottom = '-5px';
      newMsg.textContent = message.message;
      newMsg.setAttribute('class', 'friendChat');
      opponentMsgBox.appendChild(newMsg);
      opponentMsgBox.appendChild(timeStamp);
      this.$chatRoom.appendChild(opponentName);
      this.$chatRoom.appendChild(opponentMsgBox);
      this.$chatRoom.scrollTop = this.$chatRoom.scrollHeight;
    }
  }

  async afterRender() {
    await checkConnectionSocket(this.webSocketEventHandler.bind(this));

    const chattingSubmitImage = document.querySelector('#chattingSubmitImage');
    const $chatRoom = document.querySelector('.chatRoom');
    this.$chatRoom = $chatRoom;

    this.bindSearchUserInputEvent();
    await this.connectionChatSocket();
    this.renderOnlineUsers();

    chattingInput.addEventListener('input', e => {
      if (e.target.value.length)
        chattingSubmitImage.setAttribute('fill', 'black');
      else chattingSubmitImage.setAttribute('fill', '#ddd');
    });
  }

  webSocketEventHandler(message) {
    if (message.type === 'public_chat') {
      this.renderChatting(message);
    } else if (
      message.type === 'user_offline' ||
      message.type === 'user_online'
    ) {
      this.renderOnlineUsers();
    }
    responseBattleRequest(message);
  }
}
