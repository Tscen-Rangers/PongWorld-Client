import AbstractView from '../../AbstractView.js';// AbstractView의 정확한 경로로 수정해주세요.
import {getToken, refreshAccessToken} from '../../tokenManager.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("PongWorldㅣTwoFactor");
  }

  async getHtml() {
    return `
      <div id="mailAuthModal" class="modal">
        <div class="mailAuthContent">
          <h2><i class="fas fa-envelope"></i> 본인확인(메일)</h2>
          <div class="sendAndInput">
            <input type="text" id="code" placeholder="인증 코드 입력">
            <button id="sendEmailButton">메일 전송</button>
          </div>
          <button id="verifyCodeButton">인증 확인</button>
          <p style="color: red" id="error"></p>
        </div>
      </div>
    `;
  }

  async afterRender() {
    // 메일 전송 버튼 클릭 이벤트
    document.getElementById("sendEmailButton").addEventListener("click", async () => {
      await this.sendEmail();
    });

    // 인증 확인 버튼 클릭 이벤트
    document.getElementById("verifyCodeButton").addEventListener("click", async () => {
      await this.verifyCode();
    });
  }

  async sendEmail() {
    const accessToken = getToken();
    try {
      const response = await fetch('http://localhost:8000/tcen-auth/verify/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        alert('인증 이메일이 발송되었습니다.');
      } else {
        console.error('이메일 발송 실패.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async verifyCode() {
    const code = document.getElementById('code').value;
    const accessToken = getToken();
    try {
      const response = await fetch('http://localhost:8000/tcen-auth/verify/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: code }),
      });
      if (response.ok) {
        alert('인증 성공');
        // 인증 성공 후 로직, 예: 홈 페이지로 리다이렉션
        window.location.href = '/home';
      } else {
        document.getElementById('error').textContent = '인증 실패';
      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('error').textContent = '오류 발생';
    }
  }
}