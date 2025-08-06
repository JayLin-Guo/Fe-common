<!-- Created by 337547038 on 2021/9/8. -->
<template>
  <draggable v-if="type === 5" itemKey="id" :list="dataList" name="fade" class="drag" v-bind="bindProps" @add="draggableAdd">
    <template #item="{ element, index }">
      <group-control :key="getGroupName(element, index)" :element="element" @group-click="groupClick" :active="activeKey">
        <div class="drag-control">
          <div class="item-control">
            <el-icon @click.stop="click('clone', index, element)" v-if="state.clone && element.type !== 'title'" title="克隆"
              ><CopyDocument
            /></el-icon>
            <el-icon @click.stop="click('gridAdd', index, element)" v-if="state.gridAdd" title="添加列">
              <Plus />
            </el-icon>
            <el-icon @click.stop="click('del', index, element)">
              <Delete />
            </el-icon>
          </div>
          <div class="drag-move icon-move" v-if="element.type !== 'title'">
            <el-icon><Rank /></el-icon>
          </div>
        </div>
      </group-control>
    </template>
  </draggable>
  <template v-else>
    <template v-for="(item, index) in dataList" :key="index">
      <group-control :element="item" />
    </template>
  </template>
</template>

<script setup>
import { reactive, computed, ref, watch, inject, onUnmounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import Draggable from 'vuedraggable-es'
import GroupControl from './groupControl.vue'
import { useDesignStore } from '@/piniaStore/modules/design'
import { constFormProps, getGroupName, jsonParseStringify } from '../utils/design'
import { Delete, Plus, Rank, CopyDocument } from '@element-plus/icons-vue'

const bindProps = {
  group: 'form',
  ghostClass: 'ghost',
  animation: 200,
  handle: '.drag-move'
}

const props = defineProps({
  data: {
    type: Array,
    default: () => {
      return []
    }
  },
  dataType: {
    type: String,
    default: () => {
      return 'not-nested'
    }
  }
})

const store = useDesignStore()
const formProps = inject(constFormProps, {})

const type = computed(() => {
  return formProps.value.type
})
const state = reactive({
  clone: true, // 允许clone
  gridAdd: false
})
const dataList = ref(props.data)
const unWatch = watch(
  () => props.data,
  v => {
    dataList.value = v
  },
  {
    deep: true,
    immediate: true
  }
)
const activeKey = computed(() => {
  return store.activeKey
})

// 不能嵌套
const notNested = type => {
  const controlType = ['grid', 'table', 'tabs', 'div', 'flex', 'card']
  return controlType.includes(type)
}
/**
 * 删除或复制
 * @param action
 * @param index
 * @param item
 */
const click = (action, index, item) => {
  if (type.value !== 5) {
    return // 非设计模式
  }
  if (action === 'clone') {
    const key = item.type + new Date().getTime().toString()
    const newItem = jsonParseStringify(item)
    dataList.value.splice(index, 0, Object.assign(newItem, { name: key }))
  } else if (action === 'del') {
    dataList.value.splice(index, 1)
    // 清空右侧栏信息
    store.setActiveKey('')
    store.setControlAttr({})
  } else if (action === 'gridAdd') {
    item.columns.push({
      list: [],
      attr: { span: 12 }
    })
  }
}

/**
 * 设计拖拽事件
 * 合并配置到根级的state.formData中
 * @param evt
 */
const draggableAdd = evt => {
  // console.log("Added item:", evt); // 被添加的项
  // console.log("New index:", evt.newIndex); // 新位置索引
  // console.log("New index:", evt.oldIndex); // 旧位置

  const newIndex = evt.newIndex
  const key = new Date().getTime().toString()
  const obj = dataList.value[newIndex]

  // 当字段为业务属性，默认存在name时，应该将源数据中的默认配置合并过来
  if (obj?.name) {
    store.controlList.forEach(child => {
      const childItem = child.children.find(item => item.name === obj.name)
      console.log(childItem, 'childItem')
    })
  }

  const isNested = evt.target && evt.target.getAttribute('data-type') // 不能嵌套
  if (isNested === 'not-nested' && notNested(obj.type)) {
    dataList.value.splice(newIndex, 1)
    return
  }
  if (!obj) {
    return
  }
  const label = obj.formItem?.label || obj.label
  delete obj.label
  delete obj.icon
  let objectItem = {}

  // 不需要添加item的项
  const notNeedItem = ['txt', 'title', 'button', 'table', 'grid', 'tabs', 'flex', 'div']
  if (!notNeedItem.includes(obj.type)) {
    objectItem = {
      formItem: {
        label: label
      }
    }
  }
  // 不需要name的组件
  let nameObj = {}
  const notNeedName = ['txt', 'title', 'button', 'grid', 'tabs', 'divider', 'div', 'card']
  if (!notNeedName.includes(obj.type) && !obj.name) {
    nameObj = {
      name: obj.type + key
    }
  }
  // console.log(obj, "obj");
  // console.log(nameObj, "nameObj");
  // console.log(objectItem, "objectItem");
  // table和flex添加了name后会执行onUnmounted事件，导致新拖拽的没办法默认选中
  Object.assign(obj, nameObj, objectItem)
  groupClick(obj)
}
/**
 * 点击激活当前
 * @param item
 * @param index
 */
const groupClick = (item, index) => {
  store.setActiveKey(getGroupName(item, index))
  store.setControlAttr(item)
  // grid时显示添加列按钮
  state.gridAdd = item.type === 'grid'
  state.clone = !notNested(item.type)
}
onBeforeRouteLeave(() => {
  unWatch() //销毁监听器
})
onUnmounted(() => {
  // console.log('onUnmounted')
  dataList.value = {}
  store.setActiveKey('')
  store.setControlAttr({})
})
</script>
<style lang="scss" scoped>
@use '@/components/BizDesignForm/design.scss';
</style>
