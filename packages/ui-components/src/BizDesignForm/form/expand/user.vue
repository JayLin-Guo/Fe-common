<!-- Created by 337547038  -->
<template>
  <el-input placeholder="请选择用户或输入用户名称" v-bind="$props" v-model="value" @click="openDialog">
    <template #append>
      <i class="icon-user" @click.stop="openDialog"></i>
    </template>
  </el-input>
  <user-dialog ref="userDialogEl" v-model="value" />
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:modelValue'])
const userDialogEl = ref()
const value = computed({
  get() {
    return props.modelValue
  },
  set(newVal) {
    emits('update:modelValue', newVal)
  }
})
const openDialog = () => {
  userDialogEl.value.open()
}

onMounted(() => {
  nextTick(() => {})
})
</script>
<style lang="scss" scoped>
@use '@/components/BizDesignForm/design.scss';
</style>
