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
    console.log('Column clicked:', colIndex, col);
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

<style scoped>
.grid-widget {
  width: 100%;
  margin: 4px 0;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  background: #ffffff;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }

  /* 设计模式下的选中状态会由父组件的.active类控制 */
  .form-item-wrapper.active & {
    border-color: #ff6700;
    box-shadow: 0 0 0 1px #ff6700;
  }
}

.grid-container {
  width: 100%;
}

.form-row {
  width: 100%;
  margin: 0 !important;
}

.form-col {
  border-right: 1px solid #f1f5f9;
  min-height: 40px;

  &:last-child {
    border-right: none;
  }
}

.col-content {
  padding: 8px;
  min-height: 40px;
  position: relative;
}

.col-header {
  position: absolute;
  top: 2px;
  right: 4px;
  z-index: 5;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.grid-widget:hover .col-header {
  opacity: 1;
}

.col-label {
  background: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 2px;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.empty-column {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border: 1px dashed #e2e8f0;
  border-radius: 3px;
  background: #fafbfc;
  transition: all 0.2s ease;
  margin: 4px 0;

  &:hover {
    border-color: #ff6700;
    background: rgba(255, 103, 0, 0.02);
  }

  .empty-hint {
    color: #cbd5e1;
    font-size: 11px;
    text-align: center;
    font-weight: 400;
  }
}

.grid-actions {
  display: flex;
  gap: 6px;
  padding: 8px 12px;
  background: #fafbfc;
  border-top: 1px solid #f1f5f9;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 3px;
  background: white;
  color: #64748b;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;

    &:hover {
      border-color: #e2e8f0;
      background: white;
    }
  }

  span {
    font-weight: 500;
  }
}

.add-btn {
  &:hover {
    border-color: #ff6700;
    color: #ff6700;
    background: rgba(255, 103, 0, 0.03);
  }
}

.remove-btn {
  &:hover:not(:disabled) {
    border-color: #ef4444;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.03);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-col {
    border-right: none;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }
  }

  .col-content {
    padding: 8px;
    min-height: 60px;
  }

  .grid-actions {
    flex-direction: column;
    gap: 6px;
  }

  .action-btn {
    justify-content: center;
  }
}
</style>
