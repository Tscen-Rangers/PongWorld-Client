const option = {
  control: null,
  level: null,
};

//socket에서 requestmessage 받으면 띄우기
document.addEventListener('DOMContentLoaded', () => {
  const $battleAlertModalContainer = document.querySelector(
    '.battleAlertModalContainer',
  );
  const $chooseKeyboard = document.querySelector('#chooseKeyboard');
  const $chooseMouse = document.querySelector('#chooseMouse');
  const $battleAcceptButton = document.querySelector('.battleAcceptButton');
  const $battleDeclineButton = document.querySelector('.battleDeclineButton');

  $chooseMouse.addEventListener('click', () => {
    $chooseMouse.classList.add('active');
    $chooseKeyboard.classList.remove('active');
    $battleAcceptButton.disabled = false;
    option.control = 'mouse';
  });
  $chooseKeyboard.addEventListener('click', () => {
    $chooseKeyboard.classList.add('active');
    $chooseMouse.classList.remove('active');
    $battleAcceptButton.disabled = false;
    option.control = 'keyboard';
  });
  //   $battleDeclineButton.addEventListener('click', () => {
  //     //battle 거절 소켓으로 message send
  //   });
  //   $battleAcceptButton.addEventListener('click', () => {
  //     //battle 수락 소켓으로 message send
  //   });
});
