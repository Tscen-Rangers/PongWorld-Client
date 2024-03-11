import AbstractView from '../../AbstractView.js';
import tws from '../../WebSocket/TournamentSocket.js';

const player1 = {
  name: 'jimpark',
  totalScore: 0,
};
const player2 = {
  name: 'huipark',
  totalScore: 0,
};

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Game');
  }
  async getHtml() {
    return `
    <div class="gameBody">
    <div class="playingUserBody">
    <div class="playingUserInfo">
    <div class="playingUserName">${player1.name}</div>
    <div class="playingUserImage"><img class="player1Img" src="/public/huipark.jpg"/></div>
    <div class="playingUserTotalScore">
    score
    <div class="player1TotalScore">1231</div></div>
    </div>
    </div>
    <div class="pingpongBody">
    <div class="gameScore"><text class="plsyer1Score">2</text>:<text class="player2Score">3</text></div>
    <div class="pingpongTable">
            <img class="pongworldImg" src="/public/pongworld.png"/>
            <div class="player1PingpongStick"></div>
            <div class="pingpongBall"></div>
            <div class="player2PingpongStick"></div>
            </div>
          </div>
          <div class="playingUserBody">
            <div class="playingUserInfo">
            <div class="playingUserName">${player2.name}</div>
              <div class="playingUserImage"><img class="player2Img" src="/public/huipark.jpg"/></div>
              <div class="playingUserTotalScore">
                score
                <div class="player2TotalScore">13000</div>
              </div>
            </div>
          </div>
        <div class="gameResultModalContainer">
          <div class="gameResultModal">
              <div class="winnerText">WINNER</div>
              <div class="winner">
              <svg  class="crownSvg" xmlns="http://www.w3.org/2000/svg" width="3.2em" height="2.8em" viewBox="0 0 20 20">
              <g fill="black"><g opacity="0.2"><path d="M4.62 8.496c-.217-.892.781-1.581 1.538-1.061l1.83 1.256a1 1 0 0 0 1.417-.298l1.244-2.016a1 1 0 0 1 1.702 0l1.244 2.016a1 1 0 0 0 1.417.298l1.83-1.256c.757-.52 1.755.169 1.538 1.06l-1.4 5.742a1 1 0 0 1-.971.763H6.99a1 1 0 0 1-.971-.763z"/>
              <path fill-rule="evenodd" d="M15.825 10.532a3 3 0 0 1-3.931-1.088l-.394-.638l-.394.638a3 3 0 0 1-3.93 1.088l.6 2.468h7.447zM6.158 7.435c-.757-.52-1.755.169-1.538 1.06l1.4 5.742a1 1 0 0 0 .97.763h9.018a1 1 0 0 0 .971-.763l1.4-5.741c.217-.892-.781-1.581-1.538-1.061l-1.83 1.256a1 1 0 0 1-1.417-.298L12.35 6.377a1 1 0 0 0-1.702 0L9.405 8.393a1 1 0 0 1-1.417.298z" clip-rule="evenodd"/>
              <path d="M12.5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0M20 6a1 1 0 1 1-2 0a1 1 0 0 1 2 0"/>
              <path fill-rule="evenodd" d="M6.25 16.5a.75.75 0 0 1 .75-.75h8.737a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75" clip-rule="evenodd"/>
              <path d="M5 6a1 1 0 1 1-2 0a1 1 0 0 1 2 0"/></g>
              <path fill-rule="evenodd" d="m14.896 13.818l1.515-5.766l-2.214 1.41a2 2 0 0 1-2.74-.578L10 6.695l-1.458 2.19a2 2 0 0 1-2.74.577L3.59 8.052l1.515 5.766zm-10.77-6.61c-.767-.489-1.736.218-1.505 1.098l1.516 5.766a1 1 0 0 0 .967.746h9.792a1 1 0 0 0 .967-.746l1.516-5.766c.23-.88-.738-1.586-1.505-1.098l-2.214 1.41a1 1 0 0 1-1.37-.288l-1.458-2.19a1 1 0 0 0-1.664 0L7.71 8.33a1 1 0 0 1-1.37.289z" clip-rule="evenodd"/>
              <path d="M10.944 3.945a.945.945 0 1 1-1.89.002a.945.945 0 0 1 1.89-.002M18.5 5.836a.945.945 0 1 1-1.89.001a.945.945 0 0 1 1.89 0M3.389 5.836a.945.945 0 1 1-1.89.001a.945.945 0 0 1 1.89 0"/>
              <path fill-rule="evenodd" d="M5.25 16a.5.5 0 0 1 .5-.5h8.737a.5.5 0 1 1 0 1H5.75a.5.5 0 0 1-.5-.5" clip-rule="evenodd"/></g>
              </svg>
                <img class="winnerImg" src="/public/huipark.jpg"/>
              </div>
              <a class="goHomeBtn" href='/home'>go home</a>
          </div>
        </div>
    </div>
            `;
  }
  afterRender() {
    const $battleModalContainer = document.querySelector(
      '.battleModalContainer',
    );
    $battleModalContainer.classList.remove('active');
    console.log(JSON.parse(sessionStorage.getItem('gameData')));
    const myPingpongStick = document.querySelector(
      `.${sessionStorage.getItem('myPosition')}PingpongStick`,
    );
    const opponentPingpongStick = document.querySelector(
      `.${sessionStorage.getItem('opponentsPosition')}PingpongStick`,
    );
    const pingpongTable = document.querySelector('.pingpongTable');
    const maxY = pingpongTable.clientHeight - myPingpongStick.clientHeight / 2;
    const gameOption = JSON.parse(sessionStorage.getItem('gameOption'));

    let topValue = null;
    if (gameOption.control === 'mouse') {
      document.addEventListener('mousemove', event => {
        const mouseY = event.clientY - 150;
        // myPingpongStick.style.top = mouseY + 'px';
        myPingpongStick.style.top = Math.min(Math.max(50, mouseY), maxY) + 'px';
      });
    }
    if (gameOption.control === 'keyboard') {
      const style = window.getComputedStyle(myPingpongStick);
      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowUp') {
          topValue = Math.max(parseInt(style.top) - 30, 50) + 'px';
          update();
        } else if (e.key === 'ArrowDown') {
          topValue = Math.min(parseInt(style.top) + 30, maxY) + 'px';
          update();
        }
      });
    }
    function update() {
      requestAnimationFrame(() => {
        myPingpongStick.style.top = topValue;
      });
    }
  }
}
