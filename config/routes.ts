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
  {path: '/app/square', icon: 'smile', component: './App/Square', name: '应用广场'},
  {name: '创建应用',path: '/app/create', icon: 'smile', component: './App/Add' },
  {name: '详情页', hideInMenu: true, path: '/app/detail/:id', component: './App/Detail'},
  {name: '题目页面', hideInMenu: true, path: '/app/:id/questions', component: './App/Question'},
  {name: '评分结果页面', hideInMenu: true, path: '/app/:id/scoringResults', component: './App/Score'},
  {name: '应用答题页面', hideInMenu: true, path: '/app/:id/test', component: './App/Test'},
  {name: '答题结果详情页面', hideInMenu: true, path: '/app/answer/result/:id', component: './App/Answer/Result'},
  {name: '我的答题结果', path: '/app/my/result', component: './User/Answer/Result'},
  {name: '个人中心', path: '/user/center', component: './User/Center'},
  {
    path: '/static',
    icon: 'crown',
    name: '统计分析页',
    access: 'canAdmin',
    routes: [
      {path: '/static', redirect: '/'},
      {name: '分析页', path: 'static/analysis', icon: 'smile', component: './Static/Analysis'},
    ],
  },
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
