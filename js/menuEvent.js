document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav');
  const f = document.querySelector('#f');
  const s = document.querySelector('#s');
  menu.addEventListener('click', e => {
    f.classList.toggle('active');
    s.classList.toggle('active');
    nav.classList.toggle('active');
  });
});
