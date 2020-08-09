<template>
  <div class="chat">
    <div class="chat-head">
      讲文明、树新风 ( {{ chat_names.length }} )
    </div>
    <div class="chat-body">
      <div class="chat-body-l">
        <div ref="chatBodyMsg" class="chat-body-msg over-scroll">
          <div v-for="(user_msg,idx) in chat_msgs" :key="idx">
            <!-- 开始用户消息 -->
            <div v-if="user_msg.type_id === 12 && user_msg.name !== chat_name" class="chat-user-msg">
              <div class="name-time">
                <span>{{ user_msg.name }}</span>
                <span>{{ user_msg.time }}</span>
              </div>
              <div class="msg-user-box">
                <pre>{{ user_msg.msg }}</pre>
              </div>
            </div>
            <!-- 结束用户消息 -->
            <!-- 开始系统通知 -->
            <p v-if="user_msg.type_id === 0" class="enter-user-msg">{{ user_msg.msg }}</p>
            <!-- 结束系统通知 -->
            <!-- 开始自己消息 -->
            <div v-if="user_msg.type_id === 12 && user_msg.name === chat_name" class="chat-me-msg">
              <div class="name-time">
                <span>{{ user_msg.time }}</span>
                <span>{{ user_msg.name }}</span>
              </div>
              <div class="msg-me-box">
                <pre>{{ user_msg.msg }}</pre>
              </div>
            </div>
            <!-- 结束自己消息 -->
          </div>
        </div>
        <div class="chat-body-tx">
          <textarea
            v-model="msg"
            class="chat-msg over-scroll"
            maxlength="500"
            placeholder="说点什么..."
            v-on="{keypress:enterMsg,focus:handleHideTip,blur:handleShowTip}"
          />
          <span v-if="showTip" ref="msgTip" class="msg-tip">按Enter发送、Ctrl + Enter换行</span>
        </div>
      </div>
      <div class="chat-body-r over-scroll">
        <ul>
          <li v-for="(name, idx) in chat_names" :key="idx">
            <span v-if="name === chat_name" style="color: #1d8df4">{{ name }}</span>
            <span v-else>{{ name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { createSocket, sendWebSocketMsg } from '@/utils/websocket'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'Chat',
  data() {
    return {
      allowSend: true,
      showTip: true,
      msg: ''
    }
  },
  computed: {
    ...mapGetters({
      'chat_name': 'chat_name',
      'chat_names': 'chat_names',
      'chat_msgs': 'chat_msgs',
      'token': 'token'
    })
  },
  watch: {
    chat_msgs() {
      this.$nextTick(() => {
        this.$refs.chatBodyMsg.scrollTop = this.$refs.chatBodyMsg.scrollHeight
      })
    }
  },
  mounted() {
    createSocket()
    window.addEventListener('chatMessage', this.getMsg)
  },
  destroyed() {
    window.removeEventListener('chatMessage', this.getMsg)
  },
  methods: {
    // 获取消息数据
    getMsg(data) {
      const msgData = JSON.parse(JSON.parse(data.detail))
      this.$store.dispatch('chat/pushChatMsg', msgData)
    },
    // 发送消息
    enterMsg(event) {
      if ((event.keyCode === 13 && event.ctrlKey) || event.keyCode === 10) {
        this.msg += '\n'
      } else if (event.keyCode === 13) {
        event.preventDefault()
        if (this.msg === '') {
          return Message.info('请输入内容')
        }
        if (!this.allowSend) {
          return Message.info('发送频率过快')
        }
        this.allowSend = false
        const msgData = {
          type_id: 12,
          name: this.chat_name,
          time: this.parseTime(new Date()),
          msg: this.msg
        }
        sendWebSocketMsg(msgData)
        this.msg = ''
        setTimeout(() => {
          this.allowSend = true
        }, 2000)
      }
    },
    handleShowTip() {
      this.showTip = true
    },
    handleHideTip() {
      this.showTip = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .chat {
    background: #f4f6f9;
    min-width: 500px;
    height: 500px;
    border: 1px solid #e6e6e6;

    .chat-head {
      text-align: center;
      font-size: 16px;
      line-height: 50px;
      padding-right: 123px;
      height: 50px;
      border-bottom: 1px solid #e6e6e6;
    }

    .chat-body {
      display: flex;
      flex-direction: row;
      height: 450px;
    }
  }

  .chat-body-l {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 14px;
  }

  .chat-body-r {
    width: 150px;
    border-left: 1px solid #e6e6e6;
    overflow-y: auto;

    ul {
      list-style: none;
      margin-top: 10px;
      li {
        font-size: 12px;
        line-height: 20px;
      }
    }
  }

  .chat-body-msg {
    padding: 10px;
    height: 100%;
    overflow-y: auto;
  }

  .chat-body-tx {
    position: relative;
    height: 100px;
    border-top: 1px solid #e6e6e6;

    .chat-msg {
      background: #f4f6f9;
      padding: 8px;
      width: 100%;
      resize: none;
      height: 97px;
      border: none;
      outline: none;
    }
  }

  .chat-me-msg {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;

    .name-time {
      float: right;

      span:nth-child(1) {
        padding-right: 3px;
        font-size: 12px;
        color: #9b9b9b;
      }

      span:nth-child(2) {
        color: #555555;
      }
    }

    .msg-me-box {
      position: relative;
      max-width: 350px;
      min-width: 35px;
      margin: 10px 0;
      background: #ffffff;
      font-size: 12px;
      line-height: 16px;
      padding: 8px;
      border-radius: 8px;

      &::before {
        content: " ";
        border-top: 10px solid transparent;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #ffffff;
        position: absolute;
        right: 8px;
        top: -16px;
      }
    }
  }

  .chat-user-msg {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    .name-time {
      span:nth-child(1) {
        color: #555555;
      }

      span:nth-child(2) {
        padding-left: 3px;
        font-size: 12px;
        color: #9b9b9b;
      }
    }

    .msg-user-box {
      position: relative;
      max-width: 350px;
      min-width: 35px;
      margin: 10px 0;
      background: #ffffff;
      font-size: 12px;
      line-height: 16px;
      padding: 8px;
      border-radius: 8px;

      &::before {
        content: " ";
        border-top: 10px solid transparent;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #ffffff;
        position: absolute;
        left: 8px;
        top: -16px;
      }
    }
  }

  pre {
    margin: 0;
    font-family: auto;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
  }

  .enter-user-msg {
    margin: 0;
    text-align: center;
    font-size: 12px;
    padding: 5px;
    color: #9b9b9b;
  }

  .msg-tip {
    position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 12px;
    color: #9b9b9b;
  }

  .over-scroll {
    /*滚动条整体样式*/
    &::-webkit-scrollbar {
      width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }

    &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgb(244, 246, 249);
      background: rgba(155, 155, 155, 0.51);
    }

    &::-webkit-scrollbar-track { /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgb(244, 246, 249);
      border-radius: 5px;
      background: #f4f6f9;
    }
  }
</style>
