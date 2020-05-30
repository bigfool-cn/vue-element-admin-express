import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const errorRoutes = [
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/menu',
  //   alwaysShow: true,
  //   name: 'System',
  //   meta: {
  //     title: '系统管理',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'menu',
  //       component: () => import('@/views/system/menu'),
  //       name: 'Menu',
  //       meta: { title: '菜单管理' }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/system/role'),
  //       name: 'Role',
  //       meta: { title: '角色管理' }
  //     },
  //     {
  //       path: 'user',
  //       component: () => import('@/views/system/user'),
  //       name: 'User',
  //       meta: { title: '用户管理' }
  //     },
  //     {
  //       path: 'log',
  //       component: () => import('@/views/system/log'),
  //       name: 'Log',
  //       meta: { title: '登录日志' }
  //     }
  //   ]
  // },
  // {
  //   path: '/demo',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Demo',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: 'demo-1',
  //       component: () => import('@/views/demo/demo-1'),
  //       name: 'demo1',
  //       meta: { title: 'demo-1', noCache: true },
  //       alwaysShow: true,
  //       children: [
  //         {
  //           path: 'demo-1-1',
  //           component: () => import('@/views/demo/demo-1/demo-1-1'),
  //           name: 'demo11',
  //           meta: { title: 'demo-1-1', noCache: true }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'demo-2',
  //       component: () => import('@/views/demo/demo-2'),
  //       name: 'demo2',
  //       meta: { title: 'demo-2', noCache: true },
  //       alwaysShow: true,
  //       children: [
  //         {
  //           path: 'demo-2-1',
  //           component: () => import('@/views/demo/demo-2/demo-2-1'),
  //           name: 'demo22',
  //           meta: { title: 'demo-2-1', noCache: true }
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: '错误页面',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
