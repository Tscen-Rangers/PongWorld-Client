import AbstractView from '../../AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('PongWorldㅣChat');
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
  <div class="contentsContainer">
    <div class="chatContainer">
      <div class="chatLeftContainer">
        <h1>Chat</h1>
        <nav class="chatNav">
          <a id="allChat" href="/chat" data-spa style="background-color:rgb(185, 185, 185)">all</a>
          <a id="directChat" href="/chat/direct" data-spa>direct</a>
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
        <div class="chatUser"></div>
      </div>
      <div class="chatRightContainer">
      ALL
      </div>
    </div>
  </div>
		`;
  }
}
