<!-- 输入框控件 - 独立组件，无循环依赖 -->
<template>
  <div class="input-widget" @click="handleClick">
    <div class="form-control">
      <label v-if="element.formItem?.label" class="control-label">
        {{ element.formItem.label }}：
      </label>
      <input
        v-model="inputValue"
        type="text"
        :placeholder="element.control?.placeholder || '请输入'"
        :disabled="designMode"
        :readonly="readonly"
        :required="element.formItem?.required"
        class="input-control"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  element: {
    type: Object,
    required: true,
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

const emits = defineEmits(['group-click', 'input', 'blur', 'focus']);

// 双向绑定值
const inputValue = ref(props.element.control?.modelValue || '');

// 监听元素变化
watch(
  () => props.element.control?.modelValue,
  newVal => {
    inputValue.value = newVal || '';
  }
);

// 事件处理
const handleClick = () => {
  if (props.designMode) {
    emits('group-click', props.element);
  }
};

const handleInput = event => {
  const value = event.target.value;
  inputValue.value = value;
  emits('input', value);
};

const handleBlur = event => {
  emits('blur', event);
};

const handleFocus = event => {
  emits('focus', event);
};
</script>

<style lang="scss" scoped>
@use '../../styles/theme.scss' as *;

.input-widget {
  padding: $spacing-xs;
  border-radius: $border-radius-sm;
  transition: all $transition-normal;

  /* 设计模式样式 */
  &:hover {
    background-color: $primary-ultra-light;
    cursor: pointer;
  }
}

.form-control {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  width: 100%;
}

.control-label {
  min-width: 80px;
  font-weight: 500;
  color: $gray-600;
  text-align: right;
  flex-shrink: 0;
}

.input-control {
  flex: 1;
  padding: $spacing-sm $spacing-md;
  border: 1px solid $gray-300;
  border-radius: $border-radius-sm;
  font-size: $font-size-md;
  outline: none;
  transition: border-color $transition-normal;
  background: $white;

  &:focus {
    border-color: $primary-color;
    box-shadow: 0 0 0 1px $primary-color;
  }

  &:hover {
    border-color: $gray-400;
  }

  &:disabled {
    background-color: $gray-100;
    color: $gray-400;
    cursor: not-allowed;
  }

  &[readonly] {
    background-color: $gray-50;
    cursor: default;
  }

  &::placeholder {
    color: $gray-400;
  }
}
</style>
