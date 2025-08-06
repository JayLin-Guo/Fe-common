<template>
  <div class="group-control" @click="handleClick">
    <!-- 新架构：优先使用注册的组件（包括容器组件） -->
    <template v-if="hasWidget(element.type)">
      <component
        :is="getWidgetComponent(element.type)"
        :element="element"
        :depth="depth"
        :max-depth="maxDepth"
        :design-mode="isDesignMode"
        :active="active"
        @group-click="groupClick"
        @item-click="handleItemClick"
        @item-delete="handleItemDelete"
        @item-clone="handleItemClone"
      />
    </template>

    <!-- 容器组件：动态加载支持递归 -->
    <template v-else-if="isContainerWidget(element.type)">
      <component
        :is="getWidgetComponent(element.type)"
        :element="element"
        :depth="depth"
        :max-depth="maxDepth"
        :design-mode="isDesignMode"
        :active="active"
        @group-click="groupClick"
        @item-click="handleItemClick"
        @item-delete="handleItemDelete"
        @item-clone="handleItemClone"
      />
    </template>

    <!-- 简化的 Fallback 渲染：未注册的控件 -->
    <div v-else class="form-control">
      <FallbackWidget
        :element="element"
        :design-mode="isDesignMode"
        @group-click="groupClick"
      />
    </div>

    <slot></slot>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import { constFormProps } from '../utils';
import { getWidgetConfig, hasWidget, isContainerWidget } from './WidgetFactory';
import FallbackWidget from './widgets/FallbackWidget.vue';

const props = defineProps({
  element: {
    type: Object,
    required: true,
  },
  active: {
    type: String,
    default: '',
  },
  depth: {
    type: Number,
    default: 0,
  },
  maxDepth: {
    type: Number,
    default: 10,
  },
});

const emits = defineEmits([
  'group-click',
  'item-click',
  'item-delete',
  'item-clone',
]);

const formProps = inject(constFormProps, {});

// 是否为设计模式
const isDesignMode = computed(() => {
  return formProps.value?.type === 5;
});

// 获取控件组件
const getWidgetComponent = type => {
  const config = getWidgetConfig(type);
  return config?.component || null;
};

// 处理组点击
const groupClick = (element, index) => {
  emits('group-click', element, index);
};

const handleClick = () => {
  emits('group-click', props.element);
};

// 处理嵌套组件事件传递
const handleItemClick = (item, index) => {
  emits('item-click', item, index);
};

const handleItemDelete = (item, index) => {
  emits('item-delete', item, index);
};

const handleItemClone = (item, index) => {
  emits('item-clone', item, index);
};
</script>

<style scoped>
.group-control {
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
}

.form-control {
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    min-width: 80px;
    font-weight: 500;
    color: #606266;
  }
}

.input-control,
.textarea-control,
.select-control {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #409eff;
  }

  &:disabled {
    background-color: #f5f7fa;
    color: #c0c4cc;
    cursor: not-allowed;
  }
}

.textarea-control {
  resize: vertical;
  min-height: 60px;
}

.radio-group,
.checkbox-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.radio-item,
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;

  input {
    margin: 0;
  }
}

/* .button-control {
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
  cursor: pointer;

  &.primary {
    background: #409eff;
    color: white;
    border-color: #409eff;
  }

  &.success {
    background: #67c23a;
    color: white;
    border-color: #67c23a;
  }

  &.warning {
    background: #e6a23c;
    color: white;
    border-color: #e6a23c;
  }

  &.danger {
    background: #f56c6c;
    color: white;
    border-color: #f56c6c;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
} */

.title-control {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.text-control {
  color: #606266;
  line-height: 1.6;
}

.unknown-control {
  padding: 8px 12px;
  background: #f56c6c;
  color: white;
  border-radius: 4px;
  font-size: 12px;
}
</style>
