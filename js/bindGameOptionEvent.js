const option = {
  control: null,
  level: null,
};

// let gameSocket = null;

// function connectWebSocket(player_id) {
//   gameSocket = new WebSocket(
//     'ws://' + '127.0.0.1:8000' + '/ws/game/' + '?player_id=' + `${player_id}`,
//   );
//   gameSocket.onopen = function () {
//     console.log('성공');
//     gameSocket.send(
//       JSON.stringify({
//         match_mode: 'random',
//         game_speed: 0,
//       }),
//     );
//   };
// }

//매칭 완료시 2초 후에 게임 화면으로 이동
function onMatchComplete() {
  // 2초 후에 실행될 함수
  setTimeout(function () {
    // 게임 화면으로 이동
    window.location.href = '/game'; // '/gameScreenURL'은 게임 화면의 URL로 변경해야 합니다.
  }, 2000); // 2000 밀리초 = 2초
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
  const $matchingCancelBtn = document.querySelector('.matchingCancelBtn');
  const $quickMatchModal = document.querySelector('.quickMatchModalContainer');

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

  //socket 여기서 연결하는거 아니면 home.js에서
  // $matchingCancelBtn.addEventListener('click', () => {
  //   $quickMatchModal.classList.remove('active');
  //   console.log(gameSocket);
  //   gameSocket.close();
  //   gameSocket.onclose = () => {
  //     console.log('소켓 닫기 성공핑!');
  //   };
  // });

  $gameOptionNextBtn.addEventListener('click', () => {
    // const $as = document.querySelector('.quickMatchModalContainer');
    if (!option.control || !option.level)
      console.log('옵션 선택 해라!!!!!!!!!');
    else {
      console.log($gameOptionModalContainer.dataset.modaloption);
      console.log(option);
      localStorage.setItem('gameOption', JSON.stringify(option));
      if ($gameOptionModalContainer.dataset.modaloption === 'quickmatch') {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const playerID = urlParams.get('player_id');
        const $matchingText = document.querySelector('.matchingText');
        const $opponentMatchingImg = document.querySelector(
          '.opponentMatchingImg',
        );
        // connectWebSocket(1);
        // gameSocket.onmessage = e => {
        //   const data = JSON.parse(e.data);
        //   if (data.message) {
        //     $matchingText.innerHTML = data.message;
        //     $matchingCancelBtn.style.display = 'none';
        //     onMatchComplete();
        //   }
        //   if (data.data.players[1].profile_img) {
        //     $opponentMatchingImg.src = '/public/stick1.png';
        //   }
        // };
        // $as.classList.add('active');
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
