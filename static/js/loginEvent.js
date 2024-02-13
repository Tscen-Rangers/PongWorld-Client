// ----------------------- 로그인 페이지 마우스에 따라 탁구채 움직임 ---------------------------------
const mouseMove = e => {
  // 마우스 좌표값 가져오기
  let mousePageX = e.pageX;
  let mousePageY = e.pageY;

  // 마우스 좌표값 기준점을 가운데로 변경
  let centerPageX = window.innerWidth / 2 - mousePageX;
  let centerPageY = window.innerHeight / 2 - mousePageY;

  // centerPage 최소값 -100 최대값 100 설정 (! Point)
  let maxPageX = Math.max(-200, Math.min(100, centerPageX));
  let maxPageY = Math.max(-200, Math.min(100, centerPageY));

  // 각도 줄이는 설정
  let anglePageX = maxPageX * 0.1;
  let anglePageY = maxPageY * 0.1;

  // 부드럽게 설정
  let softPageX = 0;
  let softPageY = 0;
  softPageX += (anglePageX - softPageX) * 0.4;
  softPageY += (anglePageY - softPageY) * 0.4;

  const stick = document.querySelector('#stickImg');
  stick.style.transform =
    'translate(-50%, -50%)  perspective(600px) rotateX(' +
    softPageY +
    'deg) rotateY(' +
    -softPageX +
    'deg)';
};

window.addEventListener('mousemove', mouseMove);
// ----------------------- 로그인 페이지 마우스에 따라 탁구채 움직임 ---------------------------------
