import AbstractView from '../../AbstractView.js';

const me = {
  name: 'jimpark',
  comment: '나는야 짐팍',
};
const competitior = {
  name: 'huipark',
  comment: '나는야 휘팍',
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
    <div class="playingUserName">${competitior.name}</div>
    <div class="playingUserImage"><img class="competitorsImg" src="/public/huipark.jpg"/></div>
    <div class="playingUserHistory"></div>
    <div class="playingUserComment">
    score
    <div class="competitorsTotalScore">1231</div></div>
    </div>
    </div>
    <div class="pingpongBody">
    <div class="gameScore"><text class="competitorsScore">2</text>:<text class="myScore">3</text></div>
    <div class="pingpongTable">
            <div class="pingpongStick"></div>
            <div class="pingpongBall"></div>
            <div class="myPingpongStick"></div>
            </div>
          </div>
          <div class="playingUserBody">
            <div class="playingUserInfo">
            <div class="playingUserName">${me.name}</div>
              <div class="playingUserImage"><img class="myImg" src="/public/huipark.jpg"/></div>
              <div class="playingUserHistory"></div>
              <div class="playingUserComment">
                score
                <div class="myTotalScore">13000</div>
              </div>
            </div>
          </div>
          </div>
            `;
  }
  afterRender() {
    const myPingpongStick = document.querySelector('.myPingpongStick');
    const pingpongTable = document.querySelector('.pingpongTable');
    const maxY = pingpongTable.clientHeight - myPingpongStick.clientHeight / 2;
    const gameOption = JSON.parse(localStorage.getItem('gameOption'));
    console.log(gameOption);
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
        console.log(style.top);
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
