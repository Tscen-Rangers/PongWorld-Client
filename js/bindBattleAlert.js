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
    console.log(+$battleAlertModalContainer.dataset.battleid);
    cws.send({
      type: 'invite_game',
      role: 'response',
      game_id: +$battleAlertModalContainer.dataset.battleid,
      accepted: 0,
    });
    $battleAlertModalContainer.classList.remove('active');
  });
  $battleAcceptButton.addEventListener('click', () => {
    let option = JSON.parse(sessionStorage.getItem('gameOption'));
    option.control = control;
    sessionStorage.setItem('gameOption', JSON.stringify(option));
    cws.send({
      type: 'invite_game',
      role: 'response',
      game_id: +$battleAlertModalContainer.dataset.battleid,
      accepted: 1,
    }); //battle 수락 소켓으로 message send
    $battleAlertModalContainer.classList.remove('active');
  });
});
