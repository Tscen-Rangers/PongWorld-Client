import tws from '../WebSocket/TournamentSocket.js';
import {router} from '../route.js';
import AbstractModal from './AbstractModal.js';

class TournamentModal extends AbstractModal {
  constructor() {
    super();
    this.option = null;
  }

  async getHtml() {
    return `
<div class="modalBack">
	<div class="modal tournament-modal">
	  <div class="tournamentMsg">Waiting for all <br /> players to join the tournament...</div>
	  <svg
		style="display: flex; flex: 1; align-self: center"
		xmlns="http://www.w3.org/2000/svg"
		width="5em"
		height="5em"
		viewBox="0 0 24 24">
		<circle cx="12" cy="3.5" r="1.5" fill="currentColor" opacity="0">
		  <animateTransform
			attributeName="transform"
			calcMode="discrete"
			dur="2.4s"
			repeatCount="indefinite"
			type="rotate"
			values="0 12 12;90 12 12;180 12 12;270 12 12" />
		  <animate
			attributeName="opacity"
			dur="0.6s"
			keyTimes="0;0.5;1"
			repeatCount="indefinite"
			values="1;1;0" />
		</circle>
		<circle cx="12" cy="3.5" r="1.5" fill="currentColor" opacity="0">
		  <animateTransform
			attributeName="transform"
			begin="0.2s"
			calcMode="discrete"
			dur="2.4s"
			repeatCount="indefinite"
			type="rotate"
			values="30 12 12;120 12 12;210 12 12;300 12 12" />
		  <animate
			attributeName="opacity"
			begin="0.2s"
			dur="0.6s"
			keyTimes="0;0.5;1"
			repeatCount="indefinite"
			values="1;1;0" />
		</circle>
		<circle cx="12" cy="3.5" r="1.5" fill="currentColor" opacity="0">
		  <animateTransform
			attributeName="transform"
			begin="0.4s"
			calcMode="discrete"
			dur="2.4s"
			repeatCount="indefinite"
			type="rotate"
			values="60 12 12;150 12 12;240 12 12;330 12 12" />
		  <animate
			attributeName="opacity"
			begin="0.4s"
			dur="0.6s"
			keyTimes="0;0.5;1"
			repeatCount="indefinite"
			values="1;1;0" />
		</circle>
	  </svg>
	  <div class="currentStaff"></div>
	  <button class="tournamentCancelBtn">cancel</button>
	</div>
  </div>`;
  }

  onMatchComplete(time) {
    // 3초 후에 실행될 함수
    setTimeout(() => {
      // 게임 화면으로 이동
      this.closeModal();
      window.history.pushState(null, null, '/game'); // '/gameScreenURL'은 게임 화면의 URL로 변경해야 합니다.
      router();
      // 일단 서버에서 소켓 메세지가 일찍 와서 2초로 수정 원래는 3초
    }, time);
  }

  cancelTournamentEventListener() {
    const $tournamentCancelBtn = document.querySelector('.tournamentCancelBtn');
    $tournamentCancelBtn.addEventListener('click', () => {
      tws.close();
      this.closeModal();
    });
  }

  async renderModal(option) {
    this.option = option;
    await this.openModal(await this.getHtml(), false);
    this.cancelTournamentEventListener();

    const $tournamentCancelBtn = document.querySelector('.tournamentCancelBtn');
    const $tournamentMsg = document.querySelector('.tournamentMsg');
    const $currentStaff = document.querySelector('.currentStaff');
    $tournamentCancelBtn.style.display = 'block';

    // 메시지 수신 이벤트 핸들러
    tws.onMessage(msg => {
      // 참가자 수 업데이트
      if (msg.participants_num) {
        $currentStaff.innerText = `${msg.participants_num}/4`;
      }

      // 모든 참가자가 조인한 경우
      // 토너먼트 ID 처리
      if (msg.type === 'TOURNAMENT_PARTICIPANTS') {
        sessionStorage.setItem('tournament_id', msg.data.id);
      }
      if (msg.type === 'SUCCESS_SEMI_FINAL_MATCHING') {
        sessionStorage.setItem('gameOption', JSON.stringify(this.option));
        $currentStaff.innerText = `4/4`;
        $tournamentMsg.innerHTML =
          'Tournament Ready<br />The game will start soon!';

        $tournamentCancelBtn.style.display = 'none';
        tws.send({
          tournament_mode: 'semi_final',
          tournament_id: JSON.parse(sessionStorage.getItem('tournament_id')),
        });
      }
      if (msg.type === 'START_TOURNAMENT_SEMI_FINAL') {
        sessionStorage.setItem('webSocketType', JSON.stringify(msg.type));
        if (
          msg.data.player1.info.nickname ===
          JSON.parse(sessionStorage.getItem('user')).nickname
        ) {
          sessionStorage.setItem('myPosition', 'player1');
          sessionStorage.setItem(
            'gameMyInfo',
            JSON.stringify(msg.data.player1),
          );
          sessionStorage.setItem('opponentsPosition', 'player2');
          sessionStorage.setItem(
            'gameOpponentInfo',
            JSON.stringify(msg.data.player2),
          );
        } else {
          sessionStorage.setItem('myPosition', 'player2');
          sessionStorage.setItem(
            'gameMyInfo',
            JSON.stringify(msg.data.player2),
          );
          sessionStorage.setItem('opponentsPosition', 'player1');
          sessionStorage.setItem(
            'gameOpponentInfo',
            JSON.stringify(msg.data.player1),
          );
        }
        this.onMatchComplete(3000);
      }
    });
  }
}

export default TournamentModal;
