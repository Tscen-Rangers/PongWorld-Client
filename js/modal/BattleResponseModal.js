import cws from '../WebSocket/ConnectionSocket.js';
import AbstractModal from './AbstractModal.js';

class BattleResponseModal extends AbstractModal {
  constructor() {
    super();
    this.$battleAcceptButton = null;
    this.$chooseKeyboard = null;
    this.$chooseMouse = null;
    this.control = null;
  }

  async getHtml() {
    return `
	<div class="modalBack">
	<div class="modal battle-response-modal">
	  <div class="battleAlertTitle">Battle Invitation</div>
	  <div class="battleAlertInfo">
		<img class="battleChallengerImg"  />
		<div class="battleAlertOptions">
		  <div class="battleChallengerName">
			Name:
			<text class="challengerName" style="color: blue"></text>
		  </div>
		  <div class="battleDifficultyLevel">
			Difficulty Level:
			<text class="battleLevel" style="color: blue"></text>
		  </div>
		</div>
	  </div>
	  <div class="chooseControlTitle">
		choose your controller to join the game!
	  </div>
	  <div class="chooseControl">
		<div id="chooseKeyboard">
		  <svg id="keyboardImg" width="30" height="30" fill="none">
			<path
			  d="M7.5 12.5H7.5125M10 17.5H10.0125M12.5 12.5H12.5125M15 17.5H15.0125M17.5 12.5H17.5125M20 17.5H20.0125M22.5 12.5H22.5125M6.5 22.5H23.5C24.9001 22.5 25.6002 22.5 26.135 22.2275C26.6054 21.9878 26.9878 21.6054 27.2275 21.135C27.5 20.6002 27.5 19.9001 27.5 18.5V11.5C27.5 10.0999 27.5 9.3998 27.2275 8.86502C26.9878 8.39462 26.6054 8.01217 26.135 7.77248C25.6002 7.5 24.9001 7.5 23.5 7.5H6.5C5.09987 7.5 4.3998 7.5 3.86502 7.77248C3.39462 8.01217 3.01217 8.39462 2.77248 8.86502C2.5 9.3998 2.5 10.0999 2.5 11.5V18.5C2.5 19.9001 2.5 20.6002 2.77248 21.135C3.01217 21.6054 3.39462 21.9878 3.86502 22.2275C4.3998 22.5 5.09987 22.5 6.5 22.5Z"
			  stroke="black"
			  stroke-width="2"
			  stroke-linecap="round"
			  stroke-linejoin="round" />
		  </svg>
		</div>
		<div id="chooseMouse">
		  <svg id="mouseImg" width="25" height="25" viewBox="0 0 24 24">
			<path
			  d="M12 6a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V7a1 1 0 0 0-1-1m0-4a7 7 0 0 0-7 7v6a7 7 0 0 0 14 0V9a7 7 0 0 0-7-7m5 13a5 5 0 0 1-10 0V9a5 5 0 0 1 10 0Z" />
		  </svg>
		</div>
	  </div>
	  <div id="battleStartMsg">
		The battle will start soon<img
		  id="waitingTournament"
		  src="/public/threedotsLoading.svg" />
	  </div>
	  <div class="battleAlertButtons">
		<button class="battleAcceptButton" disabled>Accept</button>
		<button class="battleDeclineButton">Reject</button>
	  </div>
	</div>
  </div>`;
  }

  chooseControlEventListener() {
    this.$chooseMouse.addEventListener('click', () => {
      this.$chooseMouse.classList.add('active');
      this.$chooseKeyboard.classList.remove('active');
      this.$battleAcceptButton.disabled = false;
      this.control = 'mouse';
    });
    this.$chooseKeyboard.addEventListener('click', () => {
      this.$chooseKeyboard.classList.add('active');
      this.$chooseMouse.classList.remove('active');
      this.$battleAcceptButton.disabled = false;
      this.control = 'keyboard';
    });
  }

  initializeDOM() {
    const $battleAcceptButton = document.querySelector('.battleAcceptButton');
    const $chooseKeyboard = document.querySelector('#chooseKeyboard');
    const $chooseMouse = document.querySelector('#chooseMouse');
    this.$chooseKeyboard = $chooseKeyboard;
    this.$chooseMouse = $chooseMouse;
    this.$battleAcceptButton = $battleAcceptButton;
  }

  battleDeclineEventListener() {
    const $battleDeclineButton = document.querySelector('.battleDeclineButton');

    $battleDeclineButton.addEventListener('click', () => {
      sessionStorage.setItem('battleResponse', 'decline');
      cws.send({
        type: 'invite_game',
        command: 'response',
        game_id: +sessionStorage.getItem('battleId'),
        accepted: 0,
      });
      this.$chooseMouse.classList.remove('active');
      this.$chooseKeyboard.classList.remove('active');
      this.$battleAcceptButton.disabled = true;
      this.closeModal();
    });
  }

  battleAcceptEventListener() {
    const $battleStartMsg = document.querySelector('#battleStartMsg');

    this.$battleAcceptButton.addEventListener('click', () => {
      sessionStorage.setItem('battleResponse', 'accept');
      let option = JSON.parse(sessionStorage.getItem('gameOption'));
      option.control = this.control;
      sessionStorage.setItem('gameOption', JSON.stringify(option));
      cws.send({
        type: 'invite_game',
        command: 'response',
        game_id: +sessionStorage.getItem('battleId'),
        accepted: 1,
      });
      this.$chooseMouse.classList.remove('active');
      this.$chooseKeyboard.classList.remove('active');
      this.$battleAcceptButton.disabled = true;
      setTimeout(() => {
        $battleStartMsg.style.display = 'flex';
      }, 200);
    });
  }

  async renderModal() {
    await this.openModal(await this.getHtml());
    this.initializeDOM();

    this.chooseControlEventListener();
    this.battleDeclineEventListener();
    this.battleAcceptEventListener();
  }
}

export default BattleResponseModal;
