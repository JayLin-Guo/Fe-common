<template>
  <el-select
    v-bind="data.control"
    :disabled="disabled"
    v-model="value"
    :loading="state.loading"
    :remote-method="remoteMethod"
  >
    <el-option v-if="data.config?.addAll" value="" label="全部" />
    <el-option
      v-for="item in optionsList"
      :key="item.value"
      :label="item.label"
      :value="transformOption(item.value, data.config?.transformData)"
    />
  </el-select>
</template>

<script setup>
import { reactive, computed, watch, inject, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { constFormProps, constSetFormOptions, objectToArray } from '@/components/BizDesignForm/utils/design'

const props = defineProps({
  data: Object,
  modelValue: null,
  disabled: Boolean,
  transformOption: Function,
  options: {
    type: Array,
    default: () => []
  },
  type: String,
  remoteMethod: Function
})

const emits = defineEmits(['change', 'update:modelValue'])

const setOptionsList = ref()
const formProps = inject(constFormProps, {}) || {}
const optionsList = computed(() => {
  if (setOptionsList.value) {
    return setOptionsList.value
  }
  if (props.type === 'slot') {
    const dictVal = formProps.value.dict
    if (dictVal && props.data.config?.optionsType === 2) {
      const opt = dictVal[props.data.config?.optionsFun]
      if (opt !== undefined) {
        return objectToArray(opt)
      }
    }
    return props.data.options
  } else {
    return props.options
  }
})

const formOptions = inject(constSetFormOptions, {}) || {}
const unWatch1 = watch(
  () => formOptions.value,
  (val) => {
    const opt = val[props.data.name]
    if (val && opt !== undefined) {
      setOptionsList.value = objectToArray(opt)
    }
  }
)

const value = computed({
  get() {
    if (props.type === 'slot') {
      return formProps.value.model[props.data.name]
    } else {
      return props.modelValue
    }
  },
  set(newVal) {
    if (props.type === 'slot') {
      emits('change', newVal, props.data.name)
    } else {
      emits('update:modelValue', newVal)
    }
  }
})

const state = reactive({
  loading: false // 远程搜索加载状态
})

const unWatch2 = watch(
  () => props.data.options,
  () => {
    state.loading = false
  }
)

const isRemote = computed(() => {
  return !!(
    props.data.control?.remote &&
    props.data.control?.filterable &&
    props.data.config?.optionsType === 1 &&
    props.data.config?.optionsFun
  )
})

const remoteMethod = (name) => {
  if (isRemote.value) {
    state.loading = true
    const queryName = props.data.config?.queryName || 'name'
    if (props.remoteMethod) {
      props.remoteMethod({ [queryName]: name })
    }
    if (props.data.control.remoteMethod) {
      props.data.control.remoteMethod(name)
    }
  }
}

onBeforeRouteLeave(() => {
  unWatch1()
  unWatch2()
})
</script>
