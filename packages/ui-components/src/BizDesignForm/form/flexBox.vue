<template>
  <div v-for="(item, index) in tableDataNew" :key="index" class="flex-group">
    <div class="flex-item">
      <template v-for="(list, i) in data.list" :key="i">
        <form-item :tProp="`${data.name}.${index}.${list.name}`" v-model="item[list.name]" :data="list" />
      </template>
    </div>
    <el-button
      class="flex-delete-btn"
      @click="deleteRow(index)"
      type="primary"
      link
      size="small"
      v-if="data.config?.delBtnText && [1, 2].includes(type)"
      >{{ data.config.delBtnText }}</el-button
    >
  </div>
  <el-form-item v-if="data.config?.addBtnText && [1, 2, 5].includes(type)">
    <el-button class="flex-add-btn" size="small" @click="addRow">{{ data.config.addBtnText }} </el-button>
  </el-form-item>
</template>

<script setup>
import { onMounted, inject, computed, nextTick } from 'vue'
import FormItem from './formItem.vue'
import { constFormProps } from '../utils/design'

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const formProps = inject(constFormProps, {})
const tableDataNew = computed(() => {
  return formProps.value.model[props.data.name]
})
const type = computed(() => {
  return formProps.value.type
})
const getRow = () => {
  const temp = {}
  props.data.list.forEach(item => {
    temp[item.name] = item.control.modelValue
  })
  //console.log(temp)
  return temp
}
const addRow = () => {
  tableDataNew.value.push(getRow())
}
const deleteRow = index => {
  tableDataNew.value.splice(index, 1)
}
const init = () => {
  if (tableDataNew.value?.length === 0) {
    tableDataNew.value.push(getRow())
  }
}
onMounted(() => {
  nextTick(() => {
    init()
  })
})
</script>
<style lang="scss" scoped>
@use '@/components/BizDesignForm/design.scss';
</style>
