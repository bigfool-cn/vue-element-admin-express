import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const buttons = store.getters && store.getters.buttons

    if (value && value instanceof Array && value.length > 0) {
      const permissionButtons = value

      const hasPermission = buttons.some(button => {
        return permissionButtons.includes(button)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`需要权限标识，例： v-permission="['system:menu:query','system:menu:add']"`)
    }
  }
}
