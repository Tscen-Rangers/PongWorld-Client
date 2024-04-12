import AbstractView from '../../AbstractView.js';
import tws from '../../WebSocket/TournamentSocket.js';
import cws from '../../WebSocket/ConnectionSocket.js';
import qws from '../../WebSocket/QuickMatchSocket.js';
import lws from '../../WebSocket/LocalGameWebSocket.js';
import {checkConnectionSocket} from '../../WebSocket/webSocketManager.js';
import {router} from '../../route.js';
let isMovingUp = false;
let isMovingDown = false;
let isMovingUp2 = false,
  isMovingDown2 = false;

const checkSocket = async () => {
  const webSocketType = JSON.parse(sessionStorage.getItem('webSocketType'));
  let socket = null;
  if (webSocketType === 'START_RANDOM_GAME') socket = qws;
  else if (webSocketType === 'START_FRIEND_GAME') socket = cws;
  else if (webSocketType === 'START_TOURNAMENT_SEMI_FINAL') socket = tws;
  else if (webSocketType === 'START_LOCAL_GAME') socket = lws;

  if (
    !socket ||
    (socket && !socket.getWS()) ||
    (socket && socket.getWS().readyState === WebSocket.CLOSED)
  ) {
    history.pushState(null, null, '/home');
    return router();
  }

  return socket;
};

function convertClientToServerPosition(clientY) {
  // 클라이언트 측에서의 탁구채의 Y 위치 (translateY로 조정된 값)를 서버의 비율로 변환
  return (clientY * 490) / this.tableHeight;
}

function convertServerToClientPoition(y) {
  return (y / 490) * this.tableHeight;
}

function convertServerPositionToScreenPosition(serverX, serverY) {
  // 화면의 너비와 높이를 기준으로 서버 좌표를 화면 좌표로 변환
  const screenX = (serverX * this.tableWidth) / 660; // 가정: 서버 좌표계의 최대 x값이 660
  const screenY = (serverY * this.tableHeight) / 490; // 가정: 서버 좌표계의 최대 y값이 490

  // 변환된 화면 좌표 반환
  return [screenX, screenY];
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Game');
    this.pingpongTable = null;
    this.myPingpongStick = null;
    this.centerY = null;
    this.maxY = null;
    this.gameOption = JSON.parse(sessionStorage.getItem('gameOption'));
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.myInfo = JSON.parse(sessionStorage.getItem('gameMyInfo'));
    this.opponentInfo = JSON.parse(sessionStorage.getItem('gameOpponentInfo'));
    this.myPosition = sessionStorage.getItem('myPosition');
    this.tableWeigth = null;
    this.tableHeight = null;
    this.tableRect = null;
    //따로 this binding을 해주는 이유는 이벤트 리스너로 등록된 함수는 이벤트가 발생한 DOM 요소를 가르켜서 예상치 못한 동작을 해서 추가해줌
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyDown2 = this.handleKeyDown2.bind(this);
    this.handleKeyUp2 = this.handleKeyUp2.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.currentPosY = 0;
    this.currentPosY2 = 0;
    this.speed = 10; // 탁구채의 이동 속도
    this.socket = null;
  }

  async getHtml() {
    if (!this.myInfo || !this.opponentInfo) return;
    return `
    <div class="gameBody">
    <div class="playingUserBodyLeft">
      <div class="playingUserInfo">
        <div class="playingUserName">${
          this.myPosition === 'player1'
            ? this.myInfo.info.nickname
            : this.opponentInfo.info.nickname
        }</div>
        <div class="playingUserImage">
          <img class="player1Img" src=${
            this.myPosition === 'player1'
              ? this.myInfo.info.player_profile_img
              : this.opponentInfo.info.player_profile_img
          } >
        </div>
        <div class="playingUserTotalScore">
          score
          <div class="player1TotalScore">${
            this.myPosition === 'player1'
              ? this.myInfo.info.total_score
              : this.opponentInfo.info.total_score
          } </div>
        </div>
      </div>
    </div>
    <div class="pingpongBody">
      <div class="pingpongTable">
        <div class="gameScore">
          <text class="player1Score">0</text>:<text class="player2Score">0</text>
        </div>
        <img class="pongworldImg" src="/public/pongworld.png" />
        <div class="player1PingpongStick"></div>
        <div id="pingpongBall"></div>
        <div class="player2PingpongStick"></div>
      </div>
    </div>
    <div class="playingUserBodyRight">
      <div class="playingUserInfo">
        <div class="playingUserName">${
          this.myPosition === 'player2'
            ? this.myInfo.info.nickname
            : this.opponentInfo.info.nickname
        }</div>
        <div class="playingUserImage">
          <img class="player2Img" src=${
            this.myPosition === 'player2'
              ? this.myInfo.info.player_profile_img
              : this.opponentInfo.info.player_profile_img
          }  >
        </div>
        <div class="playingUserTotalScore">
          score
          <div class="player2TotalScore">${
            this.myPosition === 'player2'
              ? this.myInfo.info.total_score
              : this.opponentInfo.info.total_score
          }</div>
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
            width="3em"
            height="2.3em"
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
          <img class="winnerImg" src="/public/huipark.jpg" >
        </div>
        <div class="bye-message"></div>
        <div class="winnerName"></div>
        <div class="stateUpdate">
        <text class="stateUpdateTitle">Your updates</text>
        <div class="scoreUpdate">score<img id="scoreChange" src="/public/up.svg"><text id="score">1024<text></div>
        <div class="rankingUpdate">ranking<img id="rankingChange" src="/public/down.svg"><text id="ranking">5<text></div>
        </div>
        <div class="tournamentState"></div>
        <a class="goHomeBtn" data-spa href="/home">
          go home
        </a>
      </div>
    </div>
  </div>
            `;
  }

  sendStick(coordinate) {
    console.log(coordinate, this.socket);
    if (this.socket === cws)
      this.socket.send({
        type: 'invite_game',
        command: 'move_paddle',
        y_coordinate: coordinate,
      });
    else if (this.socket === tws) {
      this.socket.send({
        tournament_mode: 'move_paddle',
        y_coordinate: coordinate,
      });
    } else
      this.socket.send({
        command: 'move_paddle',
        y_coordinate: coordinate,
      });
  }

  localSendStick(coordinate, id) {
    this.socket.send({
      command: 'move_paddle',
      player_id: id,
      y_coordinate: coordinate,
    });
  }

  update() {
    const y = convertClientToServerPosition.bind(this)(this.currentPosY);
    if (this.socket === lws) this.localSendStick(y, 0);
    else this.sendStick(y);
  }

  update2() {
    const y = convertClientToServerPosition.bind(this)(this.currentPosY2);
    this.localSendStick(y, -1);
  }

  animatePaddleMovement() {
    const updatePosition = (stickRect, isUp, isDown, posY, updateFunc) => {
      let updatedPosY = posY;
      if (isUp) {
        if (stickRect.top - this.speed <= this.tableRect.top) {
          updatedPosY -= stickRect.top - this.tableRect.top;
        } else {
          updatedPosY -= this.speed;
        }
      } else if (isDown) {
        if (stickRect.bottom + this.speed >= this.tableRect.bottom) {
          updatedPosY += this.tableRect.bottom - stickRect.bottom;
        } else {
          updatedPosY += this.speed;
        }
      }
      updateFunc(updatedPosY);
    };

    let lastTime = 0;
    const fps = 60;
    const interval = 1000 / fps;

    const animate = currentTime => {
      const myStickRect = this.myPingpongStick.getBoundingClientRect();
      const opponentStickRect =
        this.opponentPingpongStick.getBoundingClientRect();
      const elapsed = currentTime - lastTime;

      if (elapsed > interval) {
        lastTime = currentTime - (elapsed % interval);

        if (this.socket === lws) {
          updatePosition(
            myStickRect,
            isMovingUp,
            isMovingDown,
            this.currentPosY,
            newPos => {
              this.currentPosY = newPos;
              this.update();
            },
          );
          updatePosition(
            opponentStickRect,
            isMovingUp2,
            isMovingDown2,
            this.currentPosY2,
            newPos => {
              this.currentPosY2 = newPos;
              this.update2();
            },
          );
        } else {
          updatePosition(
            myStickRect,
            isMovingUp,
            isMovingDown,
            this.currentPosY,
            newPos => {
              this.currentPosY = newPos;
              this.update();
            },
          );
        }

        this.myPingpongStick.style.transform = `translateY(${this.currentPosY}px)`;
        if (this.socket === lws) {
          this.opponentPingpongStick.style.transform = `translateY(${this.currentPosY2}px)`;
        }
      }

      // 움직임이 있는지 확인 후 애니메이션 프레임을 계속 요청하거나 취소
      if (
        isMovingUp ||
        isMovingDown ||
        (this.socket === lws && (isMovingUp2 || isMovingDown2))
      ) {
        this.rAF = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(this.rAF);
        this.rAF = null;
      }
    };

    if (!this.rAF) {
      this.rAF = requestAnimationFrame(animate);
    }
  }

  handleMouseMove(e) {
    // 탁구대의 상단 경계에서 마우스 포인터까지의 상대적 위치 계산
    const mouseY = e.clientY - this.tableRect.top;
    // 탁구대의 높이
    const tableHeight = this.pingpongTable.clientHeight;
    // 탁구채의 높이
    const stickHeight = this.myPingpongStick.clientHeight;

    // 탁구채가 탁구대 상단 경계를 넘지 않도록 조정
    let positionY = Math.max(mouseY, stickHeight / 2);
    // 탁구채가 탁구대 하단 경계를 넘지 않도록 조정
    positionY = Math.min(positionY, tableHeight - stickHeight / 2);

    // 탁구채의 새로운 Y 위치를 계산 (탁구대 중심으로부터의 상대적 위치)
    this.currentPosY = positionY - tableHeight / 2;

    // 탁구채의 위치를 업데이트 (transform 사용)
    this.myPingpongStick.style.transform = `translateY(${this.currentPosY}px)`;

    // 서버로 현재 탁구채의 위치를 보냄
    // 마우스 이동 시의 위치 계산은 서버 위치 계산과 다를 수 있으므로, 필요한 변환 함수를 사용하여 서버에 적합한 값으로 변환하여 전송
    this.update();
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowUp') isMovingUp = true;
    else if (e.key === 'ArrowDown') isMovingDown = true;
    this.animatePaddleMovement();
  }

  handleKeyUp(e) {
    if (e.key === 'ArrowUp') isMovingUp = false;
    else if (e.key === 'ArrowDown') isMovingDown = false;
  }

  handleKeyDown2(e) {
    if (e.key === 'w') isMovingUp2 = true;
    else if (e.key === 's') isMovingDown2 = true;
    this.animatePaddleMovement();
  }

  handleKeyUp2(e) {
    if (e.key === 'w') isMovingUp2 = false;
    else if (e.key === 's') isMovingDown2 = false;
  }

  onMouseMove() {
    if (this.gameOption.control === 'mouse') {
      document.addEventListener('mousemove', this.handleMouseMove);
    }
  }

  onKeyboardMove() {
    if (this.gameOption.control === 'keyboard') {
      this.addEventListeners();
    }
  }

  checkControl() {
    this.maxY =
      this.pingpongTable.clientHeight - this.myPingpongStick.clientHeight / 2;

    this.onMouseMove();
    this.onKeyboardMove();
  }

  updateBallPosition(ballPosition) {
    requestAnimationFrame(() => {
      const [x, y] = convertServerPositionToScreenPosition.bind(this)(
        ballPosition[0],
        ballPosition[1],
      );
      const ballCenterOffsetX = this.ball.offsetWidth / 2;
      const ballCenterOffsetY = this.ball.offsetHeight / 2;

      this.ball.style.transform = `translate(${x - ballCenterOffsetX}px, ${
        y - ballCenterOffsetY
      }px)`;
    });
  }

  endGameEventHandler() {
    const $goHomeBtn = document.querySelector('.goHomeBtn');

    $goHomeBtn.addEventListener('click', e => {
      if (this.socket === cws)
        cws.send({
          type: 'invite_game',
          command: 'end_game',
        });
      else if (this.socket === tws)
        tws.send({
          tournament_mode: 'end_tournament',
        });
      else if (this.socket === lws) this.socket.close();
      else
        qws.send({
          command: 'end_game',
        });
    });
  }

  setStickCenter() {
    this.opponentPingpongStick.style.top = `${
      this.opponentPingpongStick.offsetTop -
      this.opponentPingpongStick.offsetHeight / 2
    }px`;
    this.myPingpongStick.style.top = `${
      this.myPingpongStick.offsetTop - this.myPingpongStick.offsetHeight / 2
    }px`;
  }

  addEventListeners() {
    if (this.socket === lws) {
      document.addEventListener('keydown', this.handleKeyDown2);
      document.addEventListener('keyup', this.handleKeyUp2);
    }
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  cleanUpEvent() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('keydown', this.handleKeyDown2);
    document.removeEventListener('keyup', this.handleKeyUp2);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  cleanUp() {
    this.cleanUpEvent();
    if (this.socket === cws) {
      this.socket.send({
        type: 'invite_game',
        command: 'quit',
      });
    } else if (this.socket === tws) {
      tws.send({
        tournament_mode: 'end_tournament',
      });
    } else if (this.socket === lws) {
      this.socket.close();
    } else this.socket.close();
  }

  async afterRender() {
    this.socket = await checkSocket();
    if (!this.socket) return;

    if (this.socket !== lws) this.sendStick(0);
    else {
      const $playingUserBodyLeft = document.querySelector(
        '.playingUserBodyLeft',
      );
      const $playingUserBodyRight = document.querySelector(
        '.playingUserBodyRight',
      );
      $playingUserBodyLeft.querySelector('.playingUserName').innerHTML =
        'Player1';
      $playingUserBodyRight.querySelector('.playingUserName').innerHTML =
        'Player2';
      $playingUserBodyLeft.querySelector('.player1Img').src =
        '/public/person.svg';
      $playingUserBodyRight.querySelector('.player2Img').src =
        '/public/person.svg';
      document.querySelectorAll('.playingUserTotalScore').forEach(e => {
        e.style.display = 'none';
      });
    }
    let myPingpongStick;
    let opponentPingpongStick;
    if (this.socket === lws) {
      myPingpongStick = document.querySelector('.player2PingpongStick');
      opponentPingpongStick = document.querySelector('.player1PingpongStick');
    } else {
      myPingpongStick = document.querySelector(
        `.${sessionStorage.getItem('myPosition')}PingpongStick`,
      );
      opponentPingpongStick = document.querySelector(
        `.${sessionStorage.getItem('opponentsPosition')}PingpongStick`,
      );
    }

    this.pingpongTable = document.querySelector('.pingpongTable');
    this.tableRect = this.pingpongTable.getBoundingClientRect();
    this.myPingpongStickTop = myPingpongStick.offsetTop;
    this.opponentPingpongStickTop = opponentPingpongStick.offsetTop;
    this.myPingpongStick = myPingpongStick;
    this.opponentPingpongStick = opponentPingpongStick;

    const $player1Score = document.querySelector('.player1Score');
    const $player2Score = document.querySelector('.player2Score');
    const $gameResultModalContainer = document.querySelector(
      '.gameResultModalContainer',
    );

    const $winnerImg = document.querySelector('.winnerImg');
    const $byeMessage = document.querySelector('.bye-message');
    const $score = document.querySelector('#score');
    const $ranking = document.querySelector('#ranking');
    const $scoreChange = document.querySelector('#scoreChange');
    const $rankingChange = document.querySelector('#rankingChange');
    const $tournamentState = document.querySelector('.tournamentState');
    const $stateUpdate = document.querySelector('.stateUpdate');
    const $goHomeBtn = document.querySelector('.goHomeBtn');

    const $winnerName = document.querySelector('.winnerName');
    let flag = 0;
    let win = 0;
    let byeFlag = 0;
    let byeMessage = '';
    this.tableWidth = this.pingpongTable.offsetWidth;
    this.tableHeight = this.pingpongTable.offsetHeight;
    this.centerY = this.tableHeight / 2;
    this.ball = document.getElementById('pingpongBall');

    this.setStickCenter();
    this.checkControl();
    this.endGameEventHandler();

    const onMatchComplete = () => {
      // 3초 후에 실행될 함수
      setTimeout(function () {
        // 게임 화면으로 이동
        $gameResultModalContainer.classList.remove('active');
        router();
      }, 2000); // 2000 밀리초 = 2초
    };

    const showTournamentResult = message => {
      $winnerImg.src = message.data.winner.player_profile_img;
      if (message.data.winner.nickname === this.user.nickname) {
        win = 1;
        $tournamentState.innerHTML =
          'Waiting for other games to finish<img id="waitingTournament" src="/public/threedotsLoading.svg">';
        $goHomeBtn.style.display = 'none';
      } else {
        $tournamentState.innerHTML = 'Please try again in the next tournament';
        $goHomeBtn.style.display = 'block';
      }
      $stateUpdate.style.display = 'none';
      $tournamentState.style.display = 'flex';
      $gameResultModalContainer.classList.add('active');
    };

    const socketOnMessage = async message => {
      console.log(message);
      if (message.type === 'BALL_POSITION') {
        const ballPosition = message.data.position;
        this.updateBallPosition(ballPosition);
      } else if (
        this.socket !== lws &&
        this.myPosition === 'player1' &&
        message.type === 'CHANGE_PLAYER2_PADDLE_POSTITION'
      ) {
        opponentPingpongStick.style.transform = `translateY(${convertServerToClientPoition.bind(
          this,
        )(message.data.position[1])}px)`;
      } else if (
        this.socket !== lws &&
        this.myPosition === 'player2' &&
        message.type === 'CHANGE_PLAYER1_PADDLE_POSTITION'
      ) {
        opponentPingpongStick.style.transform = `translateY(${convertServerToClientPoition.bind(
          this,
        )(message.data.position[1])}px)`;
      } else if (message.type === 'PLAYER1_GET_SCORE') {
        $player1Score.innerHTML = message.data.score;
      } else if (message.type === 'PLAYER2_GET_SCORE') {
        $player2Score.innerHTML = message.data.score;
      } else if (message.type === 'GAME_OVER') {
        $winnerImg.src = message.data.winner.player_profile_img;
        $score.innerHTML = message.data.new_rating[this.myPosition].new;
        $scoreChange.src =
          message.data.new_rating[this.myPosition].difference > 0
            ? '/public/up.svg'
            : message.data.new_rating[this.myPosition].difference < 0
            ? '/public/down.svg'
            : '/public/equal.svg';
        $ranking.innerHTML = message.data.new_ranking[this.myPosition].new;
        $rankingChange.src =
          message.data.new_ranking[this.myPosition].difference < 0
            ? '/public/up.svg'
            : message.data.new_ranking[this.myPosition].difference > 0
            ? '/public/down.svg'
            : '/public/equal.svg';
        $tournamentState.style.display = 'none';
        $stateUpdate.style.display = 'flex';
        $goHomeBtn.style.display = 'block';
        $gameResultModalContainer.classList.add('active');
      } else if (message.type === 'LOCAL_GAME_OVER') {
        $winnerImg.src = '/public/person.svg';
        $winnerName.innerHTML = message.data.winner;
        $stateUpdate.style.display = 'none';
        $winnerName.style.display = 'flex';
        $gameResultModalContainer.classList.add('active');
      } else if (message.type === 'GAME_RESULT_A') {
        showTournamentResult(message);
      } else if (message.type === 'GAME_RESULT_B') {
        showTournamentResult(message);
      } else if (message.type === 'END_OF_SEMI_FINAL_A') {
        if (flag === 1) {
          if (win) {
            $tournamentState.innerHTML =
              'The final game will begin soon. Please stand by!';
            this.socket.send({
              tournament_mode: 'final',
            });
          }
        } else if (byeFlag) {
          if (win) {
            this.socket.send({
              tournament_mode: 'final',
            });
          }
        } else flag++;
      } else if (message.type === 'END_OF_SEMI_FINAL_B') {
        if (flag === 1) {
          if (win) {
            $tournamentState.innerHTML =
              'The final game will begin soon. Please stand by!';
            this.socket.send({
              tournament_mode: 'final',
            });
          }
        } else if (byeFlag) {
          if (win) {
            this.socket.send({
              tournament_mode: 'final',
            });
          }
        } else flag++;
      } else if (
        message.type === 'BYE_BECAUSE_OF_ANOTHER_TEAM' ||
        message.type === 'BYE_BECAUSE_OF_ANOTHER_WINNER_B' ||
        message.type === 'BYE_BECAUSE_OF_ANOTHER_WINNER_A'
      ) {
        byeFlag = 1;
        byeMessage = message.message;
      } else if (message.type === 'START_TOURNAMENT_FINAL') {
        if (message.data.player1.info.nickname === this.user.nickname) {
          sessionStorage.setItem('myPosition', 'player1');
          sessionStorage.setItem(
            'gameMyInfo',
            JSON.stringify(message.data.player1),
          );
          sessionStorage.setItem('opponentsPosition', 'player2');
          sessionStorage.setItem(
            'gameOpponentInfo',
            JSON.stringify(message.data.player2),
          );
        } else {
          sessionStorage.setItem('myPosition', 'player2');
          sessionStorage.setItem(
            'gameMyInfo',
            JSON.stringify(message.data.player2),
          );
          sessionStorage.setItem('opponentsPosition', 'player1');
          sessionStorage.setItem(
            'gameOpponentInfo',
            JSON.stringify(message.data.player1),
          );
        }
        onMatchComplete();
      } else if (message.type === 'END_OF_FINAL') {
        $winnerImg.src = message.data.winner.player_profile_img;
        if (message.data.winner.nickname === this.user.nickname) {
          if (byeFlag) $byeMessage.textContent = byeMessage;
          $score.innerHTML = message.data.new_rating.winner.new;
          $scoreChange.src =
            message.data.new_rating.winner.difference > 0
              ? '/public/up.svg'
              : message.data.new_rating.winner.difference < 0
              ? '/public/down.svg'
              : '/public/equal.svg';
          $ranking.innerHTML = message.data.new_ranking.winner.new;
          $rankingChange.src =
            message.data.new_ranking.winner.difference < 0
              ? '/public/up.svg'
              : message.data.new_ranking.winner.difference > 0
              ? '/public/down.svg'
              : '/public/equal.svg';
          $tournamentState.style.display = 'none';
          $stateUpdate.style.display = 'flex';
        } else {
          $tournamentState.innerHTML =
            'Please try again in the next tournament';
          $tournamentState.style.display = 'block';
          $stateUpdate.style.display = 'none';
        }
        $goHomeBtn.style.display = 'block';
        $gameResultModalContainer.classList.add('active');
      }
    };

    if (this.socket === qws || this.socket === tws || this.socket === lws) {
      this.socket.onMessage(message => socketOnMessage.bind(this)(message));
    } else {
      await checkConnectionSocket(socketOnMessage.bind(this));
    }
  }
}
