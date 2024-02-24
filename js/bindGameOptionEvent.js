const option = {
  control: null,
  level: null,
};

document.addEventListener('DOMContentLoaded', () => {
  const $gameOptionModalContainer = document.getElementById(
    'gameOptionModalContainer',
  );
  const $mouse = document.getElementById('mouse');
  const $keyboard = document.getElementById('keyboard');
  const $modes = document.querySelectorAll('.mode');
  const $gameOptionNextBtn = document.getElementById('gameOptionNextBtn');
  const $battleModal = document.querySelector('.battleModalContainer');

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

  $gameOptionNextBtn.addEventListener('click', () => {
    if (!option.control || !option.level)
      console.log('옵션 선택 해라!!!!!!!!!');
    else {
      console.log(option);
      localStorage.setItem('gameOption', JSON.stringify(option));
      closeGameOptionModal();
      $battleModal.classList.add('active');

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
