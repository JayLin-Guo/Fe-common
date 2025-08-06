<template>
  <el-upload
    class="upload-style"
    :action="uploadUrl"
    v-bind="control"
    :file-list="fileList"
    :name="control.file || 'file'"
    :disabled="disabled"
    :class="{ limit: control.limit <= fileList.length }"
    :on-error="uploadError"
    :on-success="uploadSuccess"
    :on-remove="uploadRemove"
  >
    <el-button type="primary" v-if="config?.btnText">{{ config?.btnText }}</el-button>
    <i class="icon-plus" v-else></i>
    <template #tip v-if="config?.tip">
      <div class="el-upload__tip">{{ config?.tip }}</div>
    </template>
  </el-upload>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  control: Object,
  disabled: Boolean,
  config: Object,
  modelValue: [String, Array]
})

const emits = defineEmits(['update:modelValue'])

const fileList = computed(() => {
  const imgVal = props.modelValue
  if (imgVal && typeof imgVal === 'string') {
    const temp = []
    imgVal.split(',').forEach((item) => {
      temp.push({
        name: item,
        url: item
      })
    })
    return temp
  }
  return imgVal || [] // 支持默认值为 array 的情况
})

const updateModel = (val) => {
  emits('update:modelValue', val)
}

const uploadError = (err, file, fileList) => {
  ElMessage.error(file.name + '上传失败')
  if (props.control.onError) {
    props.control.onError(err, file, fileList)
  }
}

const uploadSuccess = (response, uploadFile, uploadFiles) => {
  const oldList = []
  fileList.value.forEach((item) => {
    oldList.push(item.url)
  })
  oldList.push(response.path)
  updateModel(oldList.join(','))
  if (props.control.onSuccess) {
    props.control.onSuccess(response, uploadFile, uploadFiles)
  }
}

const uploadRemove = (uploadFile, uploadFiles) => {
  const oldList = []
  fileList.value.forEach((item) => {
    if (item.url !== uploadFile.url) {
      oldList.push(item.url)
    }
  })
  updateModel(oldList.join(','))
  if (props.control.onRemove) {
    props.control.onRemove(uploadFile, uploadFiles)
  }
  // 这里可以添加发送请求到服务器删除文件的逻辑
}
</script>

<style scoped>

</style>
