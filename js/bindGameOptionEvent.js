import qws from '../js/WebSocket/QuickMatchSocket.js';
import {router} from './route.js';
import {getToken, refreshAccessToken} from './tokenManager.js';
import tws from './WebSocket/TournamentSocket.js';
const option = {
  control: null,
  level: null,
};

//매칭 완료시 2초 후에 게임 화면으로 이동
function onMatchComplete() {
  // 3초 후에 실행될 함수
  setTimeout(function () {
    // 게임 화면으로 이동
    window.history.pushState(null, null, '/game'); // '/gameScreenURL'은 게임 화면의 URL로 변경해야 합니다.
    router();
  }, 3000); // 2000 밀리초 = 2초
}

document.addEventListener('DOMContentLoaded', () => {
  const $gameOptionModalContainer = document.getElementById(
    'gameOptionModalContainer',
  );
  const $mouse = document.getElementById('mouse');
  const $keyboard = document.getElementById('keyboard');
  const $modes = document.querySelectorAll('.mode');
  const $gameOptionNextBtn = document.getElementById('gameOptionNextBtn');
  const $battleModal = document.querySelector('.battleModalContainer');
  const $battleMsg = document.querySelector('.battleMsg');
  const $quickMatchModal = document.querySelector('.quickMatchModalContainer');
  const $battleModalContainer = document.querySelector('.battleModalContainer');
  const $currentStaff = document.querySelector('.currentStaff');
  const $battleCancelBtn = document.querySelector('.battleCancelBtn');
  const $tournamentControlModal = document.getElementById(
    'tournamentControlModalBackground',
  );
  const $tournamentControlKeyboard = document.querySelector(
    '#tournamentControlKeyboard',
  );
  const $tournamentControlMouse = document.querySelector(
    '#tournamentControlMouse',
  );
  $tournamentControlModal.addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      $tournamentControlModal.classList.remove('show');
    }
  });
  $tournamentControlKeyboard.addEventListener('click', async () => {
    option.control = 'keyboard';
    $battleMsg.innerHTML =
      'Waiting for all <br /> players to join the tournament...';

    // 토큰 갱신 확인
    if (!getToken().length) await refreshAccessToken();

    // WebSocket 연결
    tws.connect('ws://127.0.0.1:8000/ws/tournament/');
    $battleModalContainer.classList.add('active');
    $tournamentControlModal.classList.remove('show');
    // 메시지 수신 이벤트 핸들러
    tws.onMessage(msg => {
      // 참가자 수 업데이트
      if (msg.participants_num) {
        $currentStaff.innerText = `${msg.participants_num}/4`;
      }

      // 모든 참가자가 조인한 경우
      if (msg.data) {
        // 토너먼트 ID 처리
        if (msg.data.id) {
          sessionStorage.setItem('tournament_id', msg.data.id);
        }
        sessionStorage.setItem('gameOption', JSON.stringify(option));
        $currentStaff.innerText = `4/4`;
        $battleMsg.innerHTML =
          'Tournament Ready<br />The game will start soon!';
        $battleCancelBtn.style.display = 'none';
        onMatchComplete();
      }
    });
  });

  $tournamentControlMouse.addEventListener('click', async () => {
    option.control = 'mouse';
    $battleMsg.innerHTML =
      'Waiting for all <br /> players to join the tournament...';

    // 토큰 갱신 확인
    if (!getToken().length) await refreshAccessToken();

    // WebSocket 연결
    tws.connect('ws://127.0.0.1:8000/ws/tournament/');
    $battleModalContainer.classList.add('active');
    $tournamentControlModal.classList.remove('show');
    // 메시지 수신 이벤트 핸들러
    tws.onMessage(msg => {
      // 참가자 수 업데이트
      if (msg.participants_num) {
        $currentStaff.innerText = `${msg.participants_num}/4`;
      }

      // 모든 참가자가 조인한 경우
      if (msg.data) {
        // 토너먼트 ID 처리
        if (msg.data.id) {
          sessionStorage.setItem('tournament_id', msg.data.id);
        }
        sessionStorage.setItem('gameOption', JSON.stringify(option));
        $currentStaff.innerText = `4/4`;
        $battleMsg.innerHTML =
          'Tournament Ready<br />The game will start soon!';
        $battleCancelBtn.style.display = 'none';
        onMatchComplete();
      }
    });
  });

  const closeGameOptionModal = () => {
    option.control = null;
    option.level = null;
    $gameOptionModalContainer.classList.remove('show');
    $mouse.classList.remove('active');
    $keyboard.classList.remove('active');
    $modes.forEach($mode => {
      $mode.classList.remove('active');
    });
  };

  $gameOptionNextBtn.addEventListener('click', async () => {
    if (!option.control || !option.level)
      console.log('옵션 선택 해라!!!!!!!!!');
    else {
      console.log($gameOptionModalContainer.dataset.modaloption);
      console.log(option);
      sessionStorage.setItem('gameOption', JSON.stringify(option));
      console.log($gameOptionModalContainer.dataset.modaloption);
      if ($gameOptionModalContainer.dataset.modaloption === 'quickmatch') {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const playerID = urlParams.get('player_id');
        const $matchingText = document.querySelector('.matchingText');
        const $opponentMatchingImg = document.querySelector(
          '.opponentMatchingImg',
        );
        const $matchingCancelBtn = document.querySelector('.matchingCancelBtn');
        console.log($matchingCancelBtn);
        const $quickMatchModal = document.querySelector(
          '.quickMatchModalContainer',
        );
        $quickMatchModal.classList.add('active');
        if (!getToken().length) await refreshAccessToken();
        qws.connect(`ws://127.0.0.1:8000/ws/random/`);
        qws.send({speed: 1});
        let cnt = 0;
        qws.onMessage(msg => {
          if (msg.message) {
            $matchingText.innerHTML = msg.message;
          }
          if (msg.data) {
            sessionStorage.setItem('gameData', JSON.stringify(msg.data));
            if (
              msg.data.game_state.player1.info.nickname ===
              JSON.parse(sessionStorage.getItem('user')).nickname
            ) {
              sessionStorage.setItem('myPosition', 'player1');
              sessionStorage.setItem('opponentsPosition', 'player2');
              console.log(msg.data.game_state.player2.info.profile_img);
              $opponentMatchingImg.src =
                'http://127.0.0.1:8000' +
                msg.data.game_state.player2.info.profile_img;
            } else {
              sessionStorage.setItem('myPosition', 'player2');
              console.log(msg.data.game_state.player1.info.profile_img);
              sessionStorage.setItem('opponentsPosition', 'player1');
              $opponentMatchingImg.src =
                'http://127.0.0.1:8000' +
                msg.data.game_state.player1.info.profile_img;
            }
            $matchingCancelBtn.style.display = 'none';
            onMatchComplete();
          }
        });
        // };
      }
      if ($gameOptionModalContainer.dataset.modaloption === 'battle')
        $battleModal.classList.add('active');
      closeGameOptionModal();
      // window.location.href = '/game';
    }
  });

  $gameOptionModalContainer.addEventListener('click', e => {
    if ($gameOptionModalContainer === e.target) {
      closeGameOptionModal();
    }
  });

  $mouse.addEventListener('click', () => {
    $mouse.classList.add('active');
    $keyboard.classList.remove('active');
    option.control = 'mouse';
  });
  $keyboard.addEventListener('click', () => {
    $keyboard.classList.add('active');
    $mouse.classList.remove('active');
    option.control = 'keyboard';
  });
  $modes.forEach(($mode, idx) => {
    $mode.addEventListener('click', () => {
      $modes.forEach($mode => {
        $mode.classList.remove('active');
      });
      $mode.classList.add('active');
      if (idx === 0) option.level = 1;
      else if (idx === 1) option.level = 2;
      else option.level = 3;
    });
  });
});
