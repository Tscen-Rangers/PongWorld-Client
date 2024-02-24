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

  {
    name: 'jihyeole',
    state: false,
  },
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
    <div class="friendContainer">
    <h1 id="friendspageTitle">Friends</h1>
    <div class="friendsHeader">
    <nav class="friends_nav">
    <a class="friends_nav__link" style="background-color:rgb(185, 185, 185);" data-spa href="/friends">friends</a>
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
    </div>
    </div>
    </div>
		`;
  }

  updateFriendList() {
    const friendListContainer = document.querySelector('.friendListContainer');
    friendListContainer.innerHTML = `  ${users
      .map(
        (user, index) => `
      <div class="friendList" key=${index}>
      <div class="friendProfile">
        <div class="friendProfileImg"> ${
          user.state ? '<img class="onlineImg" src="/public/online.png"/>' : ''
        }</div> 
        <div class="friendname">${user.name}</div>
      </div>
      ${
        user.state
          ? `<div class="battlebutton" data-user="${user.name}"/>
battle
            <img class="leftgloveImg" src="/public/leftglove.png"/>
            <img class="rightgloveImg" src="/public/rightglove.png"/>
          </div>`
          : ''
      }
      <div class="chatbutton">chat</div>
    <div class="option">
      <img class="friendsThreedotsImg" src="/public/threedots.png" />
      <div class="optionModal">
        <div class="optionBtn" data-key="${index}">block</div>
        <div class="optionBtn" data-key="${index}">delete</div>
      </div>
    </div>
  </div>
`,
      )
      .join('')}`;
    this.bindFriendListEvents();
  }

  bindFriendListEvents() {
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
    const battleButtons = document.querySelectorAll('.battlebutton');
    battleButtons.forEach(battleButton => {
      battleButton.addEventListener('click', e => {
        const user = e.target.dataset.user;
        console.log(user);
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
        const index = e.target.dataset.key;
        console.log(index);
        if (selected === 'delete') {
          //친구에서 삭제만
          users.splice(index, 1);
          this.updateFriendList();
        } else {
          //block하기
          users.splice(index, 1);
          this.updateFriendList();
        }
      });
    });
  }

  afterRender() {
    this.updateFriendList();
  }
}
