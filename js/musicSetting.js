const songs = [
  {name: '커닝시티', path: '/public/커닝시티.mp3'},
  {name: '이름 없음', path: '/public/BGM.mp3'},
  {name: '악마의 아이(悪魔の子)', path: '/public/악마의 아이.mp3'},
];

let currentSongIndex = 0;

function musicStart(music) {
  const player = document.getElementById('musicPlayer');
  if (music.length) {
    player.src = music;
  } // 오디오 소스 변경
  player
    .play()
    .then(() => {
      document.getElementById('musicPlay').style.display = 'none';
      document.getElementById('musicStop').style.display = 'block';
      console.log('Audio is playing');
    })
    .catch(error => {
      console.error('Error occurred while trying to play audio:', error);
    });
}

// --------------------- 백그라운드 다음 곡 ---------------------
document.getElementById('musicNext').addEventListener('click', function () {
  // 다음 곡으로 인덱스 업데이트
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  const music = songs[currentSongIndex]; // 업데이트된 인덱스로 곡 정보 가져오기
  musicStart(music.path);
  document.getElementById('musicName').innerText = music.name; // 곡 이름 업데이트
});

// --------------------- 백그라운드 이전 곡 ---------------------
document.getElementById('musicPrev').addEventListener('click', function () {
  // 다음 곡으로 인덱스 업데이트
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  const music = songs[currentSongIndex]; // 업데이트된 인덱스로 곡 정보 가져오기
  console.log(music.path);
  musicStart(music.path);
  document.getElementById('musicName').innerText = music.name; // 곡 이름 업데이트
});

// --------------------- 백그라운드 노래 재생 ---------------------
document.getElementById('musicPlay').addEventListener('click', musicStart);
// --------------------- 백그라운드 노래 정지 ---------------------
document.getElementById('musicStop').addEventListener('click', function () {
  const player = document.getElementById('musicPlayer');
  player.pause();
  document.getElementById('musicPlay').style.display = 'block';
  document.getElementById('musicStop').style.display = 'none';
});

// --------------------- 백그라운드 노래 custom range input ---------------------
document
  .querySelector('#backgroundMusicVolume')
  .addEventListener('input', e => {
    const slider = e.target;
    const value = parseInt(slider.value); // 현재 슬라이더 값
    const min = parseInt(slider.min || 0); // 슬라이더 최소값
    const max = parseInt(slider.max || 100); // 슬라이더 최대값
    const width = slider.offsetWidth; // 슬라이더의 전체 너비
    const handleSize = 16; // 핸들의 대략적인 너비 (px), 실제 크기에 맞게 조정 필요

    // 슬라이더 값의 비율 계산
    const percentage = (value - min) / (max - min);
    // 핸들 너비를 고려한 보정값 적용
    const backgroundSize = percentage * (width - handleSize) + handleSize / 2;

    // 슬라이더의 배경 스타일 업데이트
    slider.style.background = `linear-gradient(to right, rgb(105, 105, 105) ${backgroundSize}px, #ececec ${backgroundSize}px)`;
  });

document
  .getElementById('backgroundMusicVolume')
  .addEventListener('input', function (e) {
    const vol = e.target.value;
    document.getElementById('musicPlayer').volume = vol / 100;
  });

document.addEventListener('DOMContentLoaded', () => {
  const Player = document.getElementById('musicPlayer');
  Player.volume = 0.5; // 볼륨을 50%로 설정

  document
    .getElementById('headphoneImg')
    .addEventListener('click', function () {
      document.querySelector('.modalContainer').classList.add('show');
    });
  document
    .querySelector('.modalContainer')
    .addEventListener('click', function (e) {
      if (e.target === this) g;
      document.querySelector('.modalContainer').classList.remove('show');
    });
});
