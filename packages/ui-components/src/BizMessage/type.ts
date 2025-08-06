export type MessageType = 'success' | 'error' | 'warning' | 'info'

export interface MessageOptions {
  type?: MessageType
  message: string | HTMLElement
  duration?: number
  showClose?: boolean
  modal?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
  showCancel?: boolean
  showConfirm?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  dangerouslyUseHTMLString?: boolean
  id?: string
  allowDuplicate?: boolean
  customClass?: string
  zIndex?: number
  onClosed?: () => void
}

export interface MessageInstance {
  close: () => void
  confirm: () => void
  cancel: () => void
}

export type MessageFunction = (options: MessageOptions | string) => MessageInstance

export interface MessageAPI {
  (options: MessageOptions | string): MessageInstance
  success: MessageFunction
  error: MessageFunction
  warning: MessageFunction
  info: MessageFunction
  confirmBox: MessageFunction
  confirmSuccess: MessageFunction
  confirmCancel: MessageFunction
  closeAll: () => void
}
