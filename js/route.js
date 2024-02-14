import Login from './pages/loginPage/Login.js';
import Setting from './pages/settingPage/Setting.js';
import Game from './pages/gamePage/Game.js';
import Friends from './pages/friendPage/Friends.js';
import Mypage from './pages/myPage/Mypage.js';
import Chat from './pages/chatPage/Chat.js';
import SearchFriends from './pages/friendPage/SearchFriends.js';
import Blocked from './pages/friendPage/Blocked.js';
import FriendRequest from './pages/friendPage/FriendRequest.js';

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
  const headphone = document.querySelector('#headphoneImg');
  navBar.style.display = location.pathname === '/' ? 'none' : 'block';
  mainTitle.style.display = location.pathname === '/' ? 'none' : 'block';
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
  }

  // 일치하는 route에서 인스턴스 생성

  const view = new match.route.view(getParams(match));
  document.querySelector('#app').innerHTML = await view.getHtml();
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
