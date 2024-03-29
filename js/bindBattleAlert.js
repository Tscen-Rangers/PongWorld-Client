import cws from './WebSocket/ConnectionSocket.js';

//socket에서 requestmessage 받으면 띄우기
document.addEventListener('DOMContentLoaded', () => {
  const $battleAlertModalContainer = document.querySelector(
    '.battleAlertModalContainer',
  );
  const $chooseKeyboard = document.querySelector('#chooseKeyboard');
  const $chooseMouse = document.querySelector('#chooseMouse');
  const $battleAcceptButton = document.querySelector('.battleAcceptButton');
  const $battleDeclineButton = document.querySelector('.battleDeclineButton');
  const $battleStartMsg = document.querySelector('#battleStartMsg');
  let control = null;
  $chooseMouse.addEventListener('click', () => {
    console.log('hehe');
    $chooseMouse.classList.add('active');
    console.log($chooseMouse);
    $chooseKeyboard.classList.remove('active');
    $battleAcceptButton.disabled = false;
    control = 'mouse';
  });
  $chooseKeyboard.addEventListener('click', () => {
    $chooseKeyboard.classList.add('active');
    console.log($chooseKeyboard);
    $chooseMouse.classList.remove('active');
    $battleAcceptButton.disabled = false;
    control = 'keyboard';
  });
  $battleDeclineButton.addEventListener('click', () => {
    sessionStorage.setItem('battleResponse', 'decline');
    console.log(+sessionStorage.getItem('battleId'));
    cws.send({
      type: 'invite_game',
      command: 'response',
      game_id: +sessionStorage.getItem('battleId'),
      accepted: 0,
    });
    $chooseMouse.classList.remove('active');
    $chooseKeyboard.classList.remove('active');
    $battleAcceptButton.disabled = true;
    $battleAlertModalContainer.classList.remove('active');
  });
  $battleAcceptButton.addEventListener('click', () => {
    sessionStorage.setItem('battleResponse', 'accept');
    let option = JSON.parse(sessionStorage.getItem('gameOption'));
    option.control = control;
    sessionStorage.setItem('gameOption', JSON.stringify(option));
    cws.send({
      type: 'invite_game',
      command: 'response',
      game_id: +sessionStorage.getItem('battleId'),
      accepted: 1,
    });
    $chooseMouse.classList.remove('active');
    $chooseKeyboard.classList.remove('active');
    $battleAcceptButton.disabled = true;
    $battleStartMsg.style.display = 'flex';
    // $battleAlertModalContainer.classList.remove('active');
  });
});
