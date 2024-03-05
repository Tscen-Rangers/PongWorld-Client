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
const $battleModalContainer = document.querySelector('.battleModalContainer');
const $battleCancelBtn = document.querySelector('.battleCancelBtn');
const battleMsg = document.querySelector('.battleMsg');
const $gameOptionModalContainer = document.getElementById(
  'gameOptionModalContainer',
);

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
          <a
            class="friends_nav__link"
            style="background-color:rgb(185, 185, 185);"
            data-spa
            href="/friends">
            friends
          </a>
          <a class="friends_nav__link" data-spa href="/friends/search">
            Search
          </a>
          <a class="friends_nav__link" data-spa href="/friends/blocked">
            blocked
          </a>
          <a class="friends_nav__link"  id="request_nav__link" data-spa href="/friends/request">
            request
          <div class="requestBadge"><div class="requestBadgeInner"></div></div>
          </a>
        </nav>
        <div class="searchBarContainer">
          <div class="searchBar">
            <input type="text" name="search" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 512 512">
              <path
                fill="none"
                stroke="#979191"
                stroke-miterlimit="10"
                stroke-width="32"
                d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64Z"
              />
              <path
                fill="none"
                stroke="#979191"
                stroke-linecap="round"
                stroke-miterlimit="10"
                stroke-width="32"
                d="M338.29 338.29L448 448"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="friendListContainer"></div>
    </div>
  </div>
		`;
  }

  updateFriendList(battleOptionModal) {
    const friendListContainer = document.querySelector('.friendListContainer');
    friendListContainer.innerHTML = `  ${users
      .map(
        (user, index) => `
      <div class="friendList" key=${index}>
      <div class="friendProfile">
        <div class="friendProfileImg">
        <img class="profileImg" src="/public/huipark.jpg"/>
         ${
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
      <a class="chatbutton" href='/chat/direct/${
        user.name
      }' data-spa>chat<svg class="chatMsgImage" style="margin-left:5px;" width="0.9em" height="0.9em" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg">
      <path class="directMsgPath" d="M18.5304 0.456145C18.3255 0.252659 18.0684 0.109609 17.7875 0.042717C17.5065 -0.0241752 17.2126 -0.0123206 16.9379 0.076978L1.08878 5.36364C0.794839 5.45678 0.535093 5.63494 0.342348 5.87562C0.149603 6.1163 0.0325054 6.40869 0.0058437 6.71588C-0.020818 7.02307 0.0441527 7.33127 0.19255 7.60156C0.340947 7.87184 0.566114 8.09209 0.839612 8.23448L7.41544 11.4845L10.6654 18.082C10.7961 18.3402 10.996 18.557 11.2428 18.7082C11.4896 18.8593 11.7735 18.9388 12.0629 18.9378H12.1713C12.4812 18.915 12.7771 18.7995 13.0205 18.6063C13.264 18.4131 13.4437 18.1511 13.5363 17.8545L18.8988 2.04864C18.9945 1.77557 19.0107 1.48092 18.9455 1.19898C18.8803 0.91705 18.7364 0.65944 18.5304 0.456145ZM1.76045 6.85864L15.5946 2.24364L7.91378 9.92448L1.76045 6.85864ZM12.1388 17.2261L9.06211 11.0728L16.7429 3.39198L12.1388 17.2261Z" fill="#636363"/>
      </svg></a>
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
    this.bindFriendListEvents(battleOptionModal);
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
        const user = e.currentTarget.dataset.user;
        battleMsg.innerText = `Waiting for a response from ${user}...`;
        $gameOptionModalContainer.setAttribute('data-modaloption', 'battle');
        $gameOptionModalContainer.classList.add('show');
      });
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
    $battleCancelBtn.addEventListener('click', () => {
      $battleModalContainer.classList.remove('active');
    });
    $battleCancelBtn.addEventListener('click', {});
    this.updateFriendList();
    localStorage.setItem('newRequest', 1);
    const requestBadge = document.querySelector('.requestBadge');
    requestBadge.firstChild.innerText = localStorage.getItem('newRequest');
    if (parseInt(localStorage.getItem('newRequest')))
      requestBadge.classList.add('active');
    else requestBadge.classList.remove('active');
  }
}
