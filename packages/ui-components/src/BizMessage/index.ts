import { App } from 'vue'
import BizMessageVue from './index.vue'
import type { MessageAPI, MessageOptions, MessageInstance } from './type'
import { createMessage, closeAllMessages } from './BizMessage'

// 创建API函数
const BizMessage: MessageAPI = function (options) {
  if (typeof options === 'string') {
    return createMessage({ message: options })
  }
  return createMessage(options)
} as MessageAPI

// 添加类型方法
BizMessage.success = options => {
  if (typeof options === 'string') {
    return createMessage({ message: options, type: 'success' })
  }
  return createMessage({ ...options, type: 'success' })
}

BizMessage.error = options => {
  if (typeof options === 'string') {
    return createMessage({ message: options, type: 'error' })
  }
  return createMessage({ ...options, type: 'error' })
}

BizMessage.warning = options => {
  if (typeof options === 'string') {
    return createMessage({ message: options, type: 'warning' })
  }
  return createMessage({ ...options, type: 'warning' })
}

BizMessage.info = options => {
  if (typeof options === 'string') {
    return createMessage({ message: options, type: 'info' })
  }
  return createMessage({ ...options, type: 'info' })
}

BizMessage.confirmBox = options => {
  return createMessage({
    type: 'warning',
    duration: 0,
    modal: true,
    showCancel: true,
    showConfirm: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    ...(options as MessageOptions)
  })
}
// 确认弹窗成功使用提示信息
BizMessage.confirmSuccess = options => {
  if (typeof options === 'string') {
    return createMessage({ message: options, type: 'success', showConfirm: false, duration: 3000, modal: false })
  }
  return createMessage({ ...options, type: 'success', showConfirm: false, duration: 3000, modal: false })
}

// 确认弹窗取消使用提示信息
BizMessage.confirmCancel = options => {
  if (typeof options === 'string') {
    return createMessage({ message: options, type: 'info', showConfirm: false, duration: 3000, modal: false })
  }
  return createMessage({ ...options, type: 'info', showConfirm: false, duration: 3000, modal: false })
}

// 关闭所有消息
BizMessage.closeAll = closeAllMessages

// 安装插件
const install = (app: App) => {
  app.component('BizMessage', BizMessageVue)
  app.config.globalProperties.$message = BizMessage
}

export { BizMessage, BizMessageVue }
export type { MessageAPI, MessageOptions, MessageInstance }

export default {
  install
}
