export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {path: '/user/login', component: './User/Login'},
      {path: '/user/register', component: './User/Register'},
    ],
  },
  {path: '/welcome', icon: 'smile', component: './Welcome', name: '首页'},
  {path: '/app/square', icon: 'smile', component: './Home', name: '应用广场'},
  {name: '详情页', hideInMenu: true, path: '/app/detail/:id', component: './Detail'},
  {
    path: '/admin',
    icon: 'crown',
    name: '管理页',
    access: 'canAdmin',
    routes: [
      {path: '/admin', redirect: '/'},
      {icon: 'table', path: '/admin/user/management', component: './Admin/User', name: '用户管理'},
      {name: '应用管理', path: 'admin/app/management', icon: 'smile', component: './Admin/App'},
      {name: '题目管理', path: 'admin/question/management', icon: 'smile', component: './Admin/Question'},
      {name: '评分管理', path: 'admin/score/management', icon: 'smile', component: './Admin/Score'},
      {name: '回答管理', path: 'admin/answer/management', icon: 'smile', component: './Admin/Answer'},
    ],
  },
  {path: '/', redirect: '/app/square'},
  {path: '*', layout: false, component: './404'},
];
