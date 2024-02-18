let chattingSubmitImage = null; // 전역 변수로 참조 저장

// ------------ 채팅방에 글치면 일어나는 이벤트 ------------
document.body.addEventListener('input', e => {
  const chattingInput = e.target.closest('#chattingInput');
  if (chattingInput) {
    // 제출 이미지가 null 또는 해당 제출 이미지가 유효하지 않으면(페이지가 바뀌는 경우) 새로 조회
    if (!chattingSubmitImage || !document.contains(chattingSubmitImage)) {
      chattingSubmitImage = document.querySelector('#chattingSubmitImage');

      // 제출 코드 작성해야 함
      chattingSubmitImage.addEventListener('click', () => {
        console.log('제출 코드 작성!!!!');
      });
    }

    if (chattingSubmitImage) {
      if (chattingInput.value.length)
        chattingSubmitImage.setAttribute('fill', 'black');
      else chattingSubmitImage.setAttribute('fill', '#ddd');
    }
  }
});
// ------------ 채팅방에 글치면 일어나는 이벤트 ------------
