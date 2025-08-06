<!-- div容器控件 - 简单的div包裹容器 -->
<template>
  <div
    class="div-widget"
    :class="element.config?.className"
    :style="element.config?.style"
    @click="handleClick"
  >
    <div class="div-container">
      <!-- 递归渲染子组件 -->
      <component
        v-if="FormGroupComponent"
        :is="FormGroupComponent"
        :data="element.list || []"
        :depth="depth + 1"
        :max-depth="maxDepth"
        data-type="not-nested"
      />

      <!-- 空容器占位符 -->
      <div v-if="!element.list?.length" class="empty-container">
        <span v-if="!designMode">暂无内容</span>
        <span v-else>拖拽组件到此处</span>
      </div>
    </div>

    <!-- 设计模式下的容器操作 -->
    <div v-if="designMode" class="container-actions">
      <span class="container-label">DIV 容器</span>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, defineAsyncComponent } from 'vue';

const props = defineProps({
  element: {
    type: Object,
    required: true,
  },
  depth: {
    type: Number,
    default: 0,
  },
  maxDepth: {
    type: Number,
    default: 10,
  },
  designMode: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['group-click']);

// 通过inject获取FormGroup组件
const formGroupProvider = inject('FormGroup', null);
const FormGroupComponent = computed(() => {
  if (formGroupProvider?.component) {
    return defineAsyncComponent(formGroupProvider.component);
  }
  return null;
});

// 事件处理
const handleClick = () => {
  if (props.designMode) {
    emits('group-click', props.element);
  }
};
</script>

<style scoped>
.div-widget {
  position: relative;
  min-height: 60px;
  border: 1px dashed transparent;
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 4px;
}

.div-widget:hover {
  border-color: #c0c4cc;
  background-color: rgba(0, 0, 0, 0.02);
}

.div-container {
  min-height: 40px;
}

.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  color: #c0c4cc;
  font-size: 14px;
  border: 2px dashed #e4e7ed;
  border-radius: 4px;
  text-align: center;
  padding: 16px;
}

.container-actions {
  position: absolute;
  top: -2px;
  right: -2px;
  padding: 2px 6px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transform: translateY(-4px);
  transition: all 0.2s ease;
  z-index: 10;
}

.div-widget:hover .container-actions {
  opacity: 1;
  transform: translateY(0);
}

.container-label {
  color: #909399;
  font-weight: 500;
}
</style>
