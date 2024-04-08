import WS_URL from '../../wsConfig.js';
import {
  getToken,
  refreshAccessToken,
  removeRefreshToken,
} from '../tokenManager.js';
import {closeModal, openModal} from './modalManager.js';
import tws from '../WebSocket/TournamentSocket.js';
import cws from '../WebSocket/ConnectionSocket.js';
import qws from '../WebSocket/QuickMatchSocket.js';
import {router} from '../route.js';
import BattleModal from './BattleModal.js';

class QuickMatchModal {
  constructor() {
    this.option = {
      control: null,
      level: null,
    };
  }

  async getHtml() {
    return `<div class="modalBack">
	<div class="modal quick-match-modal">
	  <p class="optionExplanation">controls</p>
	  <div id="controlsContainer">
		<div id="keyboard">
		  <svg id="keyboardImage" width="30" height="30" fill="none">
			<path
			  d="M7.5 12.5H7.5125M10 17.5H10.0125M12.5 12.5H12.5125M15 17.5H15.0125M17.5 12.5H17.5125M20 17.5H20.0125M22.5 12.5H22.5125M6.5 22.5H23.5C24.9001 22.5 25.6002 22.5 26.135 22.2275C26.6054 21.9878 26.9878 21.6054 27.2275 21.135C27.5 20.6002 27.5 19.9001 27.5 18.5V11.5C27.5 10.0999 27.5 9.3998 27.2275 8.86502C26.9878 8.39462 26.6054 8.01217 26.135 7.77248C25.6002 7.5 24.9001 7.5 23.5 7.5H6.5C5.09987 7.5 4.3998 7.5 3.86502 7.77248C3.39462 8.01217 3.01217 8.39462 2.77248 8.86502C2.5 9.3998 2.5 10.0999 2.5 11.5V18.5C2.5 19.9001 2.5 20.6002 2.77248 21.135C3.01217 21.6054 3.39462 21.9878 3.86502 22.2275C4.3998 22.5 5.09987 22.5 6.5 22.5Z"
			  stroke="black"
			  stroke-width="2"
			  stroke-linecap="round"
			  stroke-linejoin="round" />
		  </svg>
		  <p>keyboard</p>
		</div>
		<div id="mouse">
		  <svg id="mouseImage" width="30" height="30" viewBox="0 0 24 24">
			<path
			  d="M12 6a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V7a1 1 0 0 0-1-1m0-4a7 7 0 0 0-7 7v6a7 7 0 0 0 14 0V9a7 7 0 0 0-7-7m5 13a5 5 0 0 1-10 0V9a5 5 0 0 1 10 0Z" />
		  </svg>
		  <p>mouse</p>
		</div>
	  </div>
	  <p class="optionExplanation">mode</p>
	  <div id="modeContainer">
		<span class="mode">easy</span>
		<span class="mode">nomal</span>
		<span class="mode">hard</span>
	  </div>
	  <svg
		id="gameOptionNextBtn"
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		viewBox="0 0 1024 1024">
		<path
		  fill="black"
		  d="M754.752 480H160a32 32 0 1 0 0 64h594.752L521.344 777.344a32 32 0 0 0 45.312 45.312l288-288a32 32 0 0 0 0-45.312l-288-288a32 32 0 1 0-45.312 45.312z" />
	  </svg>
	</div>
   </div>`;
  }

  onMatchComplete() {
    // 3초 후에 실행될 함수
    setTimeout(function () {
      // 게임 화면으로 이동

      window.history.pushState(null, null, '/game'); // '/gameScreenURL'은 게임 화면의 URL로 변경해야 합니다.
      router();
      // 일단 서버에서 소켓 메세지가 일찍 와서 2초로 수정 원래는 3초
    }, 1000);
  }

  checkStartRandomGame(msg) {
    const $matchingText = document.querySelector('.matchingText');
    const $opponentMatchingImg = document.querySelector('.opponentMatchingImg');
    const $matchingCancelBtn = document.querySelector('.matchingCancelBtn');
    if (msg.type === 'START_RANDOM_GAME') {
      $matchingText.innerHTML =
        'The match has been completed. The game will start soon!';
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
      this.onMatchComplete();
    }
  }

  NextBtnAddEventListener() {
    const $gameOptionNextBtn = document.getElementById('gameOptionNextBtn');
    const $modalBack = document.querySelector('.modalBack');
    const $testModal = document.querySelector('#testModal');

    $gameOptionNextBtn.addEventListener('click', async () => {
      if (!this.option.control || !this.option.level)
        console.log('옵션 선택 해라!!!!!!!!!');
      else {
        console.log(this.option);
        sessionStorage.setItem('gameOption', JSON.stringify(this.option));
        if ($modalBack.dataset.modaloption === 'quickmatch') {
          // const $matchingText = document.querySelector('.matchingText');
          const $quickMatchModal = document.querySelector(
            '.quickMatchModalContainer',
          );
          $quickMatchModal.classList.add('active');
          closeModal();
          if (!getToken().length) await removeRefreshToken();
          await qws.connect(`${WS_URL}/ws/random/`);

          qws.send({command: 'participant', speed: this.option.level});

          qws.onMessage(msg => {
            console.log(new Date().toLocaleString(), msg.type);
            this.checkStartRandomGame(msg);
          });
        } else if ($modalBack.dataset.modaloption === 'battle') {
          console.log('배틀이다아아앙');
          cws.send({
            type: 'invite_game',
            command: 'request',
            player2_id: +$modalBack.dataset.player2id,
            speed: JSON.parse(sessionStorage.getItem('gameOption')).level,
          });
          new BattleModal().renderModal();
        }
      }
    });
  }

  optionClickEventListener() {
    const $mouse = document.getElementById('mouse');
    const $keyboard = document.getElementById('keyboard');
    const $modes = document.querySelectorAll('.mode');

    $mouse.addEventListener('click', () => {
      $mouse.classList.add('active');
      $keyboard.classList.remove('active');
      this.option.control = 'mouse';
    });
    $keyboard.addEventListener('click', () => {
      $keyboard.classList.add('active');
      $mouse.classList.remove('active');
      this.option.control = 'keyboard';
    });
    $modes.forEach(($mode, idx) => {
      $mode.addEventListener('click', () => {
        $modes.forEach($mode => {
          $mode.classList.remove('active');
        });
        $mode.classList.add('active');
        if (idx === 0) this.option.level = 1;
        else if (idx === 1) this.option.level = 2;
        else this.option.level = 3;
      });
    });
  }

  async renderModal() {
    await openModal(await this.getHtml(), true);
    document
      .querySelector('.modalBack')
      .setAttribute('data-modaloption', 'quickmatch');

    this.NextBtnAddEventListener();
    this.optionClickEventListener();
  }
}

export default QuickMatchModal;
