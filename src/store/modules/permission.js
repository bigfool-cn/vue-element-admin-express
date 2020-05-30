import { errorRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes) {
  const res = []

  routes.forEach(route => {
    const component = route.component
    const tmp = {
      path: route.path,
      component: route.component === 'Layout' ? Layout : () => import(`@/views${component}`), // resolve => require([`@/views${component}`], resolve),
      redirect: route.redirect || undefined,
      hidden: !!route.hidden,
      name: route.name,
      meta: {},
      children: route.children || undefined
    }
    tmp.meta.title = route.title
    if (route.icon) {
      tmp.meta.icon = route.icon
    }
    if (tmp.children) {
      if (tmp.children.length) {
        tmp.alwaysShow = true
      }
      tmp.children = filterAsyncRoutes(tmp.children)
    }
    res.push(tmp)
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(menus).concat(errorRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
