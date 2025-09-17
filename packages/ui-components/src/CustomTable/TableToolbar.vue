<template>
  <div class="table-toolbar">
    <!-- 左侧：标题和描述信息 -->
    <div class="toolbar-left">
      <div v-if="title" class="toolbar-title">
        <h3>{{ title }}</h3>
      </div>
      <div v-if="description" class="toolbar-description">
        <span>{{ description }}</span>
      </div>
    </div>

    <!-- 中间：插槽区域，允许自定义内容 -->
    <div class="toolbar-center">
      <slot name="center" />
    </div>

    <!-- 右侧：工具区域 -->
    <div class="toolbar-right">
      <!-- 区域选择开关 -->
      <div v-if="showAreaSelectionToggle" class="toolbar-item">
        <span class="item-label">区域选择:</span>
        <el-switch
          :model-value="enableAreaSelection"
          @update:model-value="handleAreaSelectionChange"
          active-text="开启"
          inactive-text="关闭"
          :active-color="activeColor"
          :inactive-color="inactiveColor" />
      </div>

      <!-- 刷新按钮 -->
      <div v-if="showRefresh" class="toolbar-item">
        <el-tooltip content="刷新数据" placement="top">
          <el-button :icon="RefreshRight" circle size="small" @click="handleRefresh" :loading="refreshLoading" />
        </el-tooltip>
      </div>

      <!-- 设置按钮 -->
      <div v-if="showSettings" class="toolbar-item">
        <el-tooltip content="表格设置" placement="top">
          <el-button :icon="Setting" circle size="small" @click="handleSettings" />
        </el-tooltip>
      </div>

      <!-- 自定义右侧插槽 -->
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ElSwitch, ElButton, ElTooltip, ElIcon } from 'element-plus';
import { Document, User, RefreshRight, Setting } from '@element-plus/icons-vue';

export interface TableToolbarProps {
  // 基本信息
  title?: string;
  description?: string;
  totalRows?: number;

  // 功能开关
  showAreaSelectionToggle?: boolean;
  showTableInfo?: boolean;
  showSelectionInfo?: boolean;
  showRefresh?: boolean;
  showSettings?: boolean;

  // 状态数据
  enableAreaSelection?: boolean;
  selectedCount?: number;
  selectedAreaCount?: number;
  refreshLoading?: boolean;

  // 样式配置
  activeColor?: string;
  inactiveColor?: string;
}

const props = withDefaults(defineProps<TableToolbarProps>(), {
  totalRows: 0,
  showAreaSelectionToggle: true,
  showTableInfo: true,
  showSelectionInfo: true,
  showRefresh: false,
  showSettings: false,
  enableAreaSelection: false,
  selectedCount: 0,
  selectedAreaCount: 0,
  refreshLoading: false,
  activeColor: '#409eff',
  inactiveColor: '#dcdfe6'
});

export interface TableToolbarEmits {
  (e: 'update:enableAreaSelection', value: boolean): void;
  (e: 'refresh'): void;
  (e: 'settings'): void;
}

const emit = defineEmits<TableToolbarEmits>();

// 区域选择开关变化
function handleAreaSelectionChange(value: boolean) {
  emit('update:enableAreaSelection', value);
}

// 刷新按钮点击
function handleRefresh() {
  emit('refresh');
}

// 设置按钮点击
function handleSettings() {
  emit('settings');
}
</script>

<style scoped>
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px 6px 0 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.toolbar-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  line-height: 1.2;
}

.toolbar-description {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.toolbar-center {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.toolbar-item {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.item-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.table-info,
.selection-info {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
}

.info-icon {
  font-size: 14px;
  color: #909399;
}

.info-text {
  font-weight: 500;
}

.selection-info {
  background: #e1f3d8;
  color: #67c23a;
}

.selection-info .info-icon {
  color: #67c23a;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-center,
  .toolbar-right {
    justify-content: center;
  }

  .toolbar-right {
    flex-wrap: wrap;
    gap: 8px;
  }
}

/* 动画效果 */
.toolbar-item {
  transition: all 0.2s ease;
}

.toolbar-item:hover {
  transform: translateY(-1px);
}

.table-info,
.selection-info {
  transition: all 0.2s ease;
}

.table-info:hover,
.selection-info:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
