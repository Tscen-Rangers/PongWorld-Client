import WS_URL from '../../wsConfig.js';
import {getToken, refreshAccessToken} from '../tokenManager.js';
import tws from '../WebSocket/TournamentSocket.js';
import AbstractModal from './AbstractModal.js';
import TournamentModal from './TournamentModal.js';

class TournamentReadyModal extends AbstractModal {
  constructor() {
    super();
    this.option = {
      control: null,
      level: null,
    };
  }

  async getHtml() {
    return `
	<div class="modalBack">
	<div class="modal tournament-ready-modal">
	  <div id="tournamentControlKeyboard">
		<svg
		  id="keyboardImage"
		  width="100"
		  height="100"
		  fill="none"
		  viewBox="3 -2.5 24 35">
		  <path
			d="M7.5 12.5H7.5125M10 17.5H10.0125M12.5 12.5H12.5125M15 17.5H15.0125M17.5 12.5H17.5125M20 17.5H20.0125M22.5 12.5H22.5125M6.5 22.5H23.5C24.9001 22.5 25.6002 22.5 26.135 22.2275C26.6054 21.9878 26.9878 21.6054 27.2275 21.135C27.5 20.6002 27.5 19.9001 27.5 18.5V11.5C27.5 10.0999 27.5 9.3998 27.2275 8.86502C26.9878 8.39462 26.6054 8.01217 26.135 7.77248C25.6002 7.5 24.9001 7.5 23.5 7.5H6.5C5.09987 7.5 4.3998 7.5 3.86502 7.77248C3.39462 8.01217 3.01217 8.39462 2.77248 8.86502C2.5 9.3998 2.5 10.0999 2.5 11.5V18.5C2.5 19.9001 2.5 20.6002 2.77248 21.135C3.01217 21.6054 3.39462 21.9878 3.86502 22.2275C4.3998 22.5 5.09987 22.5 6.5 22.5Z"
			stroke="black"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round" />
		</svg>
	  </div>
	  <div id="tournamentControlMouse">
		<svg id="mouseImage" width="80" height="80" viewBox="0 0 24 24">
		  <path
			d="M12 6a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V7a1 1 0 0 0-1-1m0-4a7 7 0 0 0-7 7v6a7 7 0 0 0 14 0V9a7 7 0 0 0-7-7m5 13a5 5 0 0 1-10 0V9a5 5 0 0 1 10 0Z" />
		</svg>
	  </div>
	</div>
  </div>`;
  }

  tournamentOnMessage = async () => {
    if (!getToken()) await refreshAccessToken();

    tws.connect(`${WS_URL}/ws/tournament/`);
    await new TournamentModal().renderModal(this.option);
  };

  onClickKeyboardEventListener() {
    const $tournamentControlKeyboard = document.querySelector(
      '#tournamentControlKeyboard',
    );
    $tournamentControlKeyboard.addEventListener('click', async () => {
      this.option.control = 'keyboard';
      this.tournamentOnMessage();
    });
  }

  onClickMouseEventListener() {
    const $tournamentControlMouse = document.querySelector(
      '#tournamentControlMouse',
    );
    $tournamentControlMouse.addEventListener('click', async () => {
      this.option.control = 'mouse';
      this.tournamentOnMessage();
    });
  }

  async renderModal() {
    await this.openModal(await this.getHtml(), true);
    this.onClickKeyboardEventListener();
    this.onClickMouseEventListener();
  }
}

export default TournamentReadyModal;
