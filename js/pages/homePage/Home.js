import AbstractView from '../../AbstractView.js';
import {getToken, setToken, refreshAccessToken} from '../../tokenManager.js';
import cws from '../../WebSocket/ConnectionSocket.js';
import {checkConnectionSocket} from '../../webSocketManager.js';
import qws from '../../WebSocket/QuickMatchSocket.js';
import {router} from '../../route.js';
import tws from '../../WebSocket/TournamentSocket.js';
import {responseBattleRequest} from '../../battleResponseEventHandler.js';
import {userProfileData} from '../../PlayersRestApi.js';

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
const $tournamentCancelBtn = document.querySelector('.tournamentCancelBtn');
const $tournamentModalContainer = document.querySelector(
  '.tournamentModalContainer',
);

const $allHistoryBtn = document.querySelector('.allHistoryBtn');

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
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.game = null;
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
    <div class="contentsContainer">
  <h1 id="gamepageTitle">Ranking</h1>
  <div class="usersRankBody">
  </div>
  <div class="usersHistoryBody">
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
          <img class="myMatchingImg" src=${
            JSON.parse(sessionStorage.getItem('user')).profile_img
          }/>
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

  ///nickname이랑 img player1 바꿔!
  updateHistory() {
    const usersHistoryBody = document.querySelector('.usersHistoryBody');
    console.log(usersHistoryBody);
    usersHistoryBody.innerHTML = `      ${
      this.game.games.length
        ? this.game.games
            .map(
              (game, index) => `
          <div class="usersHistory">
              <div class="recentPlayersImg">
                   <div class="recentPlayer1Img"><img class="recentPlayerImg" src=${
                     game.player1
                       ? game.player1.player_profile_img
                       : '../../../public/person.svg'
                   }></div>
                  <div class="recentPlayer2Img"><img class="recentPlayerImg" src=${
                    game.player2
                      ? game.player2.player_profile_img
                      : '../../../public/preson.svg'
                  }></div>
              </div>
              <div class="versus">
                ${game.player1 ? game.player1.nickname : '알수없음'} VS ${
                game.player2 ? game.player2.nickname : '알수없음'
              }
              </div>
              <div class="resultScore">
              <text style="color :${
                game.player1_score > game.player2_score ? 'black' : 'white'
              }">${game.player1_score}</text>
              &nbsp;:&nbsp;
              <text style="color : ${
                game.player2_score > game.player1_score ? 'black' : 'white'
              }">${game.player2_score}<text/></div>
             <div class="gameDate">${game.date}</div>
             </div>
             ${
               index === this.game.games.length - 1
                 ? ''
                 : '<div class="line"></div>'
             }

    `,
            )
            .join('')
        : '<div style="height:100%; text-align:center; font-size:1.4rem; color:darkgrey">No game records found</div>'
    }`;
  }

  updateRanking() {
    const usersRankBody = document.querySelector('.usersRankBody');
    usersRankBody.innerHTML = `${
      this.game.ranking.length !== 0
        ? this.game.ranking
            .map(
              (rank, index) => `
    <div class="usersRank" data-id='${rank.id}'>
    <svg class="starImg" xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
    <path fill="black" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"/>
    <text x="49%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="8">${
      index + 1
    }</text>
</svg>
    <div class="rankersInfo">
      <img class="rankersImg" src=${rank.profile_img}/>
      <div class="rankersName">${rank.nickname}</div>
    </div>
  </div>
    `,
            )
            .join('')
        : ''
    }`;
    this.bindUpadteRanking();
  }

  bindUpadteRanking() {
    const usersRanks = document.querySelectorAll('.usersRank');
    usersRanks.forEach(usersRank => {
      usersRank.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        userProfileData(id, 0, 0);
        $allHistoryBtn.classList.add('selected');
      });
    });
  }

  async gameInfo() {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const getGame = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/game/', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!res.ok) {
          if (res.status === 401) {
            await refreshAccessToken();
            return await getGame();
          } else throw new Error(`Server responded with status: ${res.status}`);
        } else {
          const data = await res.json();
          this.game = data.data;
          console.log(this.game);
        }
      } catch (error) {
        console.log('get Game error', error);
      }
    };
    await getGame();
  }

  async afterRender() {
    await this.gameInfo();
    this.updateRanking();
    this.updateHistory();
    await checkConnectionSocket(this.socketEventHandler.bind(this));
    const $quickMatchBtn = document.querySelector('.quickMatchButton');
    const $tournamentBtn = document.querySelector('.tournamentButton');
    const $quickMatchModal = document.querySelector(
      '.quickMatchModalContainer',
    );
    const $matchingCancelBtn = document.querySelector('.matchingCancelBtn');
    await checkConnectionSocket();
    console.log(this.user);
    console.log('ACCESS = ', getToken());
    console.log('REFRESH', sessionStorage.getItem('refresh_token'));

    $tournamentBtn.addEventListener('click', async () => {
      $tournamentModal.classList.add('show');
    });

    $quickMatchBtn.addEventListener('click', () => {
      $gameOptionModalContainer.setAttribute('data-modaloption', 'quickmatch');
      $gameOptionModalContainer.classList.add('show');
    });

    $matchingCancelBtn.addEventListener('click', () => {
      qws.close();
      $quickMatchModal.classList.remove('active');
    });
    $battleCancelBtn.addEventListener('click', () => {
      $battleModalContainer.classList.remove('active');
    });
    $tournamentCancelBtn.addEventListener('click', () => {
      tws.close();
      $tournamentModalContainer.classList.remove('active');
    });
  }
  async socketEventHandler(message) {
    responseBattleRequest(message);
  }
}
