import qws from '../js/WebSocket/QuickMatchSocket.js';
import {router} from './route.js';
import {getToken, refreshAccessToken} from './tokenManager.js';
import tws from './WebSocket/TournamentSocket.js';
import cws from './WebSocket/ConnectionSocket.js';
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
    // 일단 서버에서 소켓 메세지가 일찍 와서 2초로 수정 원래는 3초
  }, 2000);
}

function checkStartRandomGame(msg) {
  const $opponentMatchingImg = document.querySelector('.opponentMatchingImg');
  const $matchingCancelBtn = document.querySelector('.matchingCancelBtn');

  if (msg.type === 'START_RANDOM_GAME') {
    sessionStorage.setItem('webSocketType', JSON.stringify(msg.type));
    if (
      msg.data.player1.info.nickname ===
      JSON.parse(sessionStorage.getItem('user')).nickname
    ) {
      sessionStorage.setItem('myPosition', 'player1');
      sessionStorage.setItem('gameMyInfo', JSON.stringify(msg.data.player1));
      sessionStorage.setItem(
        'gameOpponentInfo',
        JSON.stringify(msg.data.player2),
      );
      sessionStorage.setItem('opponentsPosition', 'player2');
      $opponentMatchingImg.src = msg.data.player2.info.player_profile_img;
    } else {
      sessionStorage.setItem('myPosition', 'player2');
      sessionStorage.setItem('gameMyInfo', JSON.stringify(msg.data.player2));
      sessionStorage.setItem(
        'gameOpponentInfo',
        JSON.stringify(msg.data.player1),
      );
      sessionStorage.setItem('opponentsPosition', 'player1');
      $opponentMatchingImg.src = msg.data.player1.info.player_profile_img;
    }
    $matchingCancelBtn.style.display = 'none';
    onMatchComplete();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const $gameOptionModalContainer = document.getElementById(
    'gameOptionModalContainer',
  );
  const $mouse = document.getElementById('mouse');
  const $keyboard = document.getElementById('keyboard');
  const $modes = document.querySelectorAll('.mode');
  const $gameOptionNextBtn = document.getElementById('gameOptionNextBtn');

  const $tournamentModalContainer = document.querySelector(
    '.tournamentModalContainer',
  );
  const $tournamentMsg = document.querySelector('.tournamentMsg');
  const $tournamentCancelBtn = document.querySelector('.tournamentCancelBtn');
  const $battleModal = document.querySelector('.battleModalContainer');
  const $battleMsg = document.querySelector('.battleMsg');
  const $noticeModal = document.querySelector('#noticeModal');
  const xSvg = document.querySelector('#xSvg');
  const noticeModal = document.querySelector('#noticeModal');
  // const $quickMatchModal = document.querySelector('.quickMatchModalContainer');
  // const $battleModalContainer = document.querySelector('.battleModalContainer');
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

  const tournamentOnMessage = async () => {
    $tournamentMsg.innerHTML =
      'Waiting for all <br /> players to join the tournament...';

    // 토큰 갱신 확인
    if (!getToken().length) await refreshAccessToken();

    // WebSocket 연결
    tws.connect('ws://127.0.0.1:8000/ws/tournament/');
    $tournamentModalContainer.classList.add('active');
    $tournamentControlModal.classList.remove('show');
    // 메시지 수신 이벤트 핸들러
    tws.onMessage(msg => {
      // 참가자 수 업데이트
      console.log(msg);
      if (msg.participants_num) {
        $currentStaff.innerText = `${msg.participants_num}/4`;
      }

      // 모든 참가자가 조인한 경우
      // 토너먼트 ID 처리
      if (msg.type === 'TOURNAMENT_PARTICIPANTS') {
        sessionStorage.setItem('tournament_id', msg.data.id);
      }
      if (msg.type === 'SUCCESS_SEMI_FINAL_MATCHING') {
        sessionStorage.setItem('gameOption', JSON.stringify(option));
        $currentStaff.innerText = `4/4`;
        $tournamentMsg.innerHTML =
          'Tournament Ready<br />The game will start soon!';

        $tournamentCancelBtn.style.display = 'none';
        tws.send({
          tournament_mode: 'semi_final',
          tournament_id: JSON.parse(sessionStorage.getItem('tournament_id')),
        });
      }
      if (msg.type === 'START_TOURNAMENT_SEMI_FINAL') {
        sessionStorage.setItem('webSocketType', JSON.stringify(msg.type));
        if (
          msg.data.player1.info.nickname ===
          JSON.parse(sessionStorage.getItem('user')).nickname
        ) {
          sessionStorage.setItem('myPosition', 'player1');
          sessionStorage.setItem(
            'gameMyInfo',
            JSON.stringify(msg.data.player1),
          );
          sessionStorage.setItem('opponentsPosition', 'player2');
          sessionStorage.setItem(
            'gameOpponentInfo',
            JSON.stringify(msg.data.player2),
          );
        } else {
          sessionStorage.setItem('myPosition', 'player2');
          sessionStorage.setItem(
            'gameMyInfo',
            JSON.stringify(msg.data.player2),
          );
          sessionStorage.setItem('opponentsPosition', 'player1');
          sessionStorage.setItem(
            'gameOpponentInfo',
            JSON.stringify(msg.data.player1),
          );
        }
        onMatchComplete();
        $tournamentModalContainer.classList.remove('active');
      }
    });
  };

  $tournamentControlKeyboard.addEventListener('click', async () => {
    console.log('keyboard');
    option.control = 'keyboard';
    tournamentOnMessage();
    // $tournamentMsg.innerHTML =
    //   'Waiting for all <br /> players to join the tournament...';

    // // 토큰 갱신 확인
    // if (!getToken().length) await refreshAccessToken();

    // // WebSocket 연결
    // tws.connect('ws://127.0.0.1:8000/ws/tournament/');
    // $tournamentModalContainer.classList.add('active');
    // $tournamentControlModal.classList.remove('show');
    // // 메시지 수신 이벤트 핸들러
    // tws.onMessage(msg => {
    //   // 참가자 수 업데이트
    //   console.log(msg);
    //   if (msg.participants_num) {
    //     $currentStaff.innerText = `${msg.participants_num}/4`;
    //   }

    //   // 모든 참가자가 조인한 경우
    //   // 토너먼트 ID 처리
    //   if (msg.type === 'TOURNAMENT_PARTICIPANTS') {
    //     sessionStorage.setItem('tournament_id', msg.data.id);
    //   }
    //   if (msg.type === 'SUCCESS_SEMI_FINAL_MATCHING') {
    //     sessionStorage.setItem('gameOption', JSON.stringify(option));
    //     $currentStaff.innerText = `4/4`;
    //     $tournamentMsg.innerHTML =
    //       'Tournament Ready<br />The game will start soon!';

    //     $tournamentCancelBtn.style.display = 'none';
    //     tws.send({
    //       tournament_mode: 'semi_final',
    //       tournament_id: JSON.parse(sessionStorage.getItem('tournament_id')),
    //     });
    //   }
    //   if (msg.type === 'START_TOURNAMENT_SEMI_FINAL') {
    //     sessionStorage.setItem('webSocketType', JSON.stringify(msg.type));
    //     if (
    //       msg.data.player1.info.nickname ===
    //       JSON.parse(sessionStorage.getItem('user')).nickname
    //     ) {
    //       sessionStorage.setItem('myPosition', 'player1');
    //       sessionStorage.setItem(
    //         'gameMyInfo',
    //         JSON.stringify(msg.data.player1),
    //       );
    //       sessionStorage.setItem('opponentsPosition', 'player2');
    //       sessionStorage.setItem(
    //         'gameOpponentInfo',
    //         JSON.stringify(msg.data.player2),
    //       );
    //     } else {
    //       sessionStorage.setItem('myPosition', 'player2');
    //       sessionStorage.setItem(
    //         'gameMyInfo',
    //         JSON.stringify(msg.data.player2),
    //       );
    //       sessionStorage.setItem('opponentsPosition', 'player1');
    //       sessionStorage.setItem(
    //         'gameOpponentInfo',
    //         JSON.stringify(msg.data.player1),
    //       );
    //     }
    //     onMatchComplete();
    //     $tournamentModalContainer.classList.remove('active');
    //   }
    // });
  });

  $tournamentControlMouse.addEventListener('click', async () => {
    console.log('mouse');
    option.control = 'mouse';
    tournamentOnMessage();
    // $tournamentMsg.innerHTML =
    //   'Waiting for all <br /> players to join the tournament...';

    // // 토큰 갱신 확인
    // if (!getToken().length) await refreshAccessToken();

    // // WebSocket 연결
    // tws.connect('ws://127.0.0.1:8000/ws/tournament/');
    // $tournamentModalContainer.classList.add('active');
    // $tournamentControlModal.classList.remove('show');
    // // 메시지 수신 이벤트 핸들러
    // tws.onMessage(msg => {
    //   // 참가자 수 업데이트
    //   console.log(msg);
    //   if (msg.participants_num) {
    //     $currentStaff.innerText = `${msg.participants_num}/4`;
    //   }

    //   // 모든 참가자가 조인한 경우
    //   // 토너먼트 ID 처리
    //   if (msg.type === 'TOURNAMENT_PARTICIPANTS') {
    //     sessionStorage.setItem('tournament_id', msg.data.id);
    //   }
    //   if (msg.type === 'SUCCESS_SEMI_FINAL_MATCHING') {
    //     sessionStorage.setItem('gameOption', JSON.stringify(option));
    //     $currentStaff.innerText = `4/4`;
    //     $tournamentMsg.innerHTML =
    //       'Tournament Ready<br />The game will start soon!';
    //     $tournamentCancelBtn.style.display = 'none';
    //     tws.send({
    //       tournament_mode: 'semi_final',
    //       tournament_id: JSON.parse(sessionStorage.getItem('tournament_id')),
    //     });
    //   }
    //   if (msg.type === 'START_TOURNAMENT_SEMI_FINAL') {
    //     sessionStorage.setItem('webSocketType', JSON.stringify(msg.type));
    //     if (
    //       msg.data.player1.info.nickname ===
    //       JSON.parse(sessionStorage.getItem('user')).nickname
    //     ) {
    //       sessionStorage.setItem('myPosition', 'player1');
    //       sessionStorage.setItem(
    //         'gameMyInfo',
    //         JSON.stringify(msg.data.player1),
    //       );
    //       sessionStorage.setItem('opponentsPosition', 'player2');
    //       sessionStorage.setItem(
    //         'gameOpponentInfo',
    //         JSON.stringify(msg.data.player2),
    //       );
    //     } else {
    //       sessionStorage.setItem('myPosition', 'player2');
    //       sessionStorage.setItem(
    //         'gameMyInfo',
    //         JSON.stringify(msg.data.player2),
    //       );
    //       sessionStorage.setItem('opponentsPosition', 'player1');
    //       sessionStorage.setItem(
    //         'gameOpponentInfo',
    //         JSON.stringify(msg.data.player1),
    //       );
    //     }
    //     onMatchComplete();
    //     $tournamentModalContainer.classList.remove('active');
    //   }
    // });
  });

  $tournamentCancelBtn.addEventListener('click', () => {
    tws.close();
    $tournamentModalContainer.classList.remove('active');
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
        const $matchingText = document.querySelector('.matchingText');
        const $quickMatchModal = document.querySelector(
          '.quickMatchModalContainer',
        );
        $quickMatchModal.classList.add('active');
        if (!getToken().length) await refreshAccessToken();
        await qws.connect(`ws://127.0.0.1:8000/ws/random/`);

        qws.send({command: 'participant', speed: option.level});

        qws.onMessage(msg => {
          if (msg.message) {
            $matchingText.innerHTML = msg.message;
          }
          checkStartRandomGame(msg);
          console.log(msg);
        });
      }
      if ($gameOptionModalContainer.dataset.modaloption === 'battle') {
        console.log(+$gameOptionModalContainer.dataset.player2id);
        console.log(JSON.parse(sessionStorage.getItem('gameOption')).level);
        cws.send({
          type: 'invite_game',
          command: 'request',
          player2_id: +$gameOptionModalContainer.dataset.player2id,
          speed: JSON.parse(sessionStorage.getItem('gameOption')).level,
        });
        $battleModal.classList.add('active');
      }
      closeGameOptionModal();
    }
  });

  xSvg.addEventListener('click', () => {
    $noticeModal.classList.remove('active');
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
