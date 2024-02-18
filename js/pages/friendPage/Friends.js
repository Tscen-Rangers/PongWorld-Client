import AbstractView from '../../AbstractView.js';
const users = [
  {
    name: 'jimpark',
    state: false,
  },
  {
    name: 'huipark',
    state: true,
  },
  {
    name: 'hwankim',
    state: true,
  },
  {
    name: 'jihyeole',
    state: false,
  },
];
const battlePlayer = document.querySelector('.battlePlayer');
const battleCancelBtn = document.querySelector('.battleCancelBtn');
const confirmModal = document.querySelector('.confirmModalContainer');
const confirmModalMsg = document.querySelector('.confirmModalMsg');
const confirmBtn = document.querySelector('.confirmBtn');
const cancelBtn = document.querySelector('.cancelBtn');
const battleModal = document.querySelector('.battleModalContainer');

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Friends');
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    //임시 데이터

    return `
    <div class="contentsContainer">
    <div style="padding:10px 20px; height:100%;">
    <h1 id="friendspageTitle">Friends</h1>
    <div class="friendsHeader">
    <nav class="friends_nav">
    <a class="friends_nav__link" style="background-color:rgba(111,111,111,0.38)" data-spa href="/friends">friends</a>
    <a class="friends_nav__link"  data-spa href="/friends/search">Search</a>
    <a class="friends_nav__link" data-spa href="/friends/blocked">blocked</a>
    <a class="friends_nav__link"  data-spa href="/friends/request">request</a>
    </nav>
    <div class="searchBarContainer">
    <div class="searchBar">
    <input type="text" name="search"/>
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#979191" stroke-miterlimit="10" stroke-width="32" d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64Z"/><path fill="none" stroke="#979191" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"/></svg>
    </div>
    </div>
    </div>
    <div class="friendListContainer">
    ${users
      .map(
        (user, index) => `
        <div class="friendList" key=${index}>
        <div class="friendProfile">
          <div class="friendProfileImg"> ${
            user.state
              ? '<img class="onlineImg" src="/public/online.png"/>'
              : ''
          }</div> 
          <div class="friendname">${user.name}</div>
        </div>
        ${
          user.state
            ? `<img class="battlebuttonImg" src="/public/battleButton.png" data-user="${user.name}"/><img class="chatbuttonImg" src="/public/chatButton.png"/>`
            : ''
        }
      <div class="option">
        <img class="friendsThreedotsImg" src="/public/threedots.png" />
        <div class="optionModal">
          <div class="optionBtn" data-user="${user.name}">block</div>
          <div class="optionBtn" data-user="${user.name}">delete</div>
          <div class="optionProfileBtn" data-user="${user.name}">profile</div>
        </div>
      </div>
    </div>
  `,
      )
      .join('')}
    </div>
    </div>
    </div>
		`;
  }
  afterRender() {
    const threedotsImgs = document.querySelectorAll('.friendsThreedotsImg');
    threedotsImgs.forEach(threedotsImg => {
      threedotsImg.addEventListener('click', e => {
        const optionModal = e.target.nextElementSibling;
        optionModal.classList.toggle('active');
        const activeModals = document.querySelectorAll('.optionModal.active');
        activeModals.forEach(modal => {
          if (modal !== optionModal) {
            modal.classList.remove('active');
          }
        });
      });
    });
    document.body.addEventListener('click', e => {
      const clickedElement = e.target;
      // 클릭한 요소가 모달이 아니라면 활성화된 모달을 닫기
      if (
        !clickedElement.closest('.optionModal') &&
        !clickedElement.closest('.friendsThreedotsImg')
      ) {
        const activeModals = document.querySelectorAll('.optionModal.active');
        activeModals.forEach(modal => {
          modal.classList.remove('active');
        });
      }
    });
    const battleButtonImgs = document.querySelectorAll('.battlebuttonImg');
    battleButtonImgs.forEach(battleButtonImg => {
      battleButtonImg.addEventListener('click', e => {
        const user = e.target.dataset.user;
        battlePlayer.innerText = `Waiting for a response from ${user}`;
        battleModal.classList.add('active');
      });
    });
    battleCancelBtn.addEventListener('click', () => {
      battleModal.classList.remove('active');
    });
    const optionBtns = document.querySelectorAll('.optionBtn');
    optionBtns.forEach(optionBtn => {
      optionBtn.addEventListener('click', e => {
        const selected = e.target.innerText;
        const user = e.target.dataset.user;
        confirmModalMsg.innerHTML = `Are you sure <br/> you want to ${selected} ${user}?`;
        confirmModal.classList.add('active');
      });
    });
    cancelBtn.addEventListener('click', () => {
      confirmModal.classList.remove('active');
    });
  }
}
