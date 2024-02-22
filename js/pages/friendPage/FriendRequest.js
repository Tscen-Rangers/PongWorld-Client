import AbstractView from '../../AbstractView.js';

let checkModalEvent = 0;
const recieved = [
  {
    name: 'yubchoi',
    state: false,
  },
  {
    name: 'mher',
    state: true,
  },
  {
    name: 'hyunjki2',
    state: true,
  },
];

const sent = [
  {
    name: 'jimpark',
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
    name: 'jimpark',
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
    name: 'jimpark',
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
    name: 'jimpark',
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
    name: 'jihyeole',
    state: false,
  },
  {
    name: 'jimpark',
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
    name: 'jihyeole',
    state: false,
  },
  {
    name: 'jimpark',
    state: false,
  },
  {
    name: 'jihyeole',
    state: false,
  },
];

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('FriendRequest');
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
    <div class="contentsContainer">
    <div class="friendContainer">
      <h1 id="friendspageTitle">Friends</h1>
      <div class="friendsHeader">
        <nav class="friends_nav">
          <a class="friends_nav__link" data-spa href="/friends">
            friends
          </a>
          <a class="friends_nav__link" data-spa href="/friends/search">
            Search
          </a>
          <a class="friends_nav__link" data-spa href="/friends/blocked">
            blocked
          </a>
          <a
            class="friends_nav__link"
            style="background-color:rgba(111,111,111,0.38)"
            data-spa
            href="/friends/request">
            request
          </a>
        </nav>
        <div class="searchBarContainer"></div>
      </div>
      <div class="requestContainer">
        <div class="requestInnerContainer">
          <div class="recievedTitle">recieved</div>
          <div class="recievedListContainer" style="border:2px solid white; border-radius:10px; padding:20px">
          </div>
        </div>
        <div class="requestInnerContainer">
          <div class="sentTitle">sent</div>
          <div class="sentListContainer" style="border:2px solid white; border-radius:10px; padding:20px">
          </div>
              <div class="cancelRequestModalContainer">
      <div class="cancelRequestModal">
        <div class="cancelRequestModalMsg"></div>
        <div class="cancelRequestModalButtons">
          <button class="closeRequestModalBtn">cancel</button>
          <button class="cancelRequestModalBtn">yes</button>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  </div>
  
		`;
  }

  updateReceivedUserList() {
    const recievedListContainer = document.querySelector(
      '.recievedListContainer',
    );
    recievedListContainer.innerHTML = `${recieved
      .map(
        (user, index) => `
        <div class="friendList" style="padding:0px 10px" key=${index}>
        <div class="friendProfile">
          <div class="friendProfileImg"> ${
            user.state
              ? '<img class="onlineImg" src="/public/online.png"/>'
              : ''
          }</div> 
          <div class="friendname">${user.name}</div>
        </div>
        <div class="requestIcons">
        <svg class="rejectRecievedIcon" data-key='${index}' xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/></svg>
        <svg class="acceptIcon" data-key='${index}' xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7L10 17l-5-5"/></svg>
        </div>
    </div>
  `,
      )
      .join('')}`;
    this.bindRecievedUserListEvents();
  }
  bindRecievedUserListEvents() {
    const acceptIcons = document.querySelectorAll('.acceptIcon');
    acceptIcons.forEach(acceptIcon => {
      acceptIcon.addEventListener('click', e => {
        //친구에 추가
        const index = e.target.dataset.key;
        recieved.splice(index, 1);
        this.updateReceivedUserList();
      });
    });
    const rejectRecievedIcons = document.querySelectorAll(
      '.rejectRecievedIcon',
    );
    rejectRecievedIcons.forEach(rejectRecievedIcon => {
      rejectRecievedIcon.addEventListener('click', e => {
        const index = e.target.dataset.key;
        recieved.splice(index, 1);
        this.updateReceivedUserList();
      });
    });
  }

  updateSentUserList() {
    const sentListContainer = document.querySelector('.sentListContainer');
    sentListContainer.innerHTML = `${sent
      .map(
        (user, index) => `
       <div class="friendList" style="padding:0% 4%" key=${index}>
       <div class="friendProfile">
         <div class="friendProfileImg"> ${
           user.state ? '<img class="onlineImg" src="/public/online.png"/>' : ''
         }</div> 
         <div class="friendname">${user.name}</div>
       </div>
       <div class="requestIcons">
       <svg class="cancelSentIcon" data-key='${index}' xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/></svg>
       </div> 
   </div>
 `,
      )
      .join('')}`;
    this.bindSentUserListEvents();
  }

  bindSentUserListEvents() {
    const cancelRequestModal = document.querySelector(
      '.cancelRequestModalContainer',
    );
    const cancelRequestModalMsg = document.querySelector(
      '.cancelRequestModalMsg',
    );
    const cancelSentIcons = document.querySelectorAll('.cancelSentIcon');
    cancelSentIcons.forEach(cancelSentIcon => {
      cancelSentIcon.addEventListener('click', e => {
        const index = e.currentTarget.dataset.key;
        console.log(index);
        const user = sent[index].name;
        // sent.splice(index, 1);
        // this.updateSentUserList();
        cancelRequestModalMsg.innerHTML = `Are you sure you want to delete friend request sent to ${user}?`;
        cancelRequestModal.classList.add('active');
        cancelRequestModal.setAttribute('data-key', index);
      });
    });
  }

  afterRender() {
    const cancelRequestModal = document.querySelector(
      '.cancelRequestModalContainer',
    );
    const cancelRequestModalBtn = document.querySelector(
      '.cancelRequestModalBtn',
    );
    const closeRequestModalBtn = document.querySelector(
      '.closeRequestModalBtn',
    );

    closeRequestModalBtn.addEventListener('click', () => {
      cancelRequestModal.classList.remove('active');
    });

    if (!checkModalEvent) {
      cancelRequestModalBtn.addEventListener('click', e => {
        const index = cancelRequestModal.getAttribute('data-key');
        //친구요청 취소
        sent.splice(index, 1);
        this.updateSentUserList();
        cancelRequestModal.classList.remove('active');
      });
    }
    this.updateReceivedUserList();
    this.updateSentUserList();
  }
}
