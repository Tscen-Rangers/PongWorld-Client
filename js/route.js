import Login from './pages/loginPage/Login.js';
import Setting from './pages/settingPage/Setting.js';
import Home from './pages/homePage/Home.js';
import Friends from './pages/friendPage/Friends.js';
import Mypage from './pages/myPage/Mypage.js';
import Chat from './pages/chatPage/Chat.js';
import DirectChat from './pages/chatPage/DirectChat.js';
import SearchFriends from './pages/friendPage/SearchFriends.js';
import Blocked from './pages/friendPage/Blocked.js';
import FriendRequest from './pages/friendPage/FriendRequest.js';
import Game from './pages/gamePage/Game.js';
import NotFound from './pages/notFoundPage/notFound.js';

const navBar = document.querySelector('.nav');
const mainTitle = document.querySelector('#main_title');
const headphone = document.querySelector('#headphoneImg');
const Navs = Array.from(document.querySelectorAll('.nav__link'));

const routes = [
  {
    path: '/404',
    view: NotFound,
  },
  {
    path: '/',
    view: Login,
  },
  {
    path: '/home',
    view: Home,
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
    path: '/friends/search',
    view: SearchFriends,
  },
  {
    path: '/friends/blocked',
    view: Blocked,
  },
  {
    path: '/friends/request',
    view: FriendRequest,
  },
  {
    path: '/chat',
    view: Chat,
  },
  {
    path: '/chat/direct',
    view: DirectChat,
  },
  {
    path: '/chat/direct/:user',
    view: DirectChat,
  },
  {
    path: '/mypage',
    view: Mypage,
  },
  // {
  //   path: '/post',
  //   view: Post,
  // },
  // {
  //   path: '/post/:id',
  //   view: PostView,
  // },
  {
    path: '/setting',
    view: Setting,
  },
];

// 현재 선택된 Nav메뉴 스타일 활성화
const seletedNavStyle = path => {
  Navs.forEach(e => {
    //startWith : 문자열이 특정 문자열로 시작하는지 검사
    if (path.startsWith(e.pathname)) e.classList.add('active');
    else e.classList.remove('active');
  });
};

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
  navBar.style.display =
    location.pathname === '/' || location.pathname === '/game'
      ? 'none'
      : 'block';
  mainTitle.style.display =
    (location.pathname === '/') | (location.pathname === '/game')
      ? 'none'
      : 'block';
  headphone.style.display = location.pathname === '/' ? 'none' : 'block';

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
    headphone.style.display = 'none';
    navBar.style.display = 'none';
  }

  seletedNavStyle(match.route.path);

  // const a = '/chat/direct/hello'.match(pathToRegex('/chat/direct/:hello'));

  // 일치하는 route에서 인스턴스 생성
  const view = new match.route.view(getParams(match));
  document.querySelector('#app').innerHTML = await view.getHtml();
  view.afterRender();
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', e => {
    if (e.target.closest('[data-spa]')) {
      e.preventDefault();
      navigateTo(e.target.closest('[data-spa]').href);
    }
  });
  router();
});

// 뒤로가기 앞으로가기 할때 해당 route 제대로 표시
window.addEventListener('popstate', router);
