import AbstractView from '../../AbstractView.js';
import {
  getToken,
  setToken,
  setRefreshToken,
  refreshAccessToken,
} from '../../tokenManager.js';
import {router} from '../../route.js';
import {setSignUpCompleted} from '../../signUpCompleted.js';
import cws from '../../WebSocket/ConnectionSocket.js';
import chatws from '../../WebSocket/ChatSocket.js';
import {connectionSocketConnect} from '../../webSocketManager.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Loading....');
  }

  async getHtml() {
    return `
	<div style="align-self: center; display:flex; flex-direction: column; align-items: center;">
		<svg
		xmlns="http://www.w3.org/2000/svg"
		width="10em"
		height="10em"
		viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
			opacity="0.5"
		/>
		<path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
			<animateTransform
			attributeName="transform"
			dur="1s"
			from="0 12 12"
			repeatCount="indefinite"
			to="360 12 12"
			type="rotate"
			/>
		</path>
		</svg>
		Receiving a request from the server
	</div>
		`;
  }

  async getUserData() {
    const authCode = new URLSearchParams(window.location.search).get('code');

    try {
      const res = await fetch(
        'http://127.0.0.1:8000/tcen-auth/pong-world-login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: authCode,
          }),
        },
      );
      const userData = await res.json();
      setToken(userData.data.access_token);
      setRefreshToken(userData.data.refresh_token);
      return userData.data;
    } catch (error) {
      console.log(error);
    }
  }

  async afterRender() {
    setSignUpCompleted(false);
    const userData = await this.getUserData();
    console.log(userData);
    sessionStorage.setItem('user', JSON.stringify(userData.user));
    connectionSocketConnect();
    if (userData.is_new_user) window.history.pushState(null, null, '/signup');
    else window.history.pushState(null, null, '/home');
    router();
  }
}
