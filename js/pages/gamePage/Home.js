import AbstractView from '../../AbstractView.js';

const history = [
  {player1: 'jimpark', player2: 'hacho', res: '2:3', date: '2 days ago'},
  {player1: 'jimpark', player2: 'hacho', res: '2:3', date: '2 days ago'},
  {player1: 'jimpark', player2: 'hacho', res: '2:3', date: '2 days ago'},
];

const $gameOptionModalContainer = document.getElementById(
  'gameOptionModalContainer',
);

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Game');
  }

  // 비동기를 사용하는 이유는 return 값에 axios나 비동기적으로 데이터를 서버로 부터 받아오고 전달 해 줘야 하기 떄문
  async getHtml() {
    return `
    <div class="contentsContainer">
  <h1 id="gamepageTitle">Ranking</h1>
  <div class="usersRankBody">
    <div class="usersRank">
      <svg
        class="starImg"
        xmlns="http://www.w3.org/2000/svg"
        width="3em"
        height="3em"
        viewBox="0 0 24 24">
        <path
          fill="#000000"
          d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
        />
      </svg>
    </div>
    <div class="usersRank">
      <svg
        class="starImg"
        xmlns="http://www.w3.org/2000/svg"
        width="3em"
        height="3em"
        viewBox="0 0 24 24">
        <path
          fill="#5B5858"
          d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
        />
      </svg>
    </div>
    <div class="usersRank">
      <svg
        class="starImg"
        xmlns="http://www.w3.org/2000/svg"
        width="3em"
        height="3em"
        viewBox="0 0 24 24">
        <path
          fill="#8C8C8C"
          d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
        />
      </svg>
    </div>
    <div class="usersRank">
      <svg
        class="starImg"
        xmlns="http://www.w3.org/2000/svg"
        width="3em"
        height="3em"
        viewBox="0 0 24 24">
        <path
          fill="#B2AEAE"
          d="m12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72l3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41l-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18l-1.1 4.72c-.2.86.73 1.54 1.49 1.08z"
        />
      </svg>
    </div>
    <img id="moreImg" src="/public/more.png" />
  </div>
  <div class="usersHistoryBody">
    <div class="usersHistory">
      <div class="recentPlayersImg">
      <div class="recentPlayer1Img"><img class="recentPlayerImg" src="/public/huipark.jpg"/></div>
      <div class="recentPlayer2Img"><img class="recentPlayerImg" src="/public/huipark.jpg"/></div>
      </div> 
      <div class="versus">
         hacho VS jimpark
      </div>
      <div class="resultScore">3 : 2</div>
      <div class="gameDate">2 days ago</div>
    </div>
    <div class="usersHistory"></div>
    <div class="usersHistory"></div>
  </div>
  <div class="playgameDiv">
    <text class="playgameButton">play game</text>
  </div>
</div>
		`;
  }

  afterRender() {
    const $playGameBtn = document.querySelector('.playgameButton');

    $playGameBtn.addEventListener('click', () =>
      $gameOptionModalContainer.classList.add('show'),
    );
  }
}
