class AbstractModal {
  constructor() {}

  async openModal(html, backdropFlag = true) {
    const $testModal = document.getElementById('testModal');
    $testModal.innerHTML = html;
    $testModal.classList.add('active');

    if (backdropFlag)
      document.querySelector('.modalBack').addEventListener('click', e => {
        if (e.target === e.currentTarget) {
          this.closeModal($testModal);
        }
      });
  }

  closeModal() {
    const $testModal = document.getElementById('testModal');
    $testModal.classList.remove('active');
    // setTimeout(() => {
    if (document.querySelector('.modalBack'))
      document.querySelector('.modalBack').remove();
    // }, 100);
  }

  renderModal() {
    console.error('renderModal은 자식 클래스에 구현이 되어야 합니다.');
  }
}

export default AbstractModal;
