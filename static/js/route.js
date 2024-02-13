import Login from './views/Login.js';
import Post from './views/Post.js';
import Setting from './views/Setting.js';
import PostView from './views/PostView.js';
import Game from './views/Game.js';
import Friends from './views/Friends.js';
import Mypage from './views/Mypage.js';
import Chat from './views/Chat.js';

const pathToRegex = path =>
  new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');

const getParams = match => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    result => result[1],
  );

  const obj = Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  return obj;
};

const navigateTo = url => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const navBar = document.querySelector('.nav');
  const mainTitle = document.querySelector('#main_title');
  navBar.style.display = location.pathname === '/' ? 'none' : 'block';
  mainTitle.style.display = location.pathname === '/' ? 'none' : 'block';
  const routes = [
    {
      path: '/',
      view: Login,
    },
    {
      path: '/game',
      view: Game,
    },
    {
      path: '/friends',
      view: Friends,
    },
    {
      path: '/chat',
      view: Chat,
    },
    {
      path: '/mypage',
      view: Mypage,
    },
    {
      path: '/post',
      view: Post,
    },
    {
      path: '/post/:id',
      view: PostView,
    },
    {
      path: '/setting',
      view: Setting,
    },
  ];

  const potentialMatches = routes.map(route => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(
    potentialMatche => potentialMatche.result !== null,
  );

  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }

  // 일치하는 route에서 인스턴스 생성

  const view = new match.route.view(getParams(match));
  if (location.pathname === '/')
    document.querySelector('#app').innerHTML = await view.getHtml();
  else
    document.querySelector('.contentsContainer').innerHTML =
      await view.getHtml();
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', e => {
    if (e.target.matches('[data-spa]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
});

// 뒤로가기 앞으로가기 할때 해당 route 제대로 표시
window.addEventListener('popstate', router);
const navBar = document.querySelector('.nav');
const mainTitle = document.querySelector('#main_title');
navBar.style.display = location.pathname === '/' ? 'none' : 'block';
mainTitle.style.display = location.pathname === '/' ? 'none' : 'block';
