// useAceDrawer.ts
import { getDrawerContent, getDrawerTitle } from '@/hooks/aceTooptip'
import {
  json2string,
  objToStringify,
  string2json,
  stringToObj,
} from '../../utils/design'
import { ElMessage } from 'element-plus'

import { DrawerType, DrawerDirection } from './enum'


export function useAceDrawer(drawer, state) {
  const openDrawer = (params) => {
    const { type, direction, codeType, callback, content } = params

    let editData
    switch (type) {
      case DrawerType.EditCss:
        editData = state.formData.config?.style || ''
        break
      case DrawerType.EditDict:
        editData = json2string(state.formDict, true)
        break
      case DrawerType.BeforeFetch:
      case DrawerType.BeforeSubmit:
      case DrawerType.AfterFetch:
      case DrawerType.AfterSubmit:
      case DrawerType.Change:
        const beforeData = state.formData.events || {}
        editData = beforeData[type]
          ? objToStringify(beforeData[type], true)
          : getDrawerContent(type)
        break
      case DrawerType.OptionsParams:
      case DrawerType.OptionsResult:
        editData = content
          ? objToStringify(content, true)
          : getDrawerContent(type)
        break
      case DrawerType.CreateJson:
		console.log(content, 'content=>>>')
        editData = objToStringify(content, true)
        break
      default:
        editData = objToStringify(content, true)
    }

    drawer.direction = direction || DrawerDirection.LTR
    drawer.type = type
    drawer.codeType = codeType || ''
    drawer.title = (getDrawerTitle)[type]
    drawer.callback = callback
    drawer.content = editData
    drawer.visible = true
  }

  const closeDrawer = () => {
    drawer.visible = false
    drawer.type = ''
    drawer.title = ''
    drawer.codeType = ''
    drawer.callback = undefined
    drawer.content = ''
  }

  const dialogConfirm = (editVal) => {
    try {
      let newObj
      switch (drawer.codeType) {
        case 'json':
          newObj = string2json(editVal)
          break
        case 'css':
          newObj = editVal
          break
        default:
          newObj = stringToObj(editVal)
      }

      if (typeof drawer.callback === 'function') {
        drawer.callback(newObj)
      }

      switch (drawer.type) {
        case DrawerType.EditCss:
          if (!state.formData.config) {
            state.formData.config = {}
          }
          state.formData.config.style = newObj
          break
        case DrawerType.EditDict:
          state.formDict = newObj
          break
        case DrawerType.BeforeFetch:
        case DrawerType.BeforeSubmit:
        case DrawerType.AfterFetch:
        case DrawerType.AfterSubmit:
        case DrawerType.Change:
          if (!state.formData.events) {
            state.formData.events = {}
          }
          state.formData.events[drawer.type] = newObj
          break
        case DrawerType.CreateJson:


          state.formData = newObj
          break
      }
      closeDrawer()
    } catch (e) {
      ElMessage.error(e.message || '未知原因')
    }
  }

  return {
    openDrawer,
    closeDrawer,
    dialogConfirm,
  }
}
