import WS_URL from '../../wsConfig.js';
import AbstractModal from './AbstractModal.js';
import {router} from '../route.js';
import {getToken, refreshAccessToken} from '../tokenManager.js';
import lws from '../WebSocket/LocalGameWebSocket.js';
class LocalGameModal extends AbstractModal {
  constructor() {
    super();
    this.option = {
      control: 'keyboard',
      level: null,
    };
  }
  async getHtml() {
    return `<div class="modalBack">
    <div class="modal local-game-modal">
        <p class="localModeTitle">mode</p>
        <div class="localModes">
            <span class="localMode">easy</span>
            <span class="localMode">normal</span>
            <span class="localMode">hard</span>
        </div>
        <svg
		id="localOptionNextBtn"
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
    setTimeout(function () {
      window.history.pushState(null, null, '/game'); // '/gameScreenURL'은 게임 화면의 URL로 변경해야 합니다.
      router();
    });
  }

  LocalNextBtnAddEventListener() {
    const $localOptionNextBtn = document.querySelector('#localOptionNextBtn');
    $localOptionNextBtn.addEventListener('click', async () => {
      if (!this.option.control || !this.option.level) return;
      else {
        sessionStorage.setItem('gameOption', JSON.stringify(this.option));
        //소켓 연결하고 레쮸고
        if (!getToken) await refreshAccessToken();
        await lws.connect(`${WS_URL}/ws/local/`);
        lws.send({
          command: 'start_local_game',
          speed: this.option.level,
        });
        lws.onMessage(msg => {
          if (msg.type == 'START_LOCAL_GAME') {
            sessionStorage.setItem('webSocketType', JSON.stringify(msg.type));
            this.closeModal();
            this.onMatchComplete();
          }
        });
      }
    });
  }

  modeClickEventListener() {
    const $localModes = document.querySelectorAll('.localMode');
    $localModes.forEach(($mode, idx) => {
      $mode.addEventListener('click', () => {
        $localModes.forEach($mode => {
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
    await this.openModal(await this.getHtml(), true);
    document.querySelector('.modalBack');
    this.LocalNextBtnAddEventListener();
    this.modeClickEventListener();
  }
}

export default LocalGameModal;
