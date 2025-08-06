<!-- 网格容器控件 - 支持递归，无循环依赖 -->
<template>
  <div class="grid-widget" @click="handleClick">
    <div class="grid-container">
      <el-row class="form-row" :class="[element.config?.className]" :gutter="0">
        <el-col
          v-for="(col, colIndex) in element.columns"
          :key="`col-${colIndex}`"
          class="form-col"
          :class="{
            [col.className]: col.className,
          }"
          v-bind="col.attr"
          @click.stop="handleColumnClick(col, colIndex)"
        >
          <div class="col-content">
            <!-- 列标识 -->
            <div v-if="designMode" class="col-header">
              <span class="col-label">列 {{ colIndex + 1 }}</span>
            </div>

            <!-- 递归渲染子组件 - 获取FormGroup通过inject -->
            <component
              v-if="FormGroupComponent"
              :is="FormGroupComponent"
              :data="col.list || []"
              :depth="depth + 1"
              :max-depth="maxDepth"
              :active="active"
              data-type="not-nested"
              @item-click="handleNestedItemClick"
              @item-delete="handleNestedItemDelete"
              @item-clone="handleNestedItemClone"
            />
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 设计模式列操作 -->
    <div v-if="designMode" class="grid-actions">
      <button type="button" @click.stop="addColumn" class="action-btn add-btn">
        <Icon icon="carbon:add" />
        <span>添加列</span>
      </button>
      <button
        type="button"
        @click.stop="removeColumn"
        class="action-btn remove-btn"
        :disabled="!canRemoveColumn"
      >
        <Icon icon="carbon:subtract" />
        <span>删除列</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, defineAsyncComponent, provide } from 'vue';
import { Icon } from '@iconify/vue';
import { constFormProps } from '../../utils.js';

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
  active: {
    type: String,
    default: '',
  },
});

const emits = defineEmits([
  'group-click',
  'item-click',
  'item-delete',
  'item-clone',
]);

// 获取父级的 formProps
const parentFormProps = inject(constFormProps, {});

// 为栅格内部提供拖拽模式的 formProps，但添加特殊标识
provide(
  constFormProps,
  computed(() => ({
    ...parentFormProps.value,
    type: 5, // 保持拖拽模式，确保可以拖拽嵌套
    isGridNested: true, // 标识这是栅格内部的拖拽区域
  }))
);

// 通过inject获取FormGroup组件 - 正确处理异步组件
const FormGroupContext = inject('FormGroup');
const FormGroupComponent = FormGroupContext?.component
  ? defineAsyncComponent(FormGroupContext.component)
  : null;

// 确保有默认的columns结构
if (!props.element.columns || props.element.columns.length === 0) {
  props.element.columns = [
    { list: [], attr: { span: 12 } },
    { list: [], attr: { span: 12 } },
  ];
}

// 计算是否可以删除列
const canRemoveColumn = computed(() => {
  return props.element.columns && props.element.columns.length > 1;
});

// 添加列
const addColumn = () => {
  if (!props.element.columns) {
    props.element.columns = [];
  }

  // 重新计算span值，平均分配
  const columnCount = props.element.columns.length + 1;
  const spanPerColumn = Math.floor(24 / columnCount);

  // 更新现有列的span
  props.element.columns.forEach(col => {
    col.attr = { ...col.attr, span: spanPerColumn };
  });

  // 添加新列
  props.element.columns.push({
    list: [],
    attr: { span: spanPerColumn },
  });
};

// 删除列
const removeColumn = () => {
  if (props.element.columns && props.element.columns.length > 1) {
    props.element.columns.pop();

    // 重新计算span值
    const columnCount = props.element.columns.length;
    const spanPerColumn = Math.floor(24 / columnCount);

    props.element.columns.forEach(col => {
      col.attr = { ...col.attr, span: spanPerColumn };
    });
  }
};

// 处理点击事件
const handleClick = () => {
  if (props.designMode) {
    emits('group-click', props.element);
  }
};

// 处理列点击事件
const handleColumnClick = (col, colIndex) => {
  if (props.designMode) {
    // 列点击逻辑
  }
};

// 处理嵌套组件的事件传递
const handleNestedItemClick = (item, index) => {
  emits('item-click', item, index);
};

const handleNestedItemDelete = (item, index) => {
  emits('item-delete', item, index);
};

const handleNestedItemClone = (item, index) => {
  emits('item-clone', item, index);
};
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';
.grid-widget {
  @include form-item-wrapper;
  width: 100%;
  margin: $spacing-xs 0;
  overflow: hidden;
}

.grid-container {
  width: 100%;
}

.form-row {
  width: 100%;
  margin: 0 !important;
}

.form-col {
  border-right: 1px solid $gray-100;
  min-height: 40px;

  &:last-child {
    border-right: none;
  }
}

.col-content {
  padding: $spacing-sm;
  min-height: 40px;
  position: relative;
}

.col-header {
  position: absolute;
  top: 2px;
  right: $spacing-xs;
  z-index: 5;
  opacity: 0.7;
  transition: opacity $transition-normal;
}

.grid-widget:hover .col-header {
  opacity: 1;
}

.col-label {
  background: rgba($gray-400, 0.1);
  color: $gray-400;
  font-size: $font-size-xs;
  padding: 1px $spacing-xs;
  border-radius: $border-radius-sm;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.empty-column {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border: 1px dashed $gray-200;
  border-radius: $border-radius-sm;
  background: $gray-50;
  transition: all $transition-normal;
  margin: $spacing-xs 0;

  &:hover {
    border-color: $primary-color;
    background: $primary-ultra-light;
  }

  .empty-hint {
    color: $gray-300;
    font-size: $font-size-xs;
    text-align: center;
    font-weight: 400;
  }
}

.grid-actions {
  display: flex;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  background: $gray-50;
  border-top: 1px solid $gray-100;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-sm;
  border: 1px solid $gray-200;
  border-radius: $border-radius-sm;
  background: $white;
  color: $gray-600;
  font-size: $font-size-xs;
  cursor: pointer;
  transition: all $transition-normal;

  &:hover {
    border-color: $gray-300;
    background: $gray-50;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;

    &:hover {
      border-color: $gray-200;
      background: $white;
    }
  }

  span {
    font-weight: 500;
  }
}

.add-btn {
  &:hover {
    border-color: $primary-color;
    color: $primary-color;
    background: $primary-ultra-light;
  }
}

.remove-btn {
  &:hover:not(:disabled) {
    border-color: $danger-color;
    color: $danger-color;
    background: rgba($danger-color, 0.03);
  }
}
</style>
