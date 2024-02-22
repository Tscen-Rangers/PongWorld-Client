document.addEventListener('DOMContentLoaded', () => {
  const battlePlayer = document.querySelector('.battlePlayer');
  const battleCancelBtn = document.querySelector('.battleCancelBtn');
  const confirmModal = document.querySelector('.confirmModalContainer');
  const confirmModalMsg = document.querySelector('.confirmModalMsg');
  const confirmBtn = document.querySelector('.confirmBtn');
  const cancelBtn = document.querySelector('.cancelBtn');

  document.body.addEventListener('click', e => {
    const battleModal = document.querySelector('.battleModalContainer');
    const threedotsImg = e.target.closest('.friendsThreedotsImg');
    const battleButtonImg = e.target.closest('.battlebuttonImg');
    const optionBtn = e.target.closest('.optionBtn');

    if (threedotsImg) {
      const optionModal = threedotsImg.nextElementSibling;
      optionModal.classList.toggle('active');
      const activeModals = document.querySelectorAll('.optionModal.active');
      activeModals.forEach(musicModal => {
        if (musicModal !== optionModal) {
          musicModal.classList.remove('active');
        }
      });
    }

    if (battleButtonImg) {
      const user = battleButtonImg.dataset.user;
      battlePlayer.innerText = `Waiting for a response from ${user}`;
      battleModal.classList.add('active');
    }
    if (optionBtn) {
      const selected = optionBtn.innerText;
      const user = optionBtn.dataset.user;
      confirmModalMsg.innerHTML = `Are you sure <br/> you want to ${selected} ${user}?`;
      confirmModal.classList.add('active');
    }
  });
  battleCancelBtn.addEventListener('click', () => {
    const battleModal = document.querySelector('.battleModalContainer');
    battleModal.classList.remove('active');
  });
  cancelBtn.addEventListener('click', () => {
    confirmModal.classList.remove('active');
  });
});
