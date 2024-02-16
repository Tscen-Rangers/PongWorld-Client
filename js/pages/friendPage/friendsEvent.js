document.addEventListener('DOMContentLoaded', () => {
  const threedotsImgs = document.querySelectorAll('.threedotsImg');

  threedotsImgs.forEach(threedotsImg => {
    threedotsImg.addEventListener('click', event => {
      const optionModal = event.currentTarget.nextElementSibling;

      // 클릭된 이미지의 모달을 토글
      optionModal.classList.toggle('active');

      // 기존에 열려있는 모달이 있다면 숨김 처리
      const activeModals = document.querySelectorAll('.optionModal.active');
      activeModals.forEach(modal => {
        if (modal !== optionModal) {
          modal.classList.remove('active');
        }
      });
    });
  });
});
