import AbstractView from '../../AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Mypage');
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
    <link href="https://fonts.googleapis.com/css2?family=Lexend+Exa&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <div class="contentsContainer">
          <div class="profile-container">
            <img src="../public/hacho.png" class="main-player-image" alt="Player 1 Image">
            <div  class="profile-string">
              <div class="profile-name">
                Hacho
              </div>
              <div class="profile-card">
                <p>나는야 탁구왕 아무도 나를 못 이겨!</p>
              </div>
            </div>
          </div>
          <div class="stats">
            <div class="stat"><span class="stat-title">Ranking</span><br><span class="stat-value">3</span></div>
            <div class="stat"><span class="stat-title">Matches</span><br><span class="stat-value">3</span></div>
            <div class="stat"><span class="stat-title">Win</span><br><span class="stat-value">2</span></div>
            <div class="stat"><span class="stat-title">Score</span><br><span class="stat-value">1042</span></div>
          </div>
            
          <div class="match-history">
            <div class="match">
              <img src="../public/hacho.png" class="player-image" alt="Player 1 Image">
              <img src="../public/jimin.png" class="player-image" alt="Player 2 Image">
              <span class="players">hacho VS jimpark</span>
              <span class="score"><span class="score-first">3</span>:2</span>
              <span class="result">win</span>
              <span class="time-ago">2 days ago</span>
            </div>
            <div class="match">
              <img src="../public/hacho.png" class="player-image" alt="Player 1 Image">
              <img src="../public/jimin.png" class="player-image" alt="Player 2 Image">
              <span class="players">hacho VS jimpark</span>
              <span class="score"><span class="score-first">1</span>:2</span>
              <span class="result">lose</span>
              <span class="time-ago">3 days ago</span>
            </div>
            <div class="match">
              <img src="../public/hacho.png" class="player-image" alt="Player 1 Image">
              <img src="../public/jimin.png" class="player-image" alt="Player 2 Image">
              <span class="players">hacho VS jimpark</span>
              <span class="score"><span class="score-first">0</span>:2</span>
              <span class="result">win</span>
              <span class="time-ago">4 days ago</span>
            </div>
          </div>
          <i class="fas fa-cog settings-icon"></i> 
    </div>
  `;
  }


  initPage() {
    const settingsIcon = document.querySelector('.fas.fa-cog.settings-icon');
    const settingsModal = document.getElementById('settingsModal');
    const modalContent = settingsModal.querySelector('.modal');
  
    settingsIcon.addEventListener('click', () => {
      settingsModal.style.display = 'block'; // 모달을 표시
    });
  
    // 모달 외부 클릭 시 모달 숨김
    window.addEventListener('click', (event) => {
      if (settingsModal.contains(event.target) && !modalContent.contains(event.target)) {
        settingsModal.style.display = 'none';
      }
    });
  }
  afterRender() {}
}

