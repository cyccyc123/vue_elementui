import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/admin/login', component: () => import('@/views/login/admin/index'), hidden: true },
  // { path: '/register', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/admin/user',
    component: Layout,
    redirect: '/admin/user/list',
    name: '用户管理',
    meta: { title: '用户管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'Table',
        component: () => import('@/views/user/admin/list'),
        meta: { title: '用户列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'Tree',
        component: () => import('@/views/user/admin/add'),
        meta: { title: '添加用户', icon: 'tree' }
      },
      {
        path: 'add/:id',
        name: 'Tree',
        component: () => import('@/views/user/admin/add'),
        meta: { title: '修改用户', icon: 'tree' },
        hidden: true
      },
    ]
  },

  {
    path: '/admin/video',
    component: Layout,
    redirect: '/admin/video/list',
    name: '视频管理',
    meta: { title: '视频管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'Table',
        component: () => import('@/views/video/admin/list'),
        meta: { title: '视频列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'Table',
        component: () => import('@/views/video/admin/add'),
        meta: { title: '添加视频', icon: 'table' }
      },
    ]
  },

  {
    path: '/admin/dynamic',
    component: Layout,
    redirect: '/admin/dynamic/list',
    name: '动态管理',
    meta: { title: '动态管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'Table',
        component: () => import('@/views/dynamic/admin/list'),
        meta: { title: '动态列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'Table',
        component: () => import('@/views/dynamic/admin/add'),
        meta: { title: '添加动态', icon: 'table' }
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
