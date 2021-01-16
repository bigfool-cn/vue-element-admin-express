import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
const WSS_URL = `wss://vue.bigfool.cn/chat?token=`
let Socket = ''

/** 建立连接 */
export function createSocket() {
  if (!Socket || (Socket && Socket.readyState === WebSocket.CLOSED)) {
    Socket = new WebSocket(WSS_URL + getToken())
    Socket.onopen = wsOpen
    Socket.onmessage = wsMessage
    Socket.onerror = wsError
    Socket.onclose = wsClose
  }
}

/** 打开WS */
export function wsOpen() {
  console.log('ws已连接')
}

/** 连接失败重连 */
export function wsError() {
  Message.error('websocket连接失败')
  Socket = ''
}

/** WS数据接收统一处理 */
export function wsMessage(event) {
  window.dispatchEvent(new CustomEvent('chatMessage', {
    detail: event.data
  }))
}

/** 发送数据
 * @param data
 */
export function sendWebSocketMsg(data) {
  if (Socket !== null && Socket.readyState === WebSocket.CLOSED) {
    Socket = ''
    createSocket() // 重连
  } else if (Socket.readyState === WebSocket.OPEN) {
    Socket.send(JSON.stringify(data))
  } else if (Socket.readyState === WebSocket.CONNECTING) {
    setTimeout(() => {
      Socket.send(JSON.stringify(data))
    }, 5000)
  }
}

/** 关闭WS */
export function wsClose() {
  if (Socket) {
    Socket.close()
  }
  console.log('ws已关闭')
}

