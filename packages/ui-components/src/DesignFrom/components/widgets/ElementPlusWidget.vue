<template>
  <div class="element-widget" @click="handleClick">
    <!-- Element Plus 组件动态渲染 -->
    <div
      class="form-control"
      :class="{ 'has-label': hasLabel, 'vertical-layout': useVerticalLayout }"
    >
      <label v-if="hasLabel" class="control-label">
        {{ element.formItem.label }}
      </label>
      <div class="control-wrapper">
        <component
          :is="componentName"
          v-bind="componentProps"
          v-model="modelValue"
          :disabled="true"
          @input="handleInput"
          @change="handleChange"
        >
          <!-- 处理有选项的组件 -->
          <template v-if="hasOptions">
            <component
              :is="optionComponent"
              v-for="option in options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            >
              {{ option.label }}
            </component>
          </template>

          <!-- 处理按钮组件 -->
          <template v-if="componentName === 'el-button'">
            {{ componentProps.label || '按钮' }}
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  ELEMENT_COMPONENT_MAP,
  OPTION_COMPONENT_MAP,
  OPTION_COMPONENTS,
  COMPONENT_PROPS_CONFIG,
  DEFAULT_OPTIONS,
  FormComponentType,
} from '../../types/componentTypes';

interface Props {
  element: any;
  active?: string;
}

const props = defineProps<Props>();
const emits = defineEmits(['item-click', 'item-delete', 'item-clone']);

// 获取对应的 Element Plus 组件名
const componentName = computed(() => {
  return ELEMENT_COMPONENT_MAP[props.element.type] || 'div';
});

// 获取选项组件名
const optionComponent = computed(() => {
  return OPTION_COMPONENT_MAP[componentName.value];
});

// 判断是否有选项的组件
const hasOptions = computed(() => {
  return OPTION_COMPONENTS.includes(props.element.type as FormComponentType);
});

// 组件属性处理
const componentProps = computed(() => {
  const baseProps = { ...props.element.control };

  // 使用配置化的属性处理
  const propsHandler = COMPONENT_PROPS_CONFIG[props.element.type];
  return propsHandler ? propsHandler(baseProps) : baseProps;
});

// 获取选项数据
const options = computed(() => {
  if (!hasOptions.value) return [];

  // 如果配置中有选项，使用配置的选项
  if (props.element.options && props.element.options.length > 0) {
    return props.element.options;
  }

  // 使用默认选项配置
  return DEFAULT_OPTIONS[props.element.type] || [];
});

// 是否有标签
const hasLabel = computed(() => {
  return (
    props.element.formItem?.label && props.element.formItem.label.trim() !== ''
  );
});

// 是否使用垂直布局（标签在上，控件在下）
const useVerticalLayout = computed(() => {
  // 对于某些组件类型使用垂直布局
  const verticalTypes = [
    FormComponentType.TEXTAREA,
    FormComponentType.RADIO,
    FormComponentType.CHECKBOX,
  ];

  return (
    verticalTypes.includes(props.element.type as FormComponentType) ||
    (hasLabel.value && props.element.formItem.label.length > 8)
  );
});

// v-model 处理
const modelValue = ref(props.element.control?.modelValue);

watch(
  () => props.element.control?.modelValue,
  newVal => {
    modelValue.value = newVal;
  }
);

const handleInput = (value: any) => {
  modelValue.value = value;
  if (props.element.control) {
    props.element.control.modelValue = value;
  }
};

const handleChange = (value: any) => {
  handleInput(value);
};

// 点击事件处理
const handleClick = () => {
  emits('item-click', props.element);
};
</script>

<style lang="scss" scoped>
@use '../../styles/theme.scss' as *;

.element-widget {
  @include widget-base;
  padding: $spacing-xs;
  .form-control {
    display: flex;
    align-items: flex-start;
    gap: $spacing-xs;
    width: 100%;
    min-height: 32px;

    // 水平布局（默认）
    &.has-label:not(.vertical-layout) {
      align-items: center;

      .control-label {
        min-width: 70px;
        max-width: 90px;
        font-weight: 500;
        color: $gray-700;
        font-size: $font-size-sm;
        line-height: 1.4;
        flex-shrink: 0;
        word-break: break-all;
        text-align: left;
        padding-right: $spacing-xs;
      }

      .control-wrapper {
        flex: 1;
        min-width: 0;
      }
    }

    // 垂直布局
    &.vertical-layout {
      flex-direction: column;
      align-items: stretch;
      gap: 4px;

      .control-label {
        font-weight: 500;
        color: $gray-700;
        font-size: $font-size-sm;
        line-height: 1.4;
        margin-bottom: 2px;
      }

      .control-wrapper {
        width: 100%;
      }
    }

    // 无标签时
    &:not(.has-label) {
      .control-wrapper {
        width: 100%;
      }
    }
  }

  // 文本和标题组件样式
  span,
  h3 {
    display: block;
    min-height: 20px;
    font-size: $font-size-sm;
    line-height: 1.4;

    &:empty::before {
      content: attr(placeholder);
      color: $gray-400;
    }
  }

  h3 {
    font-size: $font-size-md;
    font-weight: 600;
    margin: 0;
    color: $gray-800;
  }

  // Element Plus 组件样式调整
  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-date-picker),
  :deep(.el-time-picker),
  :deep(.el-cascader),
  :deep(.el-tree-select) {
    width: 100%;

    .el-input__wrapper {
      min-height: 28px;
      padding: 4px 8px;
    }

    .el-input__inner {
      font-size: $font-size-sm;
      line-height: 1.4;
    }
  }

  :deep(.el-input-number) {
    width: 100%;

    .el-input__wrapper {
      min-height: 28px;
      padding: 4px 8px;
    }

    .el-input-number__decrease,
    .el-input-number__increase {
      width: 24px;
      height: 24px;
      line-height: 22px;
    }
  }

  :deep(.el-textarea) {
    .el-textarea__inner {
      font-size: $font-size-sm;
      line-height: 1.4;
      padding: 6px 8px;
      min-height: 60px;
    }
  }

  :deep(.el-radio-group),
  :deep(.el-checkbox-group) {
    display: flex;
    gap: 4px;

    .el-radio,
    .el-checkbox {
      margin: 0;
      height: auto;
      line-height: 1.4;

      .el-radio__label,
      .el-checkbox__label {
        font-size: $font-size-sm;
        padding-left: 6px;
      }
    }
  }

  :deep(.el-switch) {
    height: auto;
    line-height: 1.4;
  }

  :deep(.el-slider) {
    margin: 8px 0;
  }

  :deep(.el-rate) {
    height: auto;
    line-height: 1.4;
  }

  :deep(.el-color-picker) {
    height: auto;
  }

  :deep(.el-button) {
    height: 28px;
    padding: 4px 12px;
    font-size: $font-size-sm;

    &.el-button--small {
      height: 24px;
      padding: 2px 8px;
    }
  }
}
</style>
