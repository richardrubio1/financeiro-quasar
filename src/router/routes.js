const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'groups', component: () => import('pages/GroupsPage.vue') },
      { path: 'cadastros/usuarios', component: () => import('pages/UsersPage.vue') },
      { path: 'cadastros/categorias', component: () => import('pages/CategoriaPage.vue') },
      { path: 'lancamentos', component: () => import('pages/LancamentoPage.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/LoginPage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes