import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    name: 'Layout',
    redirect: '/article',
    component: () => import('@/views/layout/Layout'),
    children: [
      {
        path: 'activity',
        component: () => import('@/views/activity/index')
      },
      {
        path: 'activity/detail',
        component: () => import('@/views/activity/detail')
      },
      {
        path: 'user/login',
        component: () => import('@/views/user/login')
      },
      {
        path: 'square',
        component: () => import('@/views/square/index')
      },
      {
        path: 'square/add',
        component: () => import('@/views/square/add')
      },
      {
        path: 'square/detail/:id',
        component: () => import('@/views/square/detail')
      },
      {
        path: 'label',
        component: () => import('@/views/label/index')
      },
      {
        path:'qa',
        redirect:'/qa/label/0',
        component:()=>import('@/views/qa/index'),
        children:[
          {
            path:'label/:id',
            component:()=>import('@/views/qa/label')
          },
          {
            path:'detail/:id',
            component:()=>import('@/views/qa/detail')
          }
        ]
      },
      {
        path: 'qa/add',
        component: () => import('@/views/qa/add')
      },
      {
        path:'article',
        redirect:'/article/label/0',
        component:()=>import('@/views/article/index'),
        children:[
          {
            path:'label/:id',
            component:()=>import('@/views/article/label')
          },
          {
            path:'detail/:id',
            component:()=>import('@/views/article/detail')
          }
        ]
      },
      {
        path: 'article/add',
        component: () => import('@/views/article/add')
      },
      {
        path: 'article/search/:keyword',
        component: () => import('@/views/article/search')
      },
      {
        path:'home/:id',
        component:()=>import('@/views/home/index'),
        children:[
          {
            path:'myarticle',
            component:()=>import('@/views/home/myarticle')
          },
          {
            path:'myquestion',
            component:()=>import('@/views/home/myquestion')
          },
          {
            path:'myspeech',
            component:()=>import('@/views/home/myspeech')
          },
          {
            path:'followlabel',
            component:()=>import('@/views/home/followlabel.vue')
          },
          {
            path:'followquestion',
            component:()=>import('@/views/home/followquestion')
          },
          {
            path:'followarticle',
            component:()=>import('@/views/home/followarticle')
          },
          {
            path:'followactivity',
            component:()=>import('@/views/home/followactivity')
          },
          {
            path:'detail',
            component:()=>import('@/views/home/detail')
          },
          {
            path:'followuser',
            component:()=>import('@/views/home/followuser')
          },
          {
            path:'fansuser',
            component:()=>import('@/views/home/fansuser')
          }
        ]
      },
      {
        path: 'friends',
        component: () => import('@/views/friends/index')
      },
      {
        path: 'friends/add',
        component: () => import('@/views/friends/add')
      },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

