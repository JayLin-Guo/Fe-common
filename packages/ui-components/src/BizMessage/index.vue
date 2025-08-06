<template>
  <transition name="message-fade" @after-leave="handleAfterLeave">
    <div v-if="visible" class="biz-message-container cui-new-message-box" :class="[`message-${type}`, { 'with-modal': modal }, customClass]" :id="id">
      <div class="message-box">
        <div class="message-title">
          <span>{{ title }} </span>
          <i v-if="showClose" class="message-close-icon" @click="handleCancel">×</i>
        </div>

        <div class="message-content">
          <svg-icon :name="iconName" class="message-icon" :size="24" />
          <div class="message-text" v-if="dangerouslyUseHTMLString" v-html="message"></div>
          <div class="message-text" v-else>{{ message }}</div>
        </div>
        <div class="message-buttons">
          <button class="message-button cancel" v-if="showCancel" @click="handleCancel"> {{ cancelButtonText }}</button>
          <el-button type="primary" class="message-button confirm" v-if="showConfirm" @click="handleConfirm">
            {{ confirmButtonText }}
          </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'BizMessage'
})
import { ref, computed, onMounted } from 'vue'
import type { MessageType } from './type'
import SvgIcon from '../BizSvgIcon/index.vue'
import { iconMap } from '../BizSvgIcon/svgLoader'

const props = withDefaults(
  defineProps<{
    type: MessageType
    title: string
    message: string | HTMLElement
    duration: number
    showClose: boolean
    modal: boolean
    confirmButtonText: string
    cancelButtonText: string
    showCancel: boolean
    showConfirm: boolean
    customClass: string
    onConfirm?: () => void
    onCancel?: () => void
    onClosed?: () => void
    dangerouslyUseHTMLString: boolean
    id?: string
  }>(),
  {
    type: 'info',
    title: '系统提示',
    duration: 3000,
    showClose: true,
    modal: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    customClass: '',
    showCancel: false,
    showConfirm: true,
    dangerouslyUseHTMLString: false,
    id: ''
  }
)

const visible = ref(true)
const timer = ref<number | null>(null)

// 根据类型获取图标名称
const iconName = computed(() => {
  console.log('当前消息类型:', props.type)
  console.log('图标映射:', iconMap)
  console.log('使用的图标名称:', iconMap[props.type])
  return iconMap[props.type]
})

const handleConfirm = () => {
  if (props.onConfirm && props.showConfirm) {
    props.onConfirm()
  }
  close()
}

const handleCancel = () => {
  if (props.onCancel && props.showCancel) {
    props.onCancel()
  }
  close()
}

const close = () => {
  visible.value = false
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
}

const handleAfterLeave = () => {
  if (props.onClosed) {
    props.onClosed()
  }
}

onMounted(() => {
  if (props.duration > 0) {
    timer.value = window.setTimeout(() => {
      close()
    }, props.duration)
  }
})

defineExpose({
  close,
  confirm: handleConfirm,
  cancel: handleCancel
})
</script>

<style lang="scss" scoped>
.biz-message-container {
  position: fixed;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cui-new-message-box .message-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.cui-new-message-box .message-box {
  min-width: 410px;
  max-width: 410px;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  .message-title {
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 10px;
    font-size: 16px;
  }
}

.cui-new-message-box .message-content {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.cui-new-message-box .message-text {
  margin: 0 10px;
  font-size: 15px;
  line-height: 1.5;
  flex: 1;
}

.cui-new-message-box .message-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.cui-new-message-box .message-button {
  padding: 8px 15px;
  margin-left: 10px;
  border-radius: 2px;
  cursor: pointer;
  border: none;
}

.cui-new-message-box .message-button.confirm {
  background: linear-gradient(90deg, #ff6822, #ff922b) !important;
  color: white;
}

.cui-new-message-box .message-button.cancel {
  background-color: #f0f0f0;
  color: #606266;
}

// .message-success {
//   background-color: #f0f9eb;
//   border: 1px solid #e1f3d8;
//   color: #67c23a;
// }

// .message-error {
//   background-color: #fef0f0;
//   border: 1px solid #fde2e2;
//   color: #f56c6c;
// }

// .message-warning {
//   background-color: #fdf6ec;
//   border: 1px solid #faecd8;
//   color: #e6a23c;
// }

// .message-info {
//   background-color: #f4f4f5;
//   border: 1px solid #ebeef5;
//   color: #909399;
// }

.cui-new-message-box .message-close-icon {
  font-style: normal;
  cursor: pointer;
  margin-left: 10px;
  font-size: 22px;
  position: relative;
  top: -4px;
  color: #959595;
}

.cui-new-message-box .message-fade-enter-active,
.cui-new-message-box .message-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.cui-new-message-box .message-fade-enter-from,
.cui-new-message-box .message-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
