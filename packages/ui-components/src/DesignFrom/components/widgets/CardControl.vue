<!-- 卡片布局控件 - 支持添加删除内容 -->
<template>
  <div class="card-widget" @click="handleClick">
    <el-card
      class="card-container"
      :class="element.config?.className"
      :shadow="element.config?.shadow || 'hover'"
      :body-style="element.config?.bodyStyle"
    >
      <!-- 卡片头部 -->
      <template #header v-if="element.config?.title || designMode">
        <div class="card-header">
          <span class="card-title">
            {{ element.config?.title || '卡片标题' }}
          </span>
          <div v-if="designMode" class="card-header-actions">
            <button
              type="button"
              @click.stop="toggleCardContent"
              class="action-btn"
            >
              {{ showContent ? '收起' : '展开' }}
            </button>
          </div>
        </div>
      </template>

      <!-- 卡片内容 -->
      <div v-show="showContent" class="card-content">
        <!-- 递归渲染子组件 -->
        <component
          v-if="FormGroupComponent"
          :is="FormGroupComponent"
          :data="element.list || []"
          :depth="depth + 1"
          :max-depth="maxDepth"
          data-type="not-nested"
        />

        <!-- 空内容占位符 -->
        <div v-if="!element.list?.length" class="empty-card">
          <span v-if="!designMode">暂无内容</span>
          <span v-else>拖拽组件到此处</span>
        </div>
      </div>
    </el-card>

    <!-- 设计模式下的卡片操作 -->
    <div v-if="designMode" class="card-actions">
      <span class="container-label">卡片布局</span>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, defineAsyncComponent, ref } from 'vue';

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

// 卡片展开收起状态
const showContent = ref(true);

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

const toggleCardContent = () => {
  showContent.value = !showContent.value;
};
</script>

<style lang="scss" scoped>
@use '../../styles/theme.scss' as *;
.card-widget {
  margin: 8px 0;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  /* 设计模式下的选中状态会由父组件的.active类控制 */
  .form-item-wrapper.active & {
    .card-container {
      border-color: $primary-color;
      box-shadow: 0 0 0 1px $primary-color;
    }
  }
}

.card-container {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.card-toggle {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 12px;
  display: flex;
  align-items: center;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
}

.card-content {
  transition: all 0.3s ease;
  overflow: hidden;
}

.card-content.collapsed {
  max-height: 0;
  padding: 0 16px;
}

.card-content:not(.collapsed) {
  padding: 16px;
  min-height: 80px;
}

.empty-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  color: #9ca3af;
  font-size: 12px;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
  margin: 8px 0;
  transition: all 0.2s ease;

  &:hover {
    border-color: $primary-color;
    background: $primary-ultra-light;
    color: $primary-color;
  }
}

.card-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  &.toggle-btn:hover {
    border-color: $primary-color;
    color: $primary-color;
    background: $primary-lighter;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-header {
    padding: 10px 12px;
  }

  .card-content:not(.collapsed) {
    padding: 12px;
    min-height: 60px;
  }

  .card-actions {
    padding: 10px 12px;
    flex-direction: column;
    gap: 6px;
  }

  .action-btn {
    justify-content: center;
  }
}
</style>
