<!-- 分割线控件 - 简单的分割线组件 -->
<template>
  <div class="divider-widget" @click="handleClick">
    <el-divider
      :class="element.config?.className"
      :direction="element.config?.direction || 'horizontal'"
      :border-style="element.config?.borderStyle || 'solid'"
    >
      <span v-if="element.config?.text">{{ element.config.text }}</span>
    </el-divider>

    <!-- 设计模式下的操作提示 -->
    <div v-if="designMode" class="divider-actions">
      <span class="container-label">分割线</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  element: {
    type: Object,
    required: true,
  },
  designMode: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['group-click']);

const handleClick = () => {
  if (props.designMode) {
    emits('group-click', props.element);
  }
};
</script>

<style scoped>
.divider-widget {
  position: relative;
  margin: 8px 0;
}

.divider-widget:hover {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
}

.divider-actions {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  padding: 2px 6px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 10;
}

.divider-widget:hover .divider-actions {
  opacity: 1;
}

.container-label {
  color: #909399;
  font-weight: 500;
}
</style>
