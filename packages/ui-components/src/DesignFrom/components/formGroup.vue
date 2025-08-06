<!-- Created by 337547038 on 2021/9/8. -->
<template>
  <draggable
    v-if="type === 5"
    itemKey="id"
    :list="props.data"
    name="fade"
    class="drag"
    :class="{
      'drag-over': isDragOver,
      'drag-grid-nested': isGridNested,
    }"
    v-bind="bindProps"
    @add="draggableAdd"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @dragover="handleDragOver"
  >
    <template #item="{ element, index }">
      <div
        class="form-item-wrapper"
        :class="{ active: activeKey === getGroupName(element, index) }"
      >
        <!-- 拖拽控制 - 左上角 -->
        <div
          class="drag-control-move"
          v-if="type === 5 && element.type !== 'title'"
        >
          <div class="drag-move">
            <Icon icon="carbon:move" />
          </div>
        </div>

        <!-- 操作控制 - 右下角 -->
        <div class="drag-control-actions" v-if="type === 5">
          <div class="item-control">
            <span
              @click.stop="click('clone', index, element)"
              v-if="state.clone && element.type !== 'title'"
              title="克隆"
            >
              <Icon icon="carbon:copy" />
            </span>
            <span
              @click.stop="click('gridAdd', index, element)"
              v-if="state.gridAdd"
              title="添加列"
            >
              <Icon icon="carbon:add" />
            </span>
            <span @click.stop="click('del', index, element)" title="删除">
              <Icon icon="carbon:trash-can" />
            </span>
          </div>
        </div>

        <group-control
          :element="element"
          @group-click="groupClick"
          @item-click="(item, index) => emits('item-click', item, index)"
          @item-delete="(item, index) => emits('item-delete', item, index)"
          @item-clone="(item, index) => emits('item-clone', item, index)"
          :active="activeKey"
          :depth="depth"
          :max-depth="maxDepth"
        />
      </div>
    </template>
  </draggable>
  <template v-else>
    <template v-for="(item, index) in props.data" :key="index">
      <group-control :element="item" />
    </template>
  </template>
</template>

<script setup>
import {
  reactive,
  computed,
  ref,
  watch,
  inject,
  onUnmounted,
  provide,
  defineAsyncComponent,
} from 'vue';
import Draggable from 'vuedraggable-es';
import { constFormProps, getGroupName, jsonParseStringify } from '../utils.js';
import { isContainerWidget } from './WidgetFactory';
import { Icon } from '@iconify/vue';

// 异步加载GroupControl，避免循环依赖
const GroupControl = defineAsyncComponent(() => import('./groupControl.vue'));

// 防抖计时器
let dragDebounceTimer = null;
let lastDragPosition = null;

/**
 * 拖拽移动事件处理 - 边缘处理逻辑
 */
const handleDragMove = (evt, originalEvent) => {
  // 获取拖拽相关信息
  const { related, dragged, to, from } = evt;

  // 防止在边界附近的频繁抖动
  if (dragDebounceTimer) {
    clearTimeout(dragDebounceTimer);
  }

  // 计算当前拖拽位置
  const currentPosition = {
    x: originalEvent?.clientX || 0,
    y: originalEvent?.clientY || 0,
    toIndex: evt.newIndex || 0,
    fromIndex: evt.oldIndex || 0,
  };

  // 如果位置变化很小，使用防抖
  let deltaX = 0;
  let deltaY = 0;
  if (lastDragPosition) {
    deltaX = Math.abs(currentPosition.x - lastDragPosition.x);
    deltaY = Math.abs(currentPosition.y - lastDragPosition.y);

    // 如果移动距离很小且在边界附近，延迟处理
    if (deltaX < 5 && deltaY < 5) {
      return new Promise(resolve => {
        dragDebounceTimer = setTimeout(() => {
          resolve(true);
        }, 50);
      });
    }
  }

  lastDragPosition = currentPosition;

  // 边界检测 - 防止拖拽到不合适的位置
  if (related && to) {
    const toRect = to.getBoundingClientRect();
    const relatedRect = related.getBoundingClientRect();

    // 如果拖拽到了边界的很小区域内，阻止拖拽
    const edgeThreshold = 3; // 3px的边界阈值
    const mouseX = originalEvent?.clientX || 0;
    const mouseY = originalEvent?.clientY || 0;

    // 检查是否在边界的敏感区域
    const isNearLeftEdge = mouseX - relatedRect.left < edgeThreshold;
    const isNearRightEdge = relatedRect.right - mouseX < edgeThreshold;
    const isNearTopEdge = mouseY - relatedRect.top < edgeThreshold;
    const isNearBottomEdge = relatedRect.bottom - mouseY < edgeThreshold;

    // 如果在边界敏感区域，并且不是明确的拖拽意图，则阻止
    if (
      isNearLeftEdge ||
      isNearRightEdge ||
      isNearTopEdge ||
      isNearBottomEdge
    ) {
      // 检查拖拽方向和速度，如果是快速拖拽则允许
      const isIntentionalDrag = deltaX > 10 || deltaY > 10;
      if (!isIntentionalDrag) {
        return false; // 阻止拖拽
      }
    }
  }

  // 嵌套容器的特殊处理
  if (from !== to) {
    // 跨容器拖拽，检查目标容器是否合适
    const targetType = to.getAttribute('data-type');
    if (targetType === 'not-nested' && dragged) {
      const draggedType = dragged.getAttribute('data-type');
      if (notNested(draggedType)) {
        return false; // 阻止拖拽到不支持嵌套的容器
      }
    }
  }

  return true; // 允许拖拽
};

const bindProps = {
  group: 'form',
  ghostClass: 'ghost',
  animation: 200, // 适中的动画时间
  // 移除 handle 限制，允许从组件库拖拽
  // handle: '.drag-move',
  forceFallback: false,
  fallbackTolerance: 10, // 适中的容忍度
  scroll: true,
  scrollSensitivity: 100, // 降低滚动敏感度，减少抖动
  scrollSpeed: 10,
  bubbleScroll: true,
  dragoverBubble: false,
  preventOnFilter: false,
  delay: 0,
  delayOnTouchStart: false,
  touchStartThreshold: 10,
  // 边缘处理配置
  swapThreshold: 0.8, // 增加交换阈值，减少意外交换
  invertSwap: false, // 关闭反向交换
  emptyInsertThreshold: 20, // 空区域插入阈值
  dragoverBubble: false,
  removeCloneOnHide: false,
  // 添加 onMove 事件来控制拖拽行为
  onMove: handleDragMove,
};

const props = defineProps({
  data: {
    type: Array,
    default: () => {
      return [];
    },
  },
  dataType: {
    type: String,
    default: () => {
      return 'not-nested';
    },
  },
  depth: {
    type: Number,
    default: 0,
  },
  maxDepth: {
    type: Number,
    default: 10,
  },
  active: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(['item-click', 'item-delete', 'item-clone']);

const formProps = inject(constFormProps, {});

const type = computed(() => {
  return formProps.value?.type || 1;
});

const isGridNested = computed(() => {
  return formProps.value?.isGridNested || false;
});

// 提供FormGroup组件给子组件使用，解决递归依赖
provide('FormGroup', {
  component: () => import('./formGroup.vue'),
  render: (items, options = {}) => {
    // 递归渲染逻辑
    return {
      data: items,
      depth: (options.depth || 0) + 1,
      maxDepth: options.maxDepth || 10,
      type: type.value,
    };
  },
});

const state = reactive({
  clone: true, // 允许clone
  gridAdd: false,
});

// 直接使用 props.data 保持响应性，移除中间层

const activeKey = ref(props.active || '');
const isDragOver = ref(false);
const dragCounter = ref(0);

// 监听外部传入的 active 变化
watch(
  () => props.active,
  newActive => {
    activeKey.value = newActive || '';
  }
);

// 不能嵌套的控件类型 - 使用工厂方法
const notNested = type => {
  return isContainerWidget(type);
};

// 递归深度控制
const shouldStopRecursion = computed(() => {
  return props.depth >= props.maxDepth;
});

// 拖拽事件处理
const handleDragEnter = evt => {
  evt.preventDefault();
  dragCounter.value++;
  isDragOver.value = true;
};

const handleDragLeave = evt => {
  evt.preventDefault();
  dragCounter.value--;
  if (dragCounter.value === 0) {
    isDragOver.value = false;
  }
};

const handleDragOver = evt => {
  evt.preventDefault();
};

/**
 * 设计拖拽事件 - 优化为默认添加到最后
 */
const draggableAdd = evt => {
  console.log('draggableAdd', evt);
  isDragOver.value = false;
  dragCounter.value = 0;

  const newIndex = evt.newIndex;
  const key = new Date().getTime().toString();
  const obj = props.data[newIndex];

  const isNested = evt.target && evt.target.getAttribute('data-type');
  if (isNested === 'not-nested' && notNested(obj.type)) {
    props.data.splice(newIndex, 1);
    return;
  }

  if (!obj) {
    return;
  }

  // 默认添加到最后，除非是精确拖拽到某个组件附近
  // 这里简化逻辑，让大部分情况下都添加到最后
  const shouldAddToEnd = evt.from !== evt.to; // 来自不同容器（从组件库拖拽过来）

  if (shouldAddToEnd && props.data.length > 1) {
    // 移动到最后一个位置
    const item = props.data.splice(newIndex, 1)[0];
    props.data.push(item);
  }

  const label = obj.formItem?.label || obj.label;
  delete obj.label;
  delete obj.icon;

  let objectItem = {};

  // 不需要添加item的项
  const notNeedItem = [
    'txt',
    'title',
    'button',
    'table',
    'grid',
    'tabs',
    'flex',
    'div',
  ];

  if (!notNeedItem.includes(obj.type)) {
    objectItem = {
      formItem: {
        label: label,
      },
    };
  }

  // 不需要name的组件
  let nameObj = {};
  const notNeedName = [
    'txt',
    'title',
    'button',
    'grid',
    'tabs',
    'divider',
    'div',
    'card',
  ];

  if (!notNeedName.includes(obj.type) && !obj.name) {
    nameObj = {
      name: obj.type + key,
    };
  }

  Object.assign(obj, nameObj, objectItem);

  // 选中新添加的元素
  const finalIndex =
    shouldAddToEnd && props.data.length > 1 ? props.data.length - 1 : newIndex;
  groupClick(obj, finalIndex);
};

/**
 * 点击激活当前
 */
const groupClick = (item, index) => {
  // 只有顶层组件才更新自己的 activeKey，嵌套组件向上传递事件
  if (props.depth === 0) {
    activeKey.value = getGroupName(item, index);
    // grid时显示添加列按钮
    state.gridAdd = item.type === 'grid';
    state.clone = !notNested(item.type);
  }

  // 向上传递事件
  emits('item-click', item, index);
};

/**
 * 操作按钮点击
 */
const click = (action, index, element) => {
  switch (action) {
    case 'del':
      props.data.splice(index, 1);
      emits('item-delete', element, index);
      break;
    case 'clone':
      const clonedItem = jsonParseStringify(element);
      clonedItem.name = clonedItem.name + '_copy';
      props.data.splice(index + 1, 0, clonedItem);
      emits('item-clone', clonedItem, index + 1);
      break;
    case 'gridAdd':
      // 添加网格列的逻辑
      console.log('添加网格列');
      break;
  }
};

onUnmounted(() => {
  // 清理防抖计时器
  if (dragDebounceTimer) {
    clearTimeout(dragDebounceTimer);
    dragDebounceTimer = null;
  }
  lastDragPosition = null;
  console.log('formGroup组件卸载');
});
</script>

<style scoped>
.form-item-wrapper {
  position: relative;
  border: 1px solid transparent;
  margin-bottom: 8px;

  &.active {
    border-color: #ff6700;
    background-color: rgba(255, 103, 0, 0.02);
    box-shadow: 0 0 0 1px #ff6700;
  }

  /* 只有在非拖拽状态下才显示hover效果 */
  &:hover:not(.sortable-drag) {
    border: 1px solid #ff6700;
    background-color: rgba(249, 250, 251, 0.8);
  }
}

/* 拖拽控制 - 左上角 */
.drag-control-move {
  position: absolute;
  left: -1px;
  top: -1px;
  z-index: 10;
  display: none;

  .form-item-wrapper:hover &,
  .form-item-wrapper.active & {
    display: block;
  }
}

.drag-move {
  cursor: move;
  background: #ff6700;
  padding: 6px 8px;
  font-size: 14px;
  color: #fff;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    font-size: 14px;
  }
}

/* 操作控制 - 右下角 */
.drag-control-actions {
  position: absolute;
  right: -1px;
  bottom: -1px;
  z-index: 10;
  display: none;

  .form-item-wrapper:hover &,
  .form-item-wrapper.active & {
    display: flex;
    gap: 0;
  }
}

.item-control {
  display: flex;
  gap: 0;
  background: #ff6700;
  border: 1px solid #ff6700;
  border-radius: 6px 0 0 0;
  padding: 0;
  box-shadow: 0 2px 8px rgba(255, 103, 0, 0.2);
  overflow: hidden;

  span {
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 0;
    font-size: 14px;
    color: white;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 14px;
    height: 14px;
    background: #ff6700;
    border-right: 1px solid rgba(255, 255, 255, 0.2);

    &:last-child {
      border-right: none;
    }

    &:hover {
      background-color: #e55a00;
      color: white;
    }

    /* 删除按钮特殊样式 */
    &[title='删除']:hover {
      background-color: #dc2626;
    }

    /* 克隆按钮保持橙色 */
    &[title='克隆']:hover {
      background-color: #e55a00;
    }

    /* 添加列按钮保持橙色 */
    &[title='添加列']:hover {
      background-color: #e55a00;
    }

    .el-icon {
      font-size: 12px;
    }
  }
}

.drag {
  height: 100%;
  min-height: 400px;
  width: 100%;
  position: relative;
  padding: 16px;
  border: 2px dashed transparent;
  border-radius: 8px;
  /* 移除transition避免与拖拽动画冲突 */

  /* 空状态时显示虚线边框 */
  &:empty {
    border-color: #e5e7eb;
    border-style: dashed;
    background: linear-gradient(
      45deg,
      transparent 25%,
      rgba(249, 250, 251, 0.5) 25%,
      rgba(249, 250, 251, 0.5) 50%,
      transparent 50%,
      transparent 75%,
      rgba(249, 250, 251, 0.5) 75%
    );
    background-size: 20px 20px;
  }

  /* 拖拽悬停时的样式 */
  &.drag-over {
    height: auto;
    border-color: #ff6700;
    background-color: rgba(255, 103, 0, 0.02);

    &::before {
      background: rgba(255, 103, 0, 0.05);
      border-color: #ff6700;
      color: #ff6700;
    }
  }

  &.ghost {
    opacity: 0.4;
    transform: rotate(2deg);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  /* 拖拽开始时禁用所有transition */
  .sortable-drag * {
    transition: none !important;
  }

  /* 拖拽过程中的样式优化 */
  .sortable-chosen {
    transform: scale(1.02);
  }

  .sortable-fallback {
    background: rgba(255, 103, 0, 0.1);
    border: 2px solid #ff6700;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(255, 103, 0, 0.3);
  }

  /* 有内容时减少内边距 */
  &:not(:empty) {
    padding: 12px;
    min-height: 200px;
  }
}

/* 栅格内部的拖拽区域 - 减少高度和内边距 */
.drag-grid-nested {
  min-height: 35px !important;
  padding: 8px !important;

  /* 空状态时的样式优化 */
  &:empty::before {
    content: '拖拽组件到此处';
    font-size: 12px;
    padding: 16px;
    background: #fafbfc;
    border: 1px dashed #e2e8f0;
    border-radius: 4px;
  }

  /* 空状态时更简洁的背景 */
  &:empty {
    background: transparent;
    border-color: #f1f5f9;
  }

  /* 有内容时进一步减少高度 */
  &:not(:empty) {
    padding: 6px !important;
    min-height: 40px !important;
  }

  /* 拖拽悬停时的样式 */
  &.drag-over {
    border-color: #ff6700;
    background-color: rgba(255, 103, 0, 0.01);

    &::before {
      background: rgba(255, 103, 0, 0.03);
      border-color: #ff6700;
      color: #ff6700;
    }
  }
}

/* 拖拽ghost样式 - 减少抖动 */
.ghost {
  opacity: 0.6;
  background-color: rgba(255, 103, 0, 0.1);
  border: 2px dashed #ff6700;
  transform: rotate(1deg);
  transition: none !important; /* 避免动画导致的抖动 */
}

/* 拖拽相关的额外样式 */
.sortable-drag {
  opacity: 0.8;
  transform: scale(1.01);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 9999;
  transition: none !important; /* 避免过渡动画 */
}

.sortable-chosen {
  opacity: 0.9;
  transition: none !important;
}

.sortable-fallback {
  opacity: 0.7;
  background: rgba(255, 103, 0, 0.08);
  border: 1px solid #ff6700;
  transition: none !important;
}

/* 拖拽容器样式优化 */
.drag:not(.drag-grid-nested) {
  /* 为主拖拽区域添加平滑的边界处理 */
  border-radius: 8px;
  /* overflow: hidden; */
}

/* 减少嵌套拖拽的视觉干扰 */
.drag-grid-nested {
  .sortable-drag {
    transform: scale(0.98);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}
</style>
