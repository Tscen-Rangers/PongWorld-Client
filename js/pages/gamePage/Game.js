import AbstractView from '../../AbstractView.js';
import tws from '../../WebSocket/TournamentSocket.js';
import cws from '../../WebSocket/ConnectionSocket.js';
import qws from '../../WebSocket/QuickMatchSocket.js';
import {checkConnectionSocket} from '../../webSocketManager.js';
import {router} from '../../route.js';
import T from '../../WebSocket/TournamentSocket.js';
let isMovingUp = false;
let isMovingDown = false;
let lastMessageTime = null;

const checkSocket = async () => {
  const webSocketType = JSON.parse(sessionStorage.getItem('webSocketType'));
  console.log('socket', webSocketType);
  if (webSocketType === 'START_RANDOM_GAME') return qws;
  else if (webSocketType === 'START_FRIEND_GAME') return cws;
  else {
    if (tws.getWS().readyState === WebSocket.CLOSED || !tws.getWS())
      await tws.connect('ws://127.0.0.1:8000/ws/tournament/');
    return tws;
  }
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
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.currentPosY = 0;
    this.speed = 10; // 탁구채의 이동 속도
    this.socket = null;
  }

  async getHtml() {
    return `
    <div class="gameBody">
    <div class="playingUserBody">
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
          } />
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
      <div class="gameScore">
        <text class="player1Score">0</text>:<text class="player2Score">0</text>
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
          }  />
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
          <img class="winnerImg" src="/public/huipark.jpg" />
        </div>
        <div class="stateUpdate">
        <text class="stateUpdateTitle">Your updates</text>
        <div class="scoreUpdate">score<img id="scoreChange" src="/public/up.svg"/><text id="score">1024<text></div>
        <div class="rankingUpdate">ranking<img id="rankingChange" src="/public/down.svg"/><text id="ranking">5<text></div>
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
    if (this.socket === cws)
      this.socket.send({
        type: 'invite_game',
        command: 'move_paddle',
        y_coordinate: coordinate,
      });
    else if (this.socket === tws)
      this.socket.send({
        tournament_mode: 'move_paddle',
        y_coordinate: coordinate,
      });
    else
      this.socket.send({
        command: 'move_paddle',
        y_coordinate: coordinate,
      });
  }

  update() {
    const y = convertClientToServerPosition.bind(this)(this.currentPosY);
    this.sendStick(y);
  }

  // animatePaddleMovement() {
  //   if (isMovingUp || isMovingDown) {
  //     const style = window.getComputedStyle(this.myPingpongStick);
  //     let newPosition = parseInt(style.top);

  //     if (isMovingUp)
  //       newPosition = Math.max(
  //         newPosition - 5,
  //         this.myPingpongStick.offsetHeight / 2,
  //       );
  //     if (isMovingDown) newPosition = Math.min(newPosition + 5, this.maxY);

  //     this.myPingpongStick.style.top = newPosition + 'px';
  //     this.update(newPosition);
  //     this.rAF = requestAnimationFrame(this.animatePaddleMovement.bind(this));
  //   } else {
  //     cancelAnimationFrame(this.rAF);
  //   }
  // }

  animatePaddleMovement() {
    if (!this.rAF) {
      const animate = () => {
        if (isMovingUp || isMovingDown) {
          const myStickRect = this.myPingpongStick.getBoundingClientRect();

          if (isMovingUp) {
            if (myStickRect.top - this.speed <= this.tableRect.top) {
              this.currentPosY =
                this.currentPosY - (myStickRect.top - this.tableRect.top);
            } else this.currentPosY -= this.speed;
          } else if (isMovingDown) {
            if (myStickRect.bottom + this.speed >= this.tableRect.bottom) {
              this.currentPosY =
                this.currentPosY + (this.tableRect.bottom - myStickRect.bottom);
            } else this.currentPosY += this.speed;
          }

          this.update();
          this.myPingpongStick.style.transform = `translateY(${this.currentPosY}px)`;
          this.rAF = requestAnimationFrame(animate.bind(this));
        } else {
          cancelAnimationFrame(this.rAF);
          this.rAF = null;
        }
      };
      this.rAF = requestAnimationFrame(animate.bind(this));
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
    console.log(mouseY);

    // 탁구채의 새로운 Y 위치를 계산 (탁구대 중심으로부터의 상대적 위치)
    this.currentPosY = positionY - tableHeight / 2;
    console.log('currPOS = ', this.currentPosY);

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

  onMouseMove() {
    if (this.gameOption.control === 'mouse') {
      document.addEventListener('mousemove', this.handleMouseMove);
    }
  }

  onKeyboardMove() {
    if (this.gameOption.control === 'keyboard') {
      this.addEventListeners();

      // setInterval(() => {
      //   if (isMovingUp) {
      //     coor = Math.max(
      //       parseInt(style.top) - 30,
      //       this.myPingpongStick.offsetHeight / 2,
      //     );
      //     this.update(coor);
      //   } else if (isMovingDown) {
      //     coor = Math.min(parseInt(style.top) + 30, this.maxY);
      //     this.update(coor);
      //   }
      // }, 1000 / 60); // 60프레임으로 설정
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
        qws.send({
          type: 'invite_game',
          command: 'end_game',
        });
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
    document.addEventListener('keyup', this.handleKeyUp);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  cleanUpEvent() {
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  cleanUp() {
    this.cleanUpEvent();
    if (this.socket === cws) {
      this.socket.send({
        type: 'invite_game',
        command: 'quit',
      });
    } else this.socket.close();
  }

  async afterRender() {
    this.socket = await checkSocket();
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

    this.pingpongTable = document.querySelector('.pingpongTable');
    this.tableRect = this.pingpongTable.getBoundingClientRect();
    this.myPingpongStickTop = myPingpongStick.offsetTop;
    this.myPingpongStick = myPingpongStick;
    this.opponentPingpongStick = opponentPingpongStick;

    const $player1Score = document.querySelector('.player1Score');
    const $player2Score = document.querySelector('.player2Score');
    const $gameResultModalContainer = document.querySelector(
      '.gameResultModalContainer',
    );

    const $winnerImg = document.querySelector('.winnerImg');
    const $score = document.querySelector('#score');
    const $ranking = document.querySelector('#ranking');
    const $scoreChange = document.querySelector('#scoreChange');
    const $rankingChange = document.querySelector('#rankingChange');

    const $tournamentState = document.querySelector('.tournamentState');
    const $stateUpdate = document.querySelector('.stateUpdate');
    const $goHomeBtn = document.querySelector('.goHomeBtn');

    let flag = 0;
    let win = 0;
    this.tableWidth = this.pingpongTable.offsetWidth;
    this.tableHeight = this.pingpongTable.offsetHeight;
    this.centerY = this.tableHeight / 2;
    this.ball = document.getElementById('pingpongBall');

    this.setStickCenter();
    this.checkControl();
    this.endGameEventHandler();

    console.log(this.myPosition);

    const onMatchComplete = () => {
      // 3초 후에 실행될 함수
      tws.close();
      setTimeout(function () {
        // 게임 화면으로 이동
        console.log('complete!!!!!!!!!!!!!!');
        console.log($gameResultModalContainer);
        $gameResultModalContainer.classList.remove('active');
        window.history.pushState(null, null, '/game'); // '/gameScreenURL'은 게임 화면의 URL로 변경해야 합니다.
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
      if (message.type === 'BALL_POSITION') {
        const ballPosition = message.data.position;
        this.updateBallPosition(ballPosition);
      } else if (
        this.myPosition === 'player1' &&
        message.type === 'CHANGE_PLAYER2_PADDLE_POSTITION'
      ) {
        console.log(message);
        opponentPingpongStick.style.transform = `translateY(${convertServerToClientPoition.bind(
          this,
        )(message.data.position[1])}px)`;
      } else if (
        this.myPosition === 'player2' &&
        message.type === 'CHANGE_PLAYER1_PADDLE_POSTITION'
      ) {
        console.log(message);
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
          message.data.new_ranking[this.myPosition].difference > 0
            ? '/public/up.svg'
            : message.data.new_ranking[this.myPosition].difference < 0
            ? '/public/down.svg'
            : '/public/equal.svg';
        $tournamentState.style.display = 'none';
        $stateUpdate.style.display = 'flex';
        $goHomeBtn.style.display = 'block';
        $gameResultModalContainer.classList.add('active');
      } else if (message.type === 'GAME_RESULT_A') {
        showTournamentResult(message);
      } else if (message.type === 'GAME_RESULT_B') {
        showTournamentResult(message);
      } else if (message.type === 'END_OF_SEMI_FINAL_A') {
        if (flag === 1) {
          if (win) {
            console.log('winner');
            $tournamentState.innerHTML =
              'The final game will begin soon. Please stand by!';
            this.socket.send({
              tournament_mode: 'final',
            });
          }
        } else flag++;
      } else if (message.type === 'END_OF_SEMI_FINAL_B') {
        if (flag === 1) {
          if (win) {
            console.log('winner');
            $tournamentState.innerHTML =
              'The final game will begin soon. Please stand by!';
            this.socket.send({
              tournament_mode: 'final',
            });
          }
        } else flag++;
      } else if (message.type === 'START_TOURNAMENT_FINAL') {
        console.log('START_TOURNAMENT_FINAL', message);
        // sessionStorage.setItem('webSocketType', JSON.stringify(message.type));
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
          $score.innerHTML = message.data.new_rating.winner.new;
          $scoreChange.src =
            message.data.new_rating.winner.difference > 0
              ? '/public/up.svg'
              : message.data.new_rating.winner.difference < 0
              ? '/public/down.svg'
              : '/public/equal.svg';
          $ranking.innerHTML = message.data.new_ranking.winner.new;
          $rankingChange.src =
            message.data.new_ranking.winner.difference > 0
              ? '/public/up.svg'
              : message.data.new_ranking.winner.difference < 0
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
      // console.log(message);
    };

    if (this.socket === qws || this.socket === tws) {
      console.log(this.socket);
      this.socket.onMessage(message => socketOnMessage.bind(this)(message));
    } else {
      await checkConnectionSocket(socketOnMessage.bind(this));
    }
  }
}
