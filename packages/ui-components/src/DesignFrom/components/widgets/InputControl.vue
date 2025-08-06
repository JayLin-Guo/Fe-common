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

<style scoped>
.input-widget {
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.form-control {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.control-label {
  min-width: 80px;
  font-weight: 500;
  color: #606266;
  text-align: right;
  flex-shrink: 0;
}

.input-control {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.input-control:focus {
  border-color: #409eff;
}

.input-control:disabled {
  background-color: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
}

.input-control[readonly] {
  background-color: #f9f9f9;
  cursor: default;
}

/* 设计模式样式 */
.input-widget:hover {
  background-color: rgba(0, 0, 0, 0.02);
  cursor: pointer;
}
</style>
