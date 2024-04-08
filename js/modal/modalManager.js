export const openModal = async (html, backdropFlag) => {
  const $testModal = document.getElementById('testModal');
  $testModal.innerHTML = html;
  $testModal.classList.add('active');

  if (backdropFlag)
    document.querySelector('.modalBack').addEventListener('click', e => {
      if (e.target === e.currentTarget) {
        closeModal($testModal);
      }
    });
};

export const closeModal = () => {
  const $testModal = document.getElementById('testModal');
  $testModal.classList.remove('active');
  setTimeout(() => {
    document.querySelector('.modalBack').remove();
  }, 100);
};
