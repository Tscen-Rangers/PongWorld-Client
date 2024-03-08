import AbstractView from '../../AbstractView.js';
import {getToken, setToken, refreshAccessToken} from '../../tokenManager.js';
import tws from '../../WebSocket/TournamentSocket.js';
import cws from '../../WebSocket/ConnectionSocket.js';
import {checkConnectionSocket} from '../../webSocketManager.js';
import qws from '../../WebSocket/QuickMatchSocket.js';
import {router} from '../../route.js';

const histories = [
  {
    player1: 'jimpark',
    player2: 'hacho',
    player1Score: 2,
    player2Score: 3,
    date: '2 days ago',
  },
  {
    player1: 'jimpark',
    player2: 'hacho',
    player1Score: 2,
    player2Score: 3,
    date: '2 days ago',
  },
  {
    player1: 'jimpark',
    player2: 'hacho',
    player1Score: 2,
    player2Score: 3,
    date: '2 days ago',
  },
  {
    player1: 'jimpark',
    player2: 'hacho',
    player1Score: 2,
    player2Score: 3,
    date: '2 days ago',
  },
  {
    player1: 'jimpark',
    player2: 'hacho',
    player1Score: 2,
    player2Score: 3,
    date: '2 days ago',
  },
  {
    player1: 'jimpark',
    player2: 'hacho',
    player1Score: 2,
    player2Score: 3,
    date: '2 days ago',
  },
  {
    player1: 'jimpark',
    player2: 'hacho',
    player1Score: 2,
    player2Score: 3,
    date: '2 days ago',
  },
  {
    player1: 'jimpark',
    player2: 'hacho',
    player1Score: 2,
    player2Score: 3,
    date: '2 days ago',
  },
  {
    player1: 'jimpark',
    player2: 'hacho',
    player1Score: 2,
    player2Score: 3,
    date: '2 days ago',
  },
  {
    player1: 'jimpark',
    player2: 'hacho',
    player1Score: 2,
    player2Score: 3,
    date: '2 days ago',
  },
];

const Rankings = [
  {rankersName: 'jimpark', score: 4000},
  {rankersName: 'huipark', score: 3600},
  {rankersName: 'jihyeole', score: 2800},
  {rankersName: 'yubchoi', score: 2000},
  {rankersName: 'junkpark', score: 1500},
];

const users = [
  {id: 1, profile: '/public/huipark.jpg'},
  {id: 2, profile: '/public/huipark.jpg'},
  {id: 3, profile: '/public/huipark.jpg'},
  {id: 4, profile: '/public/huipark.jpg'},
];

const $gameOptionModalContainer = document.getElementById(
  'gameOptionModalContainer',
);
const $battlePlayer = document.querySelector('.battlePlayer');
const $battleModalContainer = document.querySelector('.battleModalContainer');
const $battleMsg = document.querySelector('.battleMsg');
const $currentStaff = document.querySelector('.currentStaff');
const $battleCancelBtn = document.querySelector('.battleCancelBtn');
const $tournamentModal = document.getElementById(
  'tournamentControlModalBackground',
);

function onMatchComplete() {
  // 2초 후에 실행될 함수
  setTimeout(function () {
    // 게임 화면으로 이동
    window.history.pushState(null, null, '/game'); // '/gameScreenURL'은 게임 화면의 URL로 변경해야 합니다.
    router();
  }, 3000); // 2000 밀리초 = 2초
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Game');
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
    <div class="contentsContainer">
  <h1 id="gamepageTitle">Ranking</h1>
  <div class="usersRankBody">
    <div class="usersRank">
      <svg
        class="starImg"
        xmlns="http://www.w3.org/2000/svg"
        width="3em"
        height="3em"
        viewBox="0 0 24 24">
        <path
          fill="#000000"
          d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
        />
      </svg>
      <div class="rankersInfo">
     <img class="rankersImg" src="/public/huipark.jpg"/> <div class="rankersName">${
       Rankings[0].rankersName
     }</div>
      </div>
    </div>
    <div class="usersRank">
      <svg
        class="starImg"
        xmlns="http://www.w3.org/2000/svg"
        width="3em"
        height="3em"
        viewBox="0 0 24 24">
        <path
          fill="#5B5858"
          d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
        />
      </svg>
      <div class="rankersInfo">
      <img class="rankersImg" src="/public/huipark.jpg"/> <div class="rankersName">${
        Rankings[1].rankersName
      }</div>
       </div>
    </div>
    <div class="usersRank">
      <svg
        class="starImg"
        xmlns="http://www.w3.org/2000/svg"
        width="3em"
        height="3em"
        viewBox="0 0 24 24">
        <path
          fill="#8C8C8C"
          d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
        />
      </svg>
      <div class="rankersInfo">
      <img class="rankersImg" src="/public/huipark.jpg"/> <div class="rankersName">${
        Rankings[2].rankersName
      }</div>
       </div>
    </div>
    <div class="usersRank">
      <svg
        class="starImg"
        xmlns="http://www.w3.org/2000/svg"
        width="3em"
        height="3em"
        viewBox="0 0 24 24">
        <path
          fill="#B2AEAE"
          d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
        />
      </svg>
      <div class="rankersInfo">
      <img class="rankersImg" src="/public/huipark.jpg"/> <div class="rankersName">${
        Rankings[3].rankersName
      }</div>
       </div>
    </div>
    <div class="usersRank">
    <svg
      class="starImg"
      xmlns="http://www.w3.org/2000/svg"
      width="3em"
      height="3em"
      viewBox="0 0 24 24">
      <path
        fill="#C4BFBF"
        d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
      />
    </svg>
    <div class="rankersInfo">
    <img class="rankersImg" src="/public/huipark.jpg"/> <div class="rankersName">${
      Rankings[4].rankersName
    }</div>
     </div>
  </div>
  </div>
  <div class="usersHistoryBody">
      ${histories
        .map(
          (history, index) => `
            <div class="usersHistory">
                <div class="recentPlayersImg">
                     <div class="recentPlayer1Img"><img class="recentPlayerImg" src="/public/huipark.jpg"/></div>
                    <div class="recentPlayer2Img"><img class="recentPlayerImg" src="/public/huipark.jpg"/></div>
                </div>
                <div class="versus">
                  ${history.player1} VS ${history.player2}
                </div>
                <div class="resultScore">
                <text style="color :${
                  history.player1Score > history.player2Score
                    ? 'black'
                    : 'white'
                }">${history.player1Score}</text>
                :
                <text style="color : ${
                  history.player2Score > history.player1Score
                    ? 'black'
                    : 'white'
                }">${history.player2Score}<text/></div>
               <div class="gameDate">${history.date}</div>
               </div>
               ${index === 9 ? '' : '<div class="line"></div>'}

      `,
        )
        .join('')}
  </div>
  <div class="playgameDiv">
    <div class="tournamentButton"><text class="tournamentButtonText">tournament</text><img class="tournamentSvg" src="/public/tournament.svg
    "/></div>
    <div class="quickMatchButton"><text class="quickMatchButtonText">quick match</text><img class="quickMatchSvg" src="/public/quickmatch.svg" /></div>
  </div>
  <div class="quickMatchModalContainer">
      <div class="quickMatchModal">
        <div class="matchingText">Waiting for a match to be found</div>
        <div class="matchingOpponent">
          <div class="myMatching">
          <img class="myMatchingImg" src="/public/huipark.jpg"/>
          </div>
          vs
          <div class="opponentMatching">
          <img class="opponentMatchingImg" src="/public/threedotsLoading.svg"/>
          </div>
        </div>
           <button class="matchingCancelBtn">cancel</button>
        </div>
  </div>
</div>
		`;
  }

  async afterRender() {
    const $quickMatchBtn = document.querySelector('.quickMatchButton');
    const $tournamentBtn = document.querySelector('.tournamentButton');
    const $quickMatchModal = document.querySelector(
      '.quickMatchModalContainer',
    );
    const $matchingCancelBtn = document.querySelector('.matchingCancelBtn');

    checkConnectionSocket();

    console.log(this.user);
    console.log('ACCESS = ', getToken());
    console.log('REFRESH', sessionStorage.getItem('refresh_token'));

    $tournamentBtn.addEventListener('click', async () => {
      $tournamentModal.classList.add('show');

      //       $battleMsg.innerHTML =
      //         'Waiting for all <br /> players to join the tournament...';
      //       if (!getToken().length) await refreshAccessToken();
      //       tws.connect('ws://127.0.0.1:8000/ws/tournament/');
      //       tws.onMessage(msg => {
      //         if (msg.participants_num)
      //           $currentStaff.innerText = `${msg.participants_num}/4`;
      //         else {
      //           if (msg.data.id) {
      //             sessionStorage.setItem('tournament_id', msg.data.id);
      //           }
      //           $currentStaff.innerText = `4/4`;
      //           $battleMsg.innerHTML =
      //             'Tournament Ready<br />The game will start soon!';
      //           onMatchComplete();
      //         }
      // if (msg.data.players) {
      //   console.log(msg.data);
      //   // console.log(msg.data.players);
      //   $currentStaff.innerText = `4/4`;
      //   $battleMsg.innerHTML =
      //     'Tournament Ready<br />The game will start soon!';
      // } else if (msg.data) {
      //   console.log(msg.data);
      //   //session에 저장해두기?
      // }
    });

    //       $battleModalContainer.classList.add('active');

    $quickMatchBtn.addEventListener('click', () => {
      $gameOptionModalContainer.setAttribute('data-modaloption', 'quickmatch');
      $gameOptionModalContainer.classList.add('show');
    });

    $matchingCancelBtn.addEventListener('click', () => {
      qws.onclose();
      $quickMatchModal.classList.remove('active');
    });
    $battleCancelBtn.addEventListener('click', () => {
      // tws.onclose();
      $battleModalContainer.classList.remove('active');
    });
  }
}
