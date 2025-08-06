<!-- 标签页布局控件 - 支持多标签页内容 -->
<template>
  <div class="tabs-widget" @click="handleClick">
    <el-tabs
      v-model="activeTab"
      type="border-card"
      :class="element.config?.className"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="(tab, tabIndex) in element.columns"
        :key="`tab-${tabIndex}`"
        :label="tab.label"
        :name="`tab-${tabIndex}`"
      >
        <!-- 递归渲染标签页内容 -->
        <div class="tab-content">
          <component
            v-if="FormGroupComponent"
            :is="FormGroupComponent"
            :data="tab.list || []"
            :depth="depth + 1"
            :max-depth="maxDepth"
            data-type="not-nested"
          />

          <!-- 空标签页占位符 -->
          <div v-if="!tab.list?.length" class="empty-tab">
            <span v-if="!designMode">暂无内容</span>
            <span v-else>拖拽组件到此标签页</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 设计模式下的标签页操作 -->
    <div v-if="designMode" class="tabs-actions">
      <button type="button" @click.stop="addTab" class="action-btn">
        + 添加标签
      </button>
      <button
        type="button"
        @click.stop="removeTab"
        class="action-btn"
        :disabled="!canRemoveTab"
      >
        - 删除标签
      </button>
      <span class="container-label">标签页布局</span>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, defineAsyncComponent, ref, watch } from 'vue';

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

const emits = defineEmits(['group-click', 'update-element']);

// 当前激活的标签页
const activeTab = ref('tab-0');

// 通过inject获取FormGroup组件
const formGroupProvider = inject('FormGroup', null);
const FormGroupComponent = computed(() => {
  if (formGroupProvider?.component) {
    return defineAsyncComponent(formGroupProvider.component);
  }
  return null;
});

// 是否可以删除标签
const canRemoveTab = computed(() => {
  return props.element.columns?.length > 1;
});

// 监听标签页变化，确保激活标签存在
watch(
  () => props.element.columns,
  newColumns => {
    if (newColumns && newColumns.length > 0) {
      const activeIndex = parseInt(activeTab.value.replace('tab-', ''));
      if (activeIndex >= newColumns.length) {
        activeTab.value = `tab-${newColumns.length - 1}`;
      }
    }
  },
  { deep: true }
);

// 事件处理
const handleClick = () => {
  if (props.designMode) {
    emits('group-click', props.element);
  }
};

const handleTabClick = tab => {
  console.log('切换标签页:', tab.name);
};

// 标签页操作
const addTab = () => {
  const newTab = {
    label: `Tab${props.element.columns.length + 1}`,
    list: [],
  };

  const updatedElement = {
    ...props.element,
    columns: [...(props.element.columns || []), newTab],
  };

  emits('update-element', updatedElement);
};

const removeTab = () => {
  if (!canRemoveTab.value) return;

  const updatedElement = {
    ...props.element,
    columns: props.element.columns.slice(0, -1),
  };

  emits('update-element', updatedElement);
};
</script>

<style scoped>
.tabs-widget {
  position: relative;
  margin-bottom: 16px;
}

.tab-content {
  min-height: 120px;
  padding: 16px 0;
}

.empty-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  color: #c0c4cc;
  font-size: 14px;
  border: 2px dashed #e4e7ed;
  border-radius: 4px;
  text-align: center;
  padding: 24px;
}

.tabs-actions {
  position: absolute;
  top: -2px;
  right: -2px;
  display: flex;
  align-items: center;
  gap: 8px;
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

.tabs-widget:hover .tabs-actions {
  opacity: 1;
  transform: translateY(0);
}

.action-btn {
  padding: 2px 6px;
  font-size: 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.container-label {
  color: #909399;
  font-weight: 500;
  margin-left: 8px;
}

/* Element Plus 标签页样式覆盖 */
:deep(.el-tabs--border-card) {
  border: 1px solid #e4e7ed;
}

:deep(.el-tabs--border-card .el-tabs__content) {
  padding: 15px;
}
</style>
