import AbstractView from '../../AbstractView.js';
import {getToken, refreshAccessToken} from '../../tokenManager.js';
import {checkConnectionSocket} from '../../WebSocket/webSocketManager.js';
import qws from '../../WebSocket/QuickMatchSocket.js';
import {responseBattleRequest} from '../../battleResponseEventHandler.js';
import {userProfileData} from '../../PlayersRestApi.js';
import API_URL from '../../../config.js';
import QuickMatchModal from '../../modal/QuickMatchModal.js';
import Tournament from '../../modal/TournamentReadyModal.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('PongWorldㅣHome');
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.game = null;
  }

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
    "></div>
    <div class="quickMatchButton"><text class="quickMatchButtonText">quick match</text><img class="quickMatchSvg" src="/public/quickmatch.svg"></div>
  </div>
  <div class="quickMatchModalContainer">
      <div class="quickMatchModal">
        <div class="matchingText">Waiting for a match to be found</div>
        <div class="matchingOpponent">
          <div class="myMatching">
          <img class="myMatchingImg" src=${
            JSON.parse(sessionStorage.getItem('user')) &&
            JSON.parse(sessionStorage.getItem('user')).profile_img
          }>
          </div>
          vs
          <div class="opponentMatching">
          <img class="opponentMatchingImg" src="/public/threedotsLoading.svg">
          </div>
        </div>
           <button class="matchingCancelBtn">cancel</button>
        </div>
  </div>
</div>
		`;
  }

  updateHistory() {
    const usersHistoryBody = document.querySelector('.usersHistoryBody');
    usersHistoryBody.innerHTML = `      ${
      this.game.games !== 'No game'
        ? this.game.games
            .map(
              (game, index) => `
          <div class="usersHistory">
              <div class="recentPlayersImg">
                   <div class="recentPlayer1Img"><img class="recentPlayerImg" src=${
                     game.player1
                       ? game.player1.player_profile_img
                       : '/public/person.svg'
                   }></div>
                  <div class="recentPlayer2Img"><img class="recentPlayerImg" src=${
                    game.player2
                      ? game.player2.player_profile_img
                      : '/public/person.svg'
                  }></div>
              </div>
              <div class="versus">
                ${game.player1 ? game.player1.nickname : '(unknown)'} VS ${
                game.player2 ? game.player2.nickname : '(unknown)'
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
    <svg class="starImg" xmlns="http://www.w3.org/2000/svg" width="3.5em" height="3.5em" viewBox="0 0 24 24">
    <path fill="black" d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"/>
    <text x="49%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="8">${
      index + 1
    }</text>
</svg>
    <div class="rankersInfo">
      <img class="rankersImg" src=${rank.profile_img}>
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
      });
    });
  }

  async gameInfo() {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const getGame = async () => {
      try {
        const res = await fetch(`${API_URL}/game/`, {
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
        }
      } catch (error) {
        console.log('get Game error', error);
      }
    };
    await getGame();
  }

  async afterRender() {
    await checkConnectionSocket(this.socketEventHandler.bind(this));
    await this.gameInfo();
    this.updateRanking();
    this.updateHistory();
    const $quickMatchBtn = document.querySelector('.quickMatchButton');
    const $tournamentBtn = document.querySelector('.tournamentButton');
    const $quickMatchModal = document.querySelector(
      '.quickMatchModalContainer',
    );
    const $matchingCancelBtn = document.querySelector('.matchingCancelBtn');
    await checkConnectionSocket();

    $tournamentBtn.addEventListener('click', async () => {
      new Tournament().renderModal();
    });

    $quickMatchBtn.addEventListener('click', async () => {
      new QuickMatchModal().renderModal();
    });

    $matchingCancelBtn.addEventListener('click', () => {
      qws.close();
      $quickMatchModal.classList.remove('active');
    });
  }
  async socketEventHandler(message) {
    responseBattleRequest(message);
  }
}
