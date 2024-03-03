import AbstractView from '../../AbstractView.js';
import {getToken, setToken} from '../../tokenManager.js';

//ws://127.0.0.1:8000/ws/game/?player_id=1
// let tournamentSocket = null;

// function connectWebSocket(player_id) {
//   tournamentSocket = new WebSocket(
//     'ws://' +
//       '127.0.0.1:8000' +
//       '/ws/tournament/' +
//       '?player_id=' +
//       `${player_id}`,
//   );
//   tournamentSocket.onopen = function () {
//     console.log('성공');
//     // tournamentSocket.send(
//     //   JSON.stringify({
//     //     match_mode: 'random',
//     //     game_speed: 0,
//     //   }),
//     // );
//   };
// }
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

  afterRender() {
    console.log(getToken());
    console.log(sessionStorage.getItem('refresh_token'));
    const $quickMatchBtn = document.querySelector('.quickMatchButton');
    const $tournamentBtn = document.querySelector('.tournamentButton');
    const $quickMatchModal = document.querySelector(
      '.quickMatchModalContainer',
    );
    const $matchingCancelBtn = document.querySelector('.matchingCancelBtn');
    const $matchingText = document.querySelector('.matchingText');
    const $opponentMatchingImg = document.querySelector('.opponentMatchingImg');
    const $gameOptionNextBtn = document.getElementById('gameOptionNextBtn');

    console.log(this.user);

    $tournamentBtn.addEventListener('click', () => {
      $battleMsg.innerHTML =
        'Waiting for all <br /> players to join the tournament...';
      // connectWebSocket(1);
      // tournamentSocket.onmessage = e => {
      //   const data = JSON.parse(e.data);

      //   console.log(data.participants_num);
      //   if (data.participants_num)
      //     $currentStaff.innerText = `${data.participants_num}/4`;
      //   if (data.data) {
      //     $currentStaff.innerText = ``;
      //   }
      // };
      $battleModalContainer.classList.add('active');
    });
    $quickMatchBtn.addEventListener('click', () => {
      $gameOptionModalContainer.setAttribute('data-modaloption', 'quickmatch');
      $gameOptionModalContainer.classList.add('show');
    });

    $gameOptionNextBtn.addEventListener('click', () => {
      if ($gameOptionModalContainer.dataset.modaloption === 'quickmatch')
        $quickMatchModal.classList.add('active');
    });
    $matchingCancelBtn.addEventListener('click', () => {
      $quickMatchModal.classList.remove('active');
    });
    $battleCancelBtn.addEventListener('click', () => {
      // tournamentSocket.close();
      // tournamentSocket.onclose = () => {
      //   console.log('소켓닫기용');
      // };
      $battleModalContainer.classList.remove('active');
    });
  }
}
