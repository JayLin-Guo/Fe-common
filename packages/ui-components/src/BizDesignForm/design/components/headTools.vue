<!-- Created by weiXin:337547038 -->
<template>
  <div class="main-tools">
    <slot></slot>
    <div type="primary" @click="btnClick(item.icon)" v-for="item in btnList" :key="item.icon">
      <template v-if="item.icon === HeadToolAction.Delete">
        <el-icon><Delete /></el-icon>
      </template>
      <template v-if="item.icon === HeadToolAction.Preview">
        <el-icon><View /></el-icon>
      </template>
      <template v-if="item.icon === HeadToolAction.Save">
        <el-icon><EditPen /></el-icon>
      </template>
      <span>&nbsp;{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { HeadToolAction } from '../hooks/enum'
import { View, Delete, EditPen } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
// showKey,hideKey设置其中一个即可，showKey优先 设置了showKey时，hideKey无效
const props = defineProps({
  showKey: {
    type: Array,
    default: () => []
  },
  hideKey: {
    type: Array,
    default: () => []
  }
})
const emits = defineEmits(['click'])

const btnList = computed(() => {
  const list = [
    { icon: HeadToolAction.Delete, label: '清空', key: 1 },
    { icon: HeadToolAction.Preview, label: '预览', key: 2 },
    // { icon: HeadToolAction.GenerateJson, label: '生成脚本预览', key: 3 },
    // { icon: 'vue', label: '导出vue文件', key: 4 },
    { icon: HeadToolAction.Save, label: '保存', key: 5 }
  ]
  if (props.showKey?.length) {
    // 按照指定的key显示
    return list.filter(item => {
      return props.showKey.includes(item.key)
    })
  } else if (props.hideKey?.length) {
    // 按照指定的key隐藏
    return list.filter(item => {
      return !props.hideKey.includes(item.key)
    })
  } else {
    return list // 否则显示全部
  }
})
const btnClick = type => {
  emits('click', type)
}
</script>
<style lang="scss" scoped>
@use '@/components/BizDesignForm/design.scss';
</style>
