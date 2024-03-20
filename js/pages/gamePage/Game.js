import AbstractView from '../../AbstractView.js';
import tws from '../../WebSocket/TournamentSocket.js';
import cws from '../../WebSocket/ConnectionSocket.js';
import qws from '../../WebSocket/QuickMatchSocket.js';
import DirectChat from '../chatPage/DirectChat.js';

let isMovingUp = false;
let isMovingDown = false;

function convertClientPositionToServerPosition(clientY) {
  const serverY = (clientY / this.tableHeight) * 490;
  return serverY;
}

function convertServerPositionToScreenPosition(serverX, serverY) {
  const screenX = (serverX / 660 + 0.5) * this.tableWidth;
  const screenY = (serverY / 490 + 0.5) * this.tableHeight;

  return [screenX, screenY];
}

// function convertServerPositionToScreenPosition(serverX, serverY) {
//   // 서버 좌표에서 클라이언트 화면 좌표로 변환
//   // 서버의 x 좌표는 [-340, 340], y 좌표는 [-245, 245] 범위를 갖습니다.
//   // 이를 클라이언트 화면의 크기에 맞추어 변환합니다.

//   // 먼저 서버 좌표를 [0, 1]의 비율로 변환
//   const normalizedX = (serverX + 340) / 680; // [-340, 340] -> [0, 1]
//   const normalizedY = (serverY + 245) / 490; // [-245, 245] -> [0, 1]

//   // 정규화된 비율을 사용하여 클라이언트 화면의 픽셀 좌표로 변환
//   const screenX = normalizedX * this.tableWidth;
//   const screenY = normalizedY * this.tableHeight;

//   // 클라이언트의 탁구대 중앙을 (0,0)으로 설정하기 위해
//   // y 좌표의 경우 클라이언트 화면 높이의 절반을 기준으로 조정할 필요가 있습니다.
//   // 하지만 이미 [-245, 245] -> [0, 1]로 정규화하고, 그 비율을 클라이언트 화면 크기에 맞춰 변환했기 때문에
//   // 이 과정은 중앙을 기준으로 이미 조정된 것입니다.

//   return [screenX, screenY];
// }

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
    this.myPingpongStick = null;
    this.centerY = null;
    this.gameOption = JSON.parse(sessionStorage.getItem('gameOption'));
    this.tableWeigth = null;
    this.tableHeight = null;
  }
  async getHtml() {
    return `
    <div class="gameBody">
    <div class="playingUserBody">
      <div class="playingUserInfo">
        <div class="playingUserName">${player1.name}</div>
        <div class="playingUserImage">
          <img class="player1Img" src="/public/huipark.jpg" />
        </div>
        <div class="playingUserTotalScore">
          score
          <div class="player1TotalScore">1231</div>
        </div>
      </div>
    </div>
    <div class="pingpongBody">
      <div class="gameScore">
        <text class="plsyer1Score">2</text>:<text class="player2Score">3</text>
      </div>
      <div class="pingpongTable">
        <img class="pongworldImg" src="/public/pongworld.png" />
        <div class="player1PingpongStick"></div>
        <div id="pingpongBall"></div>
        <div class="player2PingpongStick"></div>
      </div>
    </div>
    <div class="playingUserBody">
      <div class="playingUserInfo">
        <div class="playingUserName">${player2.name}</div>
        <div class="playingUserImage">
          <img class="player2Img" src="/public/huipark.jpg" />
        </div>
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
          <svg
            class="crownSvg"
            xmlns="http://www.w3.org/2000/svg"
            width="3.2em"
            height="2.8em"
            viewBox="0 0 20 20">
            <g fill="black">
              <g opacity="0.2">
                <path d="M4.62 8.496c-.217-.892.781-1.581 1.538-1.061l1.83 1.256a1 1 0 0 0 1.417-.298l1.244-2.016a1 1 0 0 1 1.702 0l1.244 2.016a1 1 0 0 0 1.417.298l1.83-1.256c.757-.52 1.755.169 1.538 1.06l-1.4 5.742a1 1 0 0 1-.971.763H6.99a1 1 0 0 1-.971-.763z" />
                <path
                  fill-rule="evenodd"
                  d="M15.825 10.532a3 3 0 0 1-3.931-1.088l-.394-.638l-.394.638a3 3 0 0 1-3.93 1.088l.6 2.468h7.447zM6.158 7.435c-.757-.52-1.755.169-1.538 1.06l1.4 5.742a1 1 0 0 0 .97.763h9.018a1 1 0 0 0 .971-.763l1.4-5.741c.217-.892-.781-1.581-1.538-1.061l-1.83 1.256a1 1 0 0 1-1.417-.298L12.35 6.377a1 1 0 0 0-1.702 0L9.405 8.393a1 1 0 0 1-1.417.298z"
                  clip-rule="evenodd"
                />
                <path d="M12.5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0M20 6a1 1 0 1 1-2 0a1 1 0 0 1 2 0" />
                <path
                  fill-rule="evenodd"
                  d="M6.25 16.5a.75.75 0 0 1 .75-.75h8.737a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75"
                  clip-rule="evenodd"
                />
                <path d="M5 6a1 1 0 1 1-2 0a1 1 0 0 1 2 0" />
              </g>
              <path
                fill-rule="evenodd"
                d="m14.896 13.818l1.515-5.766l-2.214 1.41a2 2 0 0 1-2.74-.578L10 6.695l-1.458 2.19a2 2 0 0 1-2.74.577L3.59 8.052l1.515 5.766zm-10.77-6.61c-.767-.489-1.736.218-1.505 1.098l1.516 5.766a1 1 0 0 0 .967.746h9.792a1 1 0 0 0 .967-.746l1.516-5.766c.23-.88-.738-1.586-1.505-1.098l-2.214 1.41a1 1 0 0 1-1.37-.288l-1.458-2.19a1 1 0 0 0-1.664 0L7.71 8.33a1 1 0 0 1-1.37.289z"
                clip-rule="evenodd"
              />
              <path d="M10.944 3.945a.945.945 0 1 1-1.89.002a.945.945 0 0 1 1.89-.002M18.5 5.836a.945.945 0 1 1-1.89.001a.945.945 0 0 1 1.89 0M3.389 5.836a.945.945 0 1 1-1.89.001a.945.945 0 0 1 1.89 0" />
              <path
                fill-rule="evenodd"
                d="M5.25 16a.5.5 0 0 1 .5-.5h8.737a.5.5 0 1 1 0 1H5.75a.5.5 0 0 1-.5-.5"
                clip-rule="evenodd"
              />
            </g>
          </svg>
          <img class="winnerImg" src="/public/huipark.jpg" />
        </div>
        <a class="goHomeBtn" href="/home">
          go home
        </a>
      </div>
    </div>
  </div>
            `;
  }

  sendStick(coordinate) {
    console.log(coordinate);
    qws.send({
      command: 'move_paddle',
      y_coordinate: coordinate,
    });
  }

  update(coor) {
    const y = convertClientPositionToServerPosition.bind(this)(
      coor - this.centerY,
    );
    this.sendStick(y);
    requestAnimationFrame(() => {
      this.myPingpongStick.style.top = coor + 'px';
    });
  }

  onMouseMove(maxY) {
    if (this.gameOption.control === 'mouse') {
      document.addEventListener('mousemove', event => {
        const mouseY = event.clientY - 150;
        this.myPingpongStick.style.top =
          Math.min(
            Math.max(this.myPingpongStick.offsetHeight / 2, mouseY),
            maxY,
          ) + 'px';
      });
    }
  }

  animatePaddleMovement(maxY) {
    if (!this.animationFrameRequest) {
      const animate = () => {
        if (isMovingUp || isMovingDown) {
          const style = window.getComputedStyle(this.myPingpongStick);
          let newPosition = parseInt(style.top);

          if (isMovingUp)
            newPosition = Math.max(
              newPosition - 5,
              this.myPingpongStick.offsetHeight / 2,
            );
          if (isMovingDown) newPosition = Math.min(newPosition + 5, maxY);

          this.update(newPosition);
          this.myPingpongStick.style.top = `${newPosition}px`;
          this.animationFrameRequest = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(this.animationFrameRequest);
          this.animationFrameRequest = null;
        }
      };
      this.animationFrameRequest = requestAnimationFrame(animate);
    }
  }

  onKeyboardMove(maxY) {
    let coor = 0;
    if (this.gameOption.control === 'keyboard') {
      const style = window.getComputedStyle(this.myPingpongStick);
      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowUp') isMovingUp = true;
        else if (e.key === 'ArrowDown') isMovingDown = true;
        this.animatePaddleMovement(maxY);
      });
      document.addEventListener('keyup', e => {
        if (e.key === 'ArrowUp') isMovingUp = false;
        else if (e.key === 'ArrowDown') isMovingDown = false;
      });

      // setInterval(() => {
      //   if (isMovingUp) {
      //     coor = Math.max(
      //       parseInt(style.top) - 30,
      //       this.myPingpongStick.offsetHeight / 2,
      //     );
      //     this.update(coor);
      //   } else if (isMovingDown) {
      //     coor = Math.min(parseInt(style.top) + 30, maxY);
      //     this.update(coor);
      //   }
      // }, 1000 / 40); // 60프레임으로 설정
    }
  }

  checkControl() {
    const pingpongTable = document.querySelector('.pingpongTable');
    const maxY =
      pingpongTable.clientHeight - this.myPingpongStick.clientHeight / 2;

    this.onMouseMove(maxY);
    this.onKeyboardMove(maxY);
  }

  updateBallPosition(ballPosition) {
    const ball = document.getElementById('pingpongBall');
    const [x, y] = convertServerPositionToScreenPosition.bind(this)(
      ballPosition[0],
      ballPosition[1],
    );
    // 854.6470588235294 497.7612244897959
    // 854.6470588235295 497.7612244897959

    console.log(x, y);
    if (ball) {
      ball.style.left = `${x}px`;
      ball.style.top = `${y}px`;
    }
  }

  afterRender() {
    this.sendStick(0);
    const $battleModalContainer = document.querySelector(
      '.battleModalContainer',
    );
    $battleModalContainer.classList.remove('active');
    const myPingpongStick = document.querySelector(
      `.${sessionStorage.getItem('myPosition')}PingpongStick`,
    );
    const opponentPingpongStick = document.querySelector(
      `.${sessionStorage.getItem('opponentsPosition')}PingpongStick`,
    );
    const table = document.querySelector('.pingpongTable');
    this.myPingpongStick = myPingpongStick;
    this.tableWidth = table.offsetWidth;
    this.tableHeight = table.offsetHeight;
    this.centerY = this.tableHeight / 2;

    this.checkControl();

    qws.onMessage(message => {
      console.log(message);
      if (message.type === 'BALL_POSITION') {
        const ballPosition = message.data.position;
        this.updateBallPosition(ballPosition);
      }
    });
  }
}
