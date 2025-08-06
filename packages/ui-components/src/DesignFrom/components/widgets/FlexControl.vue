<!-- 弹性字段控件 - 支持动态添加行 -->
<template>
  <div class="flex-widget" @click="handleClick">
    <div class="flex-container">
      <!-- 弹性字段头部 -->
      <div class="flex-header">
        <span class="flex-title">弹性字段</span>
        <div v-if="designMode || !isReadonly" class="flex-header-actions">
          <button type="button" @click.stop="addRow" class="action-btn primary">
            {{ element.config?.addBtnText || '添加一行' }}
          </button>
        </div>
      </div>

      <!-- 弹性字段行列表 -->
      <div class="flex-rows">
        <div
          v-for="(row, rowIndex) in element.tableData"
          :key="`row-${rowIndex}`"
          class="flex-row"
        >
          <div class="row-content">
            <!-- 递归渲染字段模板 -->
            <component
              v-if="FormGroupComponent"
              :is="FormGroupComponent"
              :data="element.list || []"
              :depth="depth + 1"
              :max-depth="maxDepth"
              data-type="not-nested"
            />
          </div>

          <div class="row-actions" v-if="designMode || !isReadonly">
            <button
              type="button"
              @click.stop="removeRow(rowIndex)"
              class="action-btn danger"
            >
              删除
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!element.tableData?.length" class="empty-flex">
        <span v-if="!designMode">暂无数据</span>
        <div v-else class="empty-design">
          <p>弹性字段配置说明：</p>
          <ul>
            <li>拖拽组件到此处作为字段模板</li>
            <li>每行数据将重复使用此模板</li>
            <li>支持动态添加删除行</li>
          </ul>
          <!-- 字段模板区域 -->
          <div class="template-area">
            <h4>字段模板：</h4>
            <component
              v-if="FormGroupComponent"
              :is="FormGroupComponent"
              :data="element.list || []"
              :depth="depth + 1"
              :max-depth="maxDepth"
              data-type="not-nested"
            />
            <div v-if="!element.list?.length" class="empty-template">
              拖拽组件到此处设置字段模板
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 设计模式下的操作 -->
    <div v-if="designMode" class="flex-actions">
      <span class="container-label">弹性字段</span>
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
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['group-click', 'update-element']);

// 通过inject获取FormGroup组件
const formGroupProvider = inject('FormGroup', null);
const FormGroupComponent = computed(() => {
  if (formGroupProvider?.component) {
    return defineAsyncComponent(formGroupProvider.component);
  }
  return null;
});

// 是否只读
const isReadonly = computed(() => {
  return props.readonly || props.element.config?.readonly;
});

// 事件处理
const handleClick = () => {
  if (props.designMode) {
    emits('group-click', props.element);
  }
};

// 行操作
const addRow = () => {
  const newRow = {}; // 空行数据，实际使用时会根据字段模板生成

  const updatedElement = {
    ...props.element,
    tableData: [...(props.element.tableData || []), newRow],
  };

  emits('update-element', updatedElement);
};

const removeRow = index => {
  const updatedElement = {
    ...props.element,
    tableData: props.element.tableData.filter((_, i) => i !== index),
  };

  emits('update-element', updatedElement);
};
</script>

<style scoped>
.flex-widget {
  position: relative;
  margin-bottom: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: white;
}

.flex-container {
  padding: 16px;
}

.flex-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.flex-title {
  font-weight: 600;
  color: #303133;
  font-size: 16px;
}

.flex-header-actions {
  display: flex;
  gap: 8px;
}

.flex-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.flex-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background: #fafafa;
}

.row-content {
  flex: 1;
}

.row-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-btn.primary {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.action-btn.primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}

.action-btn.danger {
  background: #f56c6c;
  color: white;
  border-color: #f56c6c;
}

.action-btn.danger:hover {
  background: #f78989;
  border-color: #f78989;
}

.empty-flex {
  text-align: center;
  color: #c0c4cc;
  font-size: 14px;
  padding: 24px;
}

.empty-design {
  text-align: left;
  color: #606266;
}

.empty-design p {
  margin: 0 0 8px 0;
  font-weight: 600;
}

.empty-design ul {
  margin: 0 0 16px 20px;
  padding: 0;
}

.empty-design li {
  margin-bottom: 4px;
  font-size: 14px;
}

.template-area {
  border: 2px dashed #e4e7ed;
  border-radius: 4px;
  padding: 16px;
  margin-top: 16px;
}

.template-area h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
}

.empty-template {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  color: #c0c4cc;
  font-size: 14px;
  border: 2px dashed #e4e7ed;
  border-radius: 4px;
  background: #fafafa;
}

.flex-actions {
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

.flex-widget:hover .flex-actions {
  opacity: 1;
  transform: translateY(0);
}

.container-label {
  color: #909399;
  font-weight: 500;
}
</style>
