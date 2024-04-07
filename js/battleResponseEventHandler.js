import {router} from './route.js';

const $battleChallengerImg = document.querySelector('.battleChallengerImg');
const $challengerName = document.querySelector('.challengerName');
const $battleLevel = document.querySelector('.battleLevel');
const $battleAlertModalContainer = document.querySelector(
  '.battleAlertModalContainer',
);
const $battleStartMsg = document.querySelector('#battleStartMsg');
const $noticeModal = document.querySelector('#noticeModal');
const $noticeContent = document.querySelector('#noticeContent');

export const onMatchComplete = time => {
  // 3초 후에 실행될 함수
  setTimeout(function () {
    // 게임 화면으로 이동
    $battleAlertModalContainer.classList.remove('active');
    window.history.pushState(null, null, '/game'); // '/gameScreenURL'은 게임 화면의 URL로 변경해야 합니다.
    router();
  }, 3000); // 2000 밀리초 = 2초
};

export const responseBattleRequest = message => {
  if (message.type === 'REQUEST_MATCHING') {
    $battleChallengerImg.src = message.opponent_profile_img;
    $challengerName.innerText = message.opponent_nickname;
    sessionStorage.setItem('opponentName', message.opponent_nickname);
    console.log(message.mode);
    $battleLevel.innerText =
      message.mode === 1 ? 'easy' : message.mode === 2 ? 'normal' : 'hard';
    const option = {
      control: null,
      level: message.mode, // 서버에서는 0,1,2 클라이언트에서는 1,2,3
    };
    sessionStorage.setItem('gameOption', JSON.stringify(option));
    sessionStorage.setItem('battleId', message.game_id);
    $battleStartMsg.style.display = 'none';
    $battleAlertModalContainer.classList.add('active');
  } else if (message.type === 'INVITE_GAME') {
    sessionStorage.setItem('battleId', message.data.id);
    battleMatchRequestExpired();
  } else if (message.type === 'START_FRIEND_GAME') {
    if (
      message.data.player1.info.nickname ===
      JSON.parse(sessionStorage.getItem('user')).nickname
    ) {
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
    sessionStorage.setItem('webSocketType', JSON.stringify(message.type));
    onMatchComplete();
  } else if (message.type === 'INVALID_GAME') {
    if (sessionStorage.getItem('battleResponse') === 'accept') {
      $noticeContent.innerText = `Battle request from ${sessionStorage.getItem(
        'opponentName',
      )} has been cancelled`;
      $noticeModal.classList.add('active');
    }
  }
};
