const $userProfileModalContainer = document.querySelector(
  '.userProfileModalContainer',
);

const $userProfileName = document.querySelector('.userProfileName');
const $userProfileImg = document.querySelector('.userProfileImg');
const $userProfileIntro = document.querySelector('#userProfileIntro');
const $userProfileScore = document.querySelector('#userProfile-stat-score');
const $userProfileMatches = document.querySelector('#userProfile-stat-matches');
const $userProfileWin = document.querySelector('#userProfile-stat-win');
const $userProfileRanking = document.querySelector('#userProfile-stat-ranking');
const $userProfileOnlineImg = document.querySelector('.userProfileOnlineImg');
const $userProfileHistory = document.querySelector(
  '.userProfile-match-history',
);
const $userProfileHistoryInner = document.querySelector(
  '.userProfile-match-history-inner',
);
const $userProfileFriendRequestBtn = document.querySelector(
  '.userProfile-friendRequestBtn',
);
const $chatButton = document.querySelector('.chatbutton');
const $historyWithMeBtn = document.querySelector('.historyWithMeBtn');
const $divide = document.querySelector('.divide');
export const updateGameHistory = gameHistory => {
  console.log('game', gameHistory);
  $userProfileHistory.innerHTML = `      ${
    gameHistory !== 'No game'
      ? gameHistory
          .map(
            (game, index) => `
            <div class="userProfile-match">
            <div class="userProfile-match-inner">
            <div class="userProfile-player-image-container">
            <img
              src=${game.player1.player_profile_img}
              class="userProfile-player-image"
              alt="Player 1 Image"
            />
            <img
              src=${game.player2.player_profile_img}
              class="userProfile-player-image"
              alt="Player 2 Image"
            />
            </div>
            <div class="userProfile-players">${game.player1.nickname} VS ${
              game.player2.nickname
            }</div>
            <div class="userProfile-score">
              <div style="color: ${
                game.player1_score === 10 ? 'black' : 'white'
              } ">${game.player1_score}</div>:<div style="color: ${
              game.player2_score === 10 ? 'black' : 'white'
            } ">${game.player2_score}</div>
            </div>
            <div class="userProfile-result">${
              game.is_win ? 'win' : 'lose'
            }</div>
            <div class="userProfile-time-ago">${game.date}</div>
            </div>
            ${
              index !== gameHistory.length - 1
                ? ` <div style="width:100%; height:1px; background-color:white"></div>`
                : ''
            }
          </div>
  `,
          )
          .join('')
      : '<div style="height:100%; text-align:center;font-size:1.4rem; color:darkgrey">No game records found</div>'
  }`;
};

export const updateFriendRequestBtn = player => {
  console.log(player.friend_status);
  if (player.friend_status === 0)
    $userProfileFriendRequestBtn.innerText = 'friend request';
  if (player.friend_status === 1)
    $userProfileFriendRequestBtn.innerText = 'cancel request';
  else if (player.friend_status === 2)
    $userProfileFriendRequestBtn.style.display = 'none';
  const userProfileData = {
    nickname: player.nickname,
    id: player.id,
    friend_status: player.friend_status,
    friend_id: player.friend_id,
  };
  $userProfileFriendRequestBtn.setAttribute(
    'userProfileData',
    JSON.stringify(userProfileData),
  );
};

export const updateUserModal = (userData, all) => {
  if (all === 0) {
    console.log('hh', userData);
    if (userData.player.id === JSON.parse(sessionStorage.getItem('user')).id) {
      $historyWithMeBtn.style.display = 'none';
      $divide.style.display = 'none';
      $chatButton.style.display = 'none';
      $userProfileFriendRequestBtn.style.display = 'none';
    } else {
      $chatButton.style.display = 'flex';
      $userProfileFriendRequestBtn.style.display = 'flex';
    }
    $userProfileName.innerText = userData.player.nickname;
    $userProfileImg.src = userData.player.profile_img;
    $userProfileOnlineImg.style.display = userData.player.is_online
      ? 'block'
      : 'none';
    $userProfileIntro.innerText = userData.player.intro;
    $userProfileMatches.innerText = userData.player.matches;
    $userProfileScore.innerText = userData.player.total_score;
    $userProfileWin.innerText = userData.player.wins;
    $userProfileRanking.innerText = userData.player.ranking;
    $chatButton.href = `/chat/direct/${userData.player.id}`;
    console.log(userData.player.id);
    updateFriendRequestBtn(userData.player);
    updateGameHistory(userData.games);
    // if (userData.player.friend_status === 0)
    //   $userProfileFriendRequestBtn.innerText = 'friend request';
    // else if (userData.player.friend_status === 1)
    //   $userProfileFriendRequestBtn.innerText = 'request cancel';
    // else if (userData.player.friend_status === 2)
    //   $userProfileFriendRequestBtn.style.display = 'none';
    // const userProfileData = {
    //   nickname: userData.player.nickname,
    //   id: userData.player.id,
    //   friend_status: userData.player.friend_status,
    //   friend_id: userData.player.friend_id,
    // };
    // $userProfileFriendRequestBtn.setAttribute(
    //   'userProfileData',
    //   JSON.stringify(userProfileData),
    // );
    $userProfileModalContainer.classList.add('active');
  }
  //map돌아서 다 렌더링
  else if (all === 1) updateGameHistory(userData.games);
  else if (all === 2) updateFriendRequestBtn(userData.player);
};
