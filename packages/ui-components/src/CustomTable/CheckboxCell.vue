<template>
  <div class="checkbox-cell">
    <label class="custom-checkbox">
      <input
        type="checkbox"
        class="checkbox-input"
        :checked="checked"
        :indeterminate="indeterminate"
        @change="handleChange"
        ref="checkboxRef" />
      <span class="checkbox-mark">
        <svg v-if="checked && !indeterminate" class="checkbox-icon" viewBox="0 0 16 16">
          <path
            d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
        </svg>
        <svg v-else-if="indeterminate" class="checkbox-icon indeterminate-icon" viewBox="0 0 16 16">
          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
        </svg>
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { CheckboxCellProps } from './types';

const props = withDefaults(defineProps<CheckboxCellProps>(), {
  checked: false,
  indeterminate: false
});

const emit = defineEmits<{
  change: [checked: boolean];
}>();

const checkboxRef = ref<HTMLInputElement>();

// 处理半选状态
watch(
  () => props.indeterminate,
  newVal => {
    if (checkboxRef.value) {
      checkboxRef.value.indeterminate = newVal;
    }
  },
  { immediate: true }
);

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('change', target.checked);
}
</script>

<style scoped>
.checkbox-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.custom-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
}

.checkbox-mark {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  background-color: #fff;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  box-sizing: border-box;
}

.checkbox-mark:hover {
  border-color: #409eff;
}

.checkbox-input:checked + .checkbox-mark {
  background-color: #409eff;
  border-color: #409eff;
}

.checkbox-input:indeterminate + .checkbox-mark {
  background-color: #409eff;
  border-color: #409eff;
}

.checkbox-input:focus + .checkbox-mark {
  outline: 2px solid #409eff40;
  outline-offset: 1px;
}

.checkbox-input:disabled + .checkbox-mark {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  cursor: not-allowed;
}

.checkbox-icon {
  width: 12px;
  height: 12px;
  fill: #fff;
  transition: all 0.2s ease;
  transform: scale(0);
}

.checkbox-input:checked + .checkbox-mark .checkbox-icon,
.checkbox-input:indeterminate + .checkbox-mark .checkbox-icon {
  transform: scale(1);
}

.indeterminate-icon {
  transform: scale(1);
}

/* 动画效果 */
.checkbox-mark::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background-color: #409eff;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: all 0.3s ease;
}

.checkbox-input:checked + .checkbox-mark::before,
.checkbox-input:indeterminate + .checkbox-mark::before {
  animation: checkbox-ripple 0.3s ease;
}

@keyframes checkbox-ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0.5;
  }
  50% {
    width: 20px;
    height: 20px;
    opacity: 0.2;
  }
  100% {
    width: 24px;
    height: 24px;
    opacity: 0;
  }
}

/* 大小变体 */
.checkbox-cell.size-small .checkbox-mark {
  width: 14px;
  height: 14px;
}

.checkbox-cell.size-small .checkbox-icon {
  width: 10px;
  height: 10px;
}

.checkbox-cell.size-large .checkbox-mark {
  width: 18px;
  height: 18px;
}

.checkbox-cell.size-large .checkbox-icon {
  width: 14px;
  height: 14px;
}
</style>
