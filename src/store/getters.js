const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  user_id: state => state.user.user_id,
  name: state => state.user.name,
  menus: state => state.user.menus,
  buttons: state => state.user.buttons,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters
