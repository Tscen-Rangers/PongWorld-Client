import AbstractModal from './AbstractModal.js';

class NoticeModal extends AbstractModal {
  constructor() {
    super();
  }

  async getHtml(text) {
    return `
<div class="modalBack">
	<div class="modal">
	  <div id="noticeContent">${text}</div>
	</div>
  </div>`;
  }

  async renderModal(text) {
    await this.openModal(await this.getHtml(text), false);
    setTimeout(() => {
      this.closeModal();
    }, 2000);
  }
}

export default NoticeModal;
