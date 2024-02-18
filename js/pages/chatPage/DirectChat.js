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
];

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('PongWorldㅣDirectChat');
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
	<div class="contentsContainer">
	<div class="chatContainer">
	  <div class="chatLeftContainer">
		<h1>Chat</h1>
		<nav class="chatNav">
		  <a id="allChat" href="/chat" data-spa>
			all
		  </a>
		  <a
			id="directChat"
			href="/chat/direct"
			data-spa
			style="background-color:rgb(185, 185, 185)">
			direct
		  </a>
		</nav>
		<div class="formContainer">
		  <form id="chatSearchUserForm" action="" method="GET">
			<label for="chatSearchUserInput"></label>
			<input id="chatSearchUserInput" type="search" placeholder="user" />
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
		<div class="chatUsersContainer">
			<div class="chatUsersBlur"></div>
			${users
        .map(user => {
          return `<div class="chatUserProfile">
					<div class="chatUserProfileBlur"></div>
					<div class="chatUserInfo">
						<img class="chatUserImage" src="/public/huipark.jpg"/>
						<p class="chatUserName">${user.name}</p>
					</div>
					<svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16.5 13.75V11H9.625V8.25H16.5V5.5L20.625 9.625L16.5 13.75ZM15.125 12.375V17.875H8.25V22L0 17.875V0H15.125V6.875H13.75V1.375H2.75L8.25 4.125V16.5H13.75V12.375H15.125Z" fill="#6E6E6E"/>
					</svg>
		  		</div>`;
        })
        .join('')}
		</div>
	  </div>
	  <div class="chatRightContainer">
		<div class="chatRoom">${users[0].name}</div>
		<form id="chattingForm">
			<input id="chattingInput" type="text" />
			<svg id="chattingSubmitImage" width="2rem" height="2rem" viewBox="0 0 32 32" fill="#ddd"><g><path d="M16.693 7.667a1 1 0 0 0-1.386 0L9.994 12.78c-.649.624-.207 1.72.693 1.72h3.063a.25.25 0 0 1 .25.25v9.75a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-9.75a.25.25 0 0 1 .25-.25h3.063c.9 0 1.342-1.096.693-1.72z"/><path d="M6 1a5 5 0 0 0-5 5v20a5 5 0 0 0 5 5h20a5 5 0 0 0 5-5V6a5 5 0 0 0-5-5zM3 6a3 3 0 0 1 3-3h20a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/></g></svg>
		</form>
	  </div>
	</div>
  </div>
		`;
  }

  afterRender() {
    const chattingForm = document.querySelector('#chattingForm');
    const chattingInput = document.querySelector('.chttingInput');
    chattingForm.addEventListener('submit', e => {
      e.preventDefault();
      console.log('Chat form submitted');
      // 채팅 메시지 처리 로직
    });
  }
}
