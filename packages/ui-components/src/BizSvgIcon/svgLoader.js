/**
 * SVG图标加载器
 * 将SVG文件转换为SVG sprite
 */

// 手动映射图标类型与文件名
const MESSAGE_ICONS = {
  success: 'message-success',
  error: 'message-error',
  warning: 'message-warning',
  info: 'message-info'
}

// 导入所有SVG图标
const importAllSvg = () => {
  try {
    // 使用Webpack的require.context自动导入
    const requireAll = requireContext => {
      const keys = requireContext.keys()
      return keys.map(requireContext)
    }
    const req = require.context('@/assets/svg', false, /\.svg$/)
    requireAll(req)
    // console.log('SVG图标加载成功', req.keys())
  } catch (error) {
    // console.error('SVG加载失败，错误详情:', error)
  }
}

// SVG Sprite插件
const createSvgSpritePlugin = {
  install(app) {
    // 导入所有SVG图标
    importAllSvg()
    // console.log('SVG Sprite加载器已安装')
    // console.log('图标映射:', MESSAGE_ICONS)

    // 在全局注入图标名称映射
    app.config.globalProperties.$iconMap = MESSAGE_ICONS
  }
}

export const iconMap = MESSAGE_ICONS
export default createSvgSpritePlugin
