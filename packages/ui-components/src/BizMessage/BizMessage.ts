import { createApp, ComponentPublicInstance, App } from 'vue'
import MessageComponent from './index.vue'
import type { MessageOptions, MessageInstance, MessageAPI, MessageType } from './type'

// 存储所有消息实例
const instances: MessageInstance[] = []

// 消息之间的垂直间距
const MESSAGE_GAP = 16

// 顶部初始偏移
const START_TOP = document.documentElement.clientHeight / 2
// 当前z-index基础值
let zIndex = 2000

// 递增ID计数器
let seed = 1

/**
 * 生成唯一ID
 */
const generateId = (): string => {
  return `biz_message_${Date.now()}_${seed++}`
}

/**
 * 获取新的z-index值
 */
const getNextZIndex = (): number => {
  return zIndex++
}

/**
 * 更新所有消息实例的位置
 */
const updateInstancesPosition = () => {
  let position = START_TOP

  instances.forEach(instance => {
    const id = (instance as any).__id
    const el = document.getElementById(id)

    if (el) {
      el.style.top = `${position}px`
      position += el.offsetHeight + MESSAGE_GAP
    }
  })
}

/**
 * 从实例数组中移除指定实例
 */
const removeInstance = (instance: MessageInstance): void => {
  const idx = instances.indexOf(instance)
  if (idx !== -1) {
    instances.splice(idx, 1)
  }
  updateInstancesPosition()
}

/**
 * 创建一个消息实例
 */
export const createMessage = (options: MessageOptions): MessageInstance => {
  // 处理选项
  const id = options.id || generateId()
  const props = {
    modal: true,
    duration: 0,
    ...options,
    id,
    zIndex: getNextZIndex()
  }

  console.log('创建消息实例:', props)

  // 创建容器
  const container = document.createElement('div')
  container.id = `container-${id}`
  container.style.position = 'absolute'
  container.style.top = '0px'
  container.style.left = '0px'
  container.style.width = '100%'
  container.style.height = document.body.clientHeight + 'px'
  if (props.modal) {
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
  }
  //消息层在上
  container.style.zIndex = '3000'
  document.body.appendChild(container)

  // 预声明实例对象
  const instance: MessageInstance = {
    close: () => {},
    confirm: () => {},
    cancel: () => {}
  }

  // 创建应用实例
  const app = createApp(MessageComponent, {
    ...props,
    onClosed: () => {
      // 移除DOM
      app.unmount()
      if (document.body.contains(container)) {
        document.body.removeChild(container)
      }

      // 从实例数组中移除
      removeInstance(instance)

      // 如果有用户提供的回调，也执行它
      if (props.onClosed) {
        props.onClosed()
      }
    }
  })

  // 挂载应用
  const vm = app.mount(container) as ComponentPublicInstance

  // 更新实例方法
  instance.close = () => (vm as any).close()
  instance.confirm = () => (vm as any).confirm()
  instance.cancel = () => (vm as any).cancel()

  // 保存内部属性
  ;(instance as any).__id = id
  ;(instance as any).__type = options.type || 'info'

  // 添加到实例数组
  instances.push(instance)

  // 更新位置
  updateInstancesPosition()

  return instance
}

/**
 * 关闭所有消息
 */
export const closeAllMessages = () => {
  ;[...instances].forEach(instance => instance.close())
}

// 添加closeAll方法到createMessage函数上
;(createMessage as any).closeAll = closeAllMessages

/**
 * 创建基础消息API函数
 */
const message = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === 'string') {
    return createMessage({ message: options })
  }
  return createMessage(options)
}

// 创建成功消息
const success = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === 'string') {
    return createMessage({ message: options, type: 'success' })
  }
  return createMessage({ ...options, type: 'success' })
}

// 创建错误消息
const error = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === 'string') {
    return createMessage({ message: options, type: 'error' })
  }
  return createMessage({ ...options, type: 'error' })
}

// 创建警告消息
const warning = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === 'string') {
    return createMessage({ message: options, type: 'warning' })
  }
  return createMessage({ ...options, type: 'warning' })
}

// 创建信息消息
const info = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === 'string') {
    return createMessage({ message: options, type: 'info' })
  }
  return createMessage({ ...options, type: 'info' })
}

// 确认弹窗成功使用提示信息
const confirmSuccess = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === 'string') {
    return createMessage({ message: options, type: 'success', showConfirm: false, duration: 2000, modal: false })
  }
  return createMessage({ ...options, type: 'success', showConfirm: false, duration: 2000, modal: false })
}

//确认弹窗取消使用提示信息
const confirmCancel = (options: MessageOptions | string): MessageInstance => {
  if (typeof options === 'string') {
    return createMessage({ message: options, type: 'info', showConfirm: false, duration: 2000, modal: false })
  }
  return createMessage({ ...options, type: 'info', showConfirm: false, duration: 2000, modal: false })
}

// 构建API对象
const BizMsg = message as MessageAPI
BizMsg.success = success
BizMsg.error = error
BizMsg.warning = warning
BizMsg.info = info
BizMsg.closeAll = closeAllMessages
BizMsg.confirmSuccess = confirmSuccess
BizMsg.confirmCancel = confirmCancel

// 插件安装函数
export const install = (app: App) => {
  app.config.globalProperties.$message = BizMsg
}

export { BizMsg }
export default BizMsg
