import AbstractView from '../../AbstractView.js';
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

function findUser(userName, users) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].name === userName) return i;
  }
  return -1;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('PongWorldㅣDirectChat');
    this.target = null;
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
    <div class="contentsContainer">
    <div class="chatContainer">
      <div style="flex:0.35;">
        <div style="height:15%">
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

  updateUserList() {
    const chatUserInner = document.querySelector('.chatUserInner');

    chatUserInner.innerHTML = `${users
      .map(user => {
        return `<div class="chatUserProfile">
        <div class="chatUserProfileBlur"></div>
          <div class="chatUserInfo">
          <img class="chatUserImage" src="/public/huipark.jpg"/>
          <p class="chatUserName">${user.name}</p>
          ${
            user.state
              ? `<img class="directOnlineUserImage" src="/public/online.png"/>`
              : ``
          }
        </div>
          <div class="outDirectChatRoomContainer">
            <svg class="outDirectChatRoom" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 13.75V11H9.625V8.25H16.5V5.5L20.625 9.625L16.5 13.75ZM15.125 12.375V17.875H8.25V22L0 17.875V0H15.125V6.875H13.75V1.375H2.75L8.25 4.125V16.5H13.75V12.375H15.125Z"/>
            </svg>
          </div>
        </div>`;
      })
      .join('')}`;

    this.bindUserListEvents();
  }

  bindUserListEvents() {
    const outDirectChatRoomContainer = document.querySelectorAll(
      '.outDirectChatRoomContainer',
    );
    const chatUserProfiles = document.querySelectorAll('.chatUserProfile');

    outDirectChatRoomContainer.forEach((e, idx) =>
      e.addEventListener('click', e => {
        users.splice(idx, 1);
        this.updateUserList();
      }),
    );

    chatUserProfiles.forEach(profile => {
      profile.addEventListener('click', e => {
        chatUserProfiles.forEach(profile => {
          profile.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        this.target = e.currentTarget.innerText;
      });
    });

    if (this.params.user) {
      let idx = findUser(this.params.user, users);
      chatUserProfiles[idx].classList.add('active');
      this.target = this.params.user;
    }
  }

  afterRender() {
    const chattingForm = document.querySelector('#chattingForm');
    const chattingInput = document.querySelector('#chattingInput');
    const chattingSubmitImage = document.querySelector('#chattingSubmitImage');
    const chatRoom = document.querySelector('.chatRoom');

    this.updateUserList();

    chattingInput.addEventListener('input', e => {
      if (e.target.value.length)
        chattingSubmitImage.setAttribute('fill', 'black');
      else chattingSubmitImage.setAttribute('fill', '#ddd');
    });

    chattingForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!chattingInput.value.length) return;
      const newMsg = document.createElement('div');
      newMsg.style.color = 'black';
      newMsg.textContent = `${chattingInput.value}`;
      newMsg.setAttribute('class', 'myChat');
      chatRoom.appendChild(newMsg);
      chatRoom.scrollTop = chatRoom.scrollHeight;
      chattingSubmitImage.setAttribute('fill', '#ddd');
      chattingInput.value = '';
      console.log('Chat form submitted');
    });
  }
}
