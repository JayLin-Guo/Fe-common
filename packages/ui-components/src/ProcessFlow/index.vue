<template>
  <div class="process-flow" :class="{ 'process-flow-vertical': vertical }">
    <div
      v-for="(step, index) in steps"
      :key="step.id || index"
      class="process-step"
      :class="{
        'step-active': getStepStatus(step) === 'active',
        'step-completed': getStepStatus(step) === 'completed',
        'step-error': getStepStatus(step) === 'error',
        'step-disabled': getStepStatus(step) === 'disabled',
        'step-pending': getStepStatus(step) === 'pending',
        'step-first': index === 0,
        'step-last': index === steps.length - 1,
      }"
      @click="handleStepClick(step, index)"
    >
      <!-- 箭头形状的步骤 -->
      <div class="step-arrow-shape">
        <!-- 边框层 -->
        <div class="step-border"></div>
        <!-- 内容层 -->
        <div class="step-content">
          <!-- 图标区域 -->
          <div class="step-icon">
            <template v-if="getStepIcon(step)">
              <Icon :icon="getStepIcon(step)" />
            </template>
            <template v-else-if="getStepStatus(step) === 'completed'">
              <Icon icon="carbon:checkmark" />
            </template>
            <template v-else-if="getStepStatus(step) === 'error'">
              <Icon icon="carbon:close" />
            </template>
            <template v-else>
              {{ index + 1 }}
            </template>
          </div>

          <!-- 文本区域 -->
          <div class="step-text">
            <div class="step-title" :title="getStepTitle(step)">
              {{ getStepTitle(step) }}
            </div>
            <div
              v-if="getStepDescription(step)"
              class="step-description"
              :title="getStepDescription(step)"
            >
              {{ getStepDescription(step) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import { Icon } from '@iconify/vue';

export interface ProcessStep {
  id?: string | number;
  title?: string;
  description?: string;
  status?: 'active' | 'completed' | 'error' | 'disabled' | 'pending';
  icon?: string;
  clickable?: boolean;
  [key: string]: any; // 允许任意字段
}

export interface FieldConfig {
  /** 标题字段名 */
  titleField?: string;
  /** 描述字段名 */
  descriptionField?: string;
  /** 状态字段名 */
  statusField?: string;
  /** 图标字段名 */
  iconField?: string;
  /** ID字段名 */
  idField?: string;
}

const props = defineProps<{
  steps: ProcessStep[];
  vertical?: boolean;
  clickable?: boolean;
  /** 字段配置 */
  fieldConfig?: FieldConfig;
}>();

const emits = defineEmits<{
  stepClick: [step: ProcessStep, index: number];
}>();

// 默认字段配置
const defaultFieldConfig: Required<FieldConfig> = {
  titleField: 'title',
  descriptionField: 'description',
  statusField: 'status',
  iconField: 'icon',
  idField: 'id',
};

// 获取实际的字段配置
const fieldConfig = computed(() => ({
  ...defaultFieldConfig,
  ...props.fieldConfig,
}));

// 获取步骤标题
const getStepTitle = (step: ProcessStep): string => {
  return step[fieldConfig.value.titleField] || '';
};

// 获取步骤描述
const getStepDescription = (step: ProcessStep): string => {
  return step[fieldConfig.value.descriptionField] || '';
};

// 获取步骤状态
const getStepStatus = (step: ProcessStep): ProcessStep['status'] => {
  return step[fieldConfig.value.statusField] || 'pending';
};

// 获取步骤图标
const getStepIcon = (step: ProcessStep): string => {
  return step[fieldConfig.value.iconField] || '';
};

// 获取步骤ID
const getStepId = (step: ProcessStep): string | number => {
  return step[fieldConfig.value.idField] || '';
};

const handleStepClick = (step: ProcessStep, index: number) => {
  const status = getStepStatus(step);

  if (step.clickable !== false && status !== 'disabled') {
    emits('stepClick', step, index);
  }
};
</script>

<style lang="scss" scoped>
.process-flow {
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  overflow-x: auto;
  padding: 20px 0;

  &.process-flow-vertical {
    flex-direction: column;
    align-items: stretch;
  }
}

.process-step {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 46px;
  margin-right: -20px; // 重叠部分

  &:last-child {
    margin-right: 0;
  }

  &:hover:not(.step-disabled) {
    transform: translateY(-2px);
    z-index: 10;
  }

  &.step-disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.step-arrow-shape {
  position: relative;
  min-width: 180px;
  height: 46px;
  z-index: 2;
}

// 边框层 - 创建箭头形状的边框
.step-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #3b82f6;

  // 标准箭头形状
  clip-path: polygon(
    0 0,
    calc(100% - 20px) 0,
    100% 50%,
    calc(100% - 20px) 100%,
    0 100%,
    20px 50%
  );

  // 第一个步骤 - 左边是直线
  .process-step.step-first & {
    clip-path: polygon(
      0 0,
      calc(100% - 20px) 0,
      100% 50%,
      calc(100% - 20px) 100%,
      0 100%
    );
  }

  // 最后一个步骤 - 右边是直线
  .process-step.step-last & {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 20px 50%);
  }

  // 只有一个步骤 - 矩形
  .process-step.step-first.step-last & {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }

  // 不同状态的边框颜色
  .process-step.step-error & {
    background: #dc2626;
  }

  .process-step.step-disabled & {
    background: #d1d5db;
  }
}

// 内容层 - 比边框小一点，创建边框效果
.step-content {
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 26px 0 16px;
  background: #ffffff;
  color: #3b82f6;
  transition: all 0.3s ease;

  // 标准箭头形状（内部）
  clip-path: polygon(
    0 0,
    calc(100% - 18px) 0,
    calc(100% - 2px) 50%,
    calc(100% - 18px) 100%,
    0 100%,
    18px 50%
  );

  // 第一个步骤
  .process-step.step-first & {
    padding-left: 16px;
    clip-path: polygon(
      0 0,
      calc(100% - 18px) 0,
      calc(100% - 2px) 50%,
      calc(100% - 18px) 100%,
      0 100%
    );
  }

  // 最后一个步骤
  .process-step.step-last & {
    padding-right: 16px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 18px 50%);
  }

  // 只有一个步骤
  .process-step.step-first.step-last & {
    padding: 0 16px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }

  // 选中状态 - 蓝色背景白色文字
  .process-step.step-active &,
  .process-step.step-completed & {
    background: #3b82f6;
    color: white;
    z-index: 5;

    .step-icon {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }

  // 错误状态 - 红色
  .process-step.step-error & {
    background: #dc2626;
    color: white;
    z-index: 5;

    .step-icon {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }

  // 禁用状态 - 灰色文字
  .process-step.step-disabled & {
    background: #ffffff;
    color: #9ca3af;

    .step-icon {
      background: #f3f4f6;
      color: #9ca3af;
    }
  }

  // 待处理状态 - 默认蓝色文字
  .process-step.step-pending & {
    background: #ffffff;
    color: #3b82f6;

    .step-icon {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }
  }
}

.step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  color: #3b82f6;
  flex-shrink: 0;
  transition: all 0.3s ease;

  .iconify {
    font-size: 14px;
  }
}

.step-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.step-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
}

.step-description {
  font-size: 11px;
  opacity: 0.8;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
}

// 垂直布局样式
.process-flow-vertical {
  .process-step {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 16px;
    margin-right: 0;
    height: auto;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .step-arrow-shape {
    height: auto;
  }

  .step-border {
    clip-path: none;
    border-radius: 8px;
  }

  .step-content {
    clip-path: none;
    border-radius: 6px;
    padding: 16px 20px;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .process-flow:not(.process-flow-vertical) {
    .step-arrow-shape {
      min-width: 120px;
    }

    .step-content {
      padding: 0 20px 0 12px;
      gap: 6px;
    }

    .process-step.step-first .step-content {
      padding-left: 12px;
    }

    .process-step.step-last .step-content {
      padding-right: 12px;
    }

    .step-title {
      font-size: 12px;
    }

    .step-description {
      font-size: 10px;
    }

    .step-icon {
      width: 24px;
      height: 24px;
      font-size: 11px;

      .iconify {
        font-size: 12px;
      }
    }
  }
}
</style>
