<template>
  <div class="biz-message-demo">
    <h1>BizMessage 组件示例</h1>

    <div class="demo-section">
      <h2>1. 基本使用</h2>
      <div class="button-group">
        <el-button @click="showBasicMessage">基础消息</el-button>
        <el-button type="success" @click="showSuccessMessage">成功消息</el-button>
        <el-button type="warning" @click="showWarningMessage">警告消息</el-button>
        <el-button type="danger" @click="showErrorMessage">错误消息</el-button>
        <el-button type="info" @click="showInfoMessage">信息消息</el-button>
      </div>
    </div>

    <div class="demo-section">
      <h2>2. 自定义选项</h2>
      <div class="button-group">
        <el-button @click="showWithCloseButton">显示关闭按钮</el-button>
        <el-button @click="showWithLongDuration">显示时间</el-button>
        <el-button @click="showWithoutAutoClose">不自动关闭</el-button>
        <el-button @click="showWithHtml">带HTML内容</el-button>
      </div>
    </div>

    <div class="demo-section">
      <h2>3. 模态消息</h2>
      <div class="button-group">
        <el-button type="primary" @click="showModalMessage">显示模态消息</el-button>
        <el-button type="primary" @click="showConfirmMessage">确认/取消消息</el-button>
        <el-button type="primary" @click="showCustomButtons">自定义按钮文案</el-button>
      </div>
    </div>

    <div class="demo-section">
      <h2>4. 多消息示例</h2>
      <div class="button-group">
        <el-button @click="showMultipleMessages">显示多条消息</el-button>
        <el-button type="danger" @click="closeAllMessages">关闭所有消息</el-button>
        <el-button type="danger" @click="handleConfirm">confirm提示成功取消</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BizMessage } from '@/components/BizMessage'
import { ElMessageBox } from 'element-plus'
// 1. 基本使用
const showBasicMessage = () => {
  BizMessage('这是一条基本消息')
}

const showSuccessMessage = () => {
  BizMessage.success('操作成功完成')
}

const showWarningMessage = () => {
  BizMessage.warning('警告：请注意此操作')
}

const showErrorMessage = () => {
  BizMessage.error('操作失败')
}

const showInfoMessage = () => {
  BizMessage.info('这是一条信息提示')
}

// 2. 自定义选项
const showWithCloseButton = () => {
  BizMessage({
    message: '点击右侧X可关闭此消息',
    showClose: true
  })
}

const showWithLongDuration = () => {
  BizMessage({
    message: '此消息将显示1秒钟',
    duration: 1000,
    modal: false
  })
}

const showWithoutAutoClose = () => {
  BizMessage({
    type: 'info',
    message: '此消息不会自动关闭，需要手动关闭',
    duration: 0,
    showClose: true
  })
}

const showWithHtml = () => {
  BizMessage({
    message: '<strong>加粗文本</strong> 和 <span style="color: red">彩色文本</span>',
    dangerouslyUseHTMLString: true
  })
}

// 3. 模态消息
const showModalMessage = () => {
  BizMessage({
    type: 'info',
    message: '这是一条带背景遮罩的模态消息',
    modal: true,
    showClose: true
  })
}

const showConfirmMessage = () => {
  BizMessage({
    type: 'warning',
    message: '您确定要执行此操作吗？',
    modal: true,
    showCancel: true,
    showConfirm: true,
    onConfirm: () => {
      BizMessage.success('您点击了确认按钮')
    },
    onCancel: () => {
      BizMessage.info('您取消了操作')
    }
  })
}

const showCustomButtons = () => {
  BizMessage({
    type: 'warning',
    message: '是否删除此记录？删除后不可恢复！',
    modal: true,
    showCancel: true,
    showConfirm: true,
    confirmButtonText: '确认删除',
    cancelButtonText: '我再想想',
    onConfirm: () => {
      BizMessage.success('记录已删除')
    },
    onCancel: () => {
      BizMessage.info('您取消了操作')
    }
  })
}

//

const handleConfirm = () => {
  BizMessage.confirmBox({
    message: '是否删除此记录？删除后不可恢复！',
    onConfirm: () => {
      BizMessage.confirmSuccess('删除成功')
    },
    onCancel: () => {
      BizMessage.confirmCancel('已取消')
    }
  })
  // ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning'
  // })
  //   .then(() => {
  //     BizMessage.confirmSuccess('删除成功')
  //   })
  //   .catch(() => {
  //     BizMessage.confirmCancel('已取消')
  //   })
}

// 4. 多消息示例
const showMultipleMessages = () => {
  BizMessage.info('第一条消息')

  setTimeout(() => {
    BizMessage.success('第二条消息')
  }, 300)

  setTimeout(() => {
    BizMessage.warning('第三条消息')
  }, 600)

  setTimeout(() => {
    BizMessage.error('第四条消息')
  }, 900)
}

const closeAllMessages = () => {
  BizMessage.closeAll()
}
</script>

<style lang="scss" scoped>
.biz-message-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
