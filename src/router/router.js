//main组件的二级路由
const MainRouter = [
  {
    path: '/home',
    alias: '/',
    name: 'Home',
    component:()=>import('../views/Home.vue')
  },
  {
    path: '/menu',
    name: 'Menu',
    component:()=>import('../views/Menu.vue')
  },
  {
    path: '/shopbag',
    name: 'Shopbag',
    component:()=>import('../views/Shopbag.vue')
  },
  {
    path: '/my',
    name: 'My',
    component:()=>import('../views/My.vue')
  },
  
]

export const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/Main'),
    children:MainRouter
  },
  {
    path: '/login',
    name: 'Login',
    component: ()=> import('../views/Login')
  },
  {
    path: '/introduce/:id',
    name: 'Introduce',
    component:()=>import('../views/Introduce.vue')
  },
  {
    path: '/address',
    name: 'Address',
    component:()=>import('../views/Address.vue')
  },
  {
    path: '/addedAddress/:aid?',
    name: 'AddedAddress',
    component:()=>import('../views/AddedAddress.vue')
  },
  {
    path: '/settlement/:id?',
    name: 'Settlement',
    component:()=>import('../views/Settlement.vue')
  },
  {
    path: '/myOrder',
    name: 'MyOrder',
    component:()=>import('../views/MyOrder.vue')
  },
  {
    path: '/myData',
    name: 'MyData',
    component:()=>import('../views/MyData.vue')
  },
  {
    path: '/collection',
    name: 'Collection',
    component:()=>import('../views/Collection.vue')
  },
  {
    path: '/security',
    name: 'Security',
    component:()=>import('../views/Security.vue')
  },
  {
    path: '/findPassword',
    name: 'FindPassword',
    component:()=>import('../views/FindPassword.vue')
  },
  
]