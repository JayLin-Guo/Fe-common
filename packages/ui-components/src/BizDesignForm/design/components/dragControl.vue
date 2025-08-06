<template>
  <div class="components-list">
    <div v-if="isSearch && formDataList.length">
      <div class="title">快速选择表单字段</div>
      <div class="content">
        <el-checkbox v-for="item in formDataList" :key="item.name" @change="selectChange(item, $event)">
          {{ item.formItem?.label }}
        </el-checkbox>
      </div>
    </div>
    <div v-if="controlList.length === 0" style="text-align: center; padding-top: 120px; font-size: 14px; color: #d5d5d5">
      暂无字段配置, 待维护...
    </div>
    <div v-for="(list, index) in controlList" :key="index">
      <div class="title">
        {{ list.title }}
      </div>

      <draggable
        :itemKey="index + ''"
        tag="ul"
        v-model="list.children"
        :group="{ name: 'form', pull: 'clone', put: false }"
        ghost-class="ghost"
        :sort="false"
        :clone="clone">
        <template #item="{ element }">
          <li :class="[element.type]">
            <i :class="`icon-${element.icon}`"></i>
            <span :title="element.label">{{ element.label }}</span>
          </li>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
// import controlListData from './controlList'
import Draggable from 'vuedraggable-es'
import { computed, ref, watch, inject } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { jsonParseStringify } from '../../utils/design'
import { useDesignStore } from '@/piniaStore/modules/design'

const props = defineProps({
  formId: {
    type: [Number, String],
    default: undefined
  }
})

const designStore = useDesignStore()
const emits = defineEmits(['clickCheck', 'click'])

const designType = inject('formDesignType')
const formDataList = ref([])

const searchField = ['input', 'radio', 'checkbox', 'select', 'datePicker', 'timePicker', 'inputNumber', 'cascader', 'component', 'button']

const isSearch = computed(() => designType === 'search')

const controlList = computed(() => {
  if (designType === 'search') {
    const temp = []
    designStore.controlList.forEach(item => {
      if (item.children) {
        const filter = item.children.filter(ch => searchField.includes(ch.type))
        if (filter.length) {
          temp.push({ title: item.title, children: filter })
        }
      }
    })
    return temp
  } else {
    return designStore.controlList
  }
})

const clone = origin => jsonParseStringify(origin)

const unWatch = watch(
  () => props.formId,
  val => {
    if (val && isSearch.value) {
      getFormField(val)
    }
  }
)

const getFormField = formId => {
  // getRequest('designById', { id: formId }).then((res) => {
  //   const data = stringToObj(res.data.data)
  //   if (data && data.list) {
  //     forEachGetData(data.list)
  //   }
  // })
}

const selectChange = (obj, val) => {
  if (val) {
    const newObj = jsonParseStringify(obj)
    emits('clickCheck', newObj)
  }
}

const forEachGetData = data => {
  data.forEach(item => {
    if (item.type === 'grid' || item.type === 'tabs') {
      item.columns.forEach(col => forEachGetData(col.list))
    } else if (item.type === 'card') {
      forEachGetData(item.list)
    } else if (searchField.includes(item.type) && item.type !== 'button') {
      formDataList.value.push(item)
    }
  })
}

onBeforeRouteLeave(() => {
  unWatch()
})
</script>

<style lang="scss" scoped>
@use '@/components/BizDesignForm/design.scss';
</style>
