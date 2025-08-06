<template>
  <div class="element-widget" @click="handleClick">
    <!-- Element Plus 组件动态渲染 -->

    <div class="form-control">
      <label v-if="element.formItem?.label" class="control-label">
        {{ element.formItem.label }}：
      </label>
      <component
        :is="componentName"
        v-bind="componentProps"
        v-model="modelValue"
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
  padding: $spacing-sm;
  .form-control {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    width: 100%;
    .control-label {
      min-width: 100px;
      font-weight: 500;
      color: $gray-600;
      text-align: right;
      flex-shrink: 0;
    }
  }
  &:hover {
    @include widget-hover;
  }

  // 文本和标题组件样式
  span,
  h3 {
    display: block;
    min-height: 20px;

    &:empty::before {
      content: attr(placeholder);
      color: $gray-400;
    }
  }

  h3 {
    font-size: $font-size-lg;
    font-weight: 600;
    margin: 0;
  }

  // Element Plus 组件样式调整
  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-date-picker) {
    width: 100%;
  }

  :deep(.el-radio-group),
  :deep(.el-checkbox-group) {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }
}
</style>
