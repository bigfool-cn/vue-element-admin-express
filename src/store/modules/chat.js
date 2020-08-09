import { Message } from 'element-ui'

const state = {
  chat_name: '',
  chat_names: [],
  chat_msgs: []
}

const mutations = {
  CHAT_NAME: (state, name) => {
    state.chat_name = name
  },
  CHAT_NAMES: (state, names) => {
    state.chat_names = names
  },
  PUSH_CHAT_MSG: (state, msg) => {
    state.chat_msgs.push(msg)
    if (state.chat_msgs.length >= 1200) {
      state.chat_msgs = state.chat_msgs.slice(600)
    }
  },
  DEL_CHAT_DATA: (state) => {
    state.chat_name = ''
    state.chat_names = []
    state.chat_msgs = []
  }
}

const actions = {
  delChatData({ commit }) {
    commit('DEL_CHAT_DATA')
  },
  pushChatMsg({ commit }, userMsg) {
    if (userMsg.type_id !== undefined) {
      let msg = {}
      switch (userMsg.type_id) {
        case -1:
          return Message.error(userMsg.msg)
        case 0:
          msg = {
            type_id: 0,
            name: userMsg.name,
            time: userMsg.time,
            msg: userMsg.msg
          }
          commit('CHAT_NAMES', userMsg.names)
          commit('PUSH_CHAT_MSG', msg)
          break
        case 1:
          commit('CHAT_NAME', userMsg.msg)
          break
        case 12:
          msg = {
            type_id: 12,
            name: userMsg.name,
            time: userMsg.time,
            msg: userMsg.msg
          }
          commit('PUSH_CHAT_MSG', msg)
          break
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
