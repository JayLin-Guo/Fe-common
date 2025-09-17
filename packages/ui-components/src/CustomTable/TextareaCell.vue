<template>
  <div
    class="editable-textarea-cell"
    :class="{
      'is-editing': isEditing,
      'is-empty': !internalValue,
      'is-disabled': disabled
    }"
    @click="handleCellClick">
    <!-- 查看模式 -->
    <div v-if="!shouldShowEdit" class="cell-display">
      <div class="cell-text" v-if="internalValue" :title="internalValue">
        {{ internalValue }}
      </div>
      <div class="cell-placeholder" v-else>
        {{ placeholder || '点击编辑内容' }}
      </div>
      <div class="edit-indicator" v-if="!disabled && props.editMode === 'click'">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
      </div>
    </div>

    <!-- 编辑模式 -->
    <div v-if="shouldShowEdit" class="cell-edit">
      <textarea
        ref="textareaRef"
        v-model="internalValue"
        :placeholder="editPlaceholder || '请输入内容...'"
        :disabled="disabled"
        :rows="rows"
        :maxlength="maxlength"
        class="textarea-input"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @paste="handlePaste" />
      <div v-if="showCount && maxlength" class="textarea-count"> {{ internalValue.length }}/{{ maxlength }} </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import type { TextareaCellProps } from './types';

const props = withDefaults(
  defineProps<
    TextareaCellProps & {
      editMode?: 'click' | 'always' | 'never';
      editPlaceholder?: string;
      autoExitOnBlur?: boolean;
      autoExitOnEscape?: boolean;
      autoExitOnCtrlEnter?: boolean;
      maxHeight?: number | string;
      minHeight?: number | string;
    }
  >(),
  {
    modelValue: '',
    placeholder: '点击编辑内容',
    editPlaceholder: '请输入内容...',
    disabled: false,
    rows: 2,
    autoResize: true,
    showCount: false,
    maxlength: undefined,
    formatter: undefined,
    enablePasteFormatter: true,
    editMode: 'click',
    autoExitOnBlur: true,
    autoExitOnEscape: true,
    autoExitOnCtrlEnter: true,
    maxHeight: 80,
    minHeight: 32
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  input: [value: string, event: Event];
  change: [value: string, event: Event];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
  'edit-start': [];
  'edit-end': [];
}>();

const textareaRef = ref<HTMLTextAreaElement>();
const internalValue = ref(props.modelValue || '');
const isEditing = ref(props.editMode === 'always');

// 计算是否应该显示编辑模式
const shouldShowEdit = computed(() => {
  if (props.editMode === 'always') return true;
  if (props.editMode === 'never') return false;
  return isEditing.value;
});

// 监听外部值变化
watch(
  () => props.modelValue,
  newValue => {
    if (newValue !== internalValue.value) {
      internalValue.value = newValue || '';
      nextTick(() => {
        if (props.autoResize) {
          adjustHeight();
        }
      });
    }
  },
  { immediate: true }
);

// 自动调整高度
function adjustHeight() {
  if (!textareaRef.value || !props.autoResize) return;

  const textarea = textareaRef.value;
  textarea.style.height = 'auto';

  // 获取内容高度
  const scrollHeight = textarea.scrollHeight;

  // 处理最大高度和最小高度
  const maxHeight = typeof props.maxHeight === 'number' ? props.maxHeight : parseInt(props.maxHeight as string);
  const minHeight = typeof props.minHeight === 'number' ? props.minHeight : parseInt(props.minHeight as string);

  // 计算最终高度
  let finalHeight = scrollHeight;
  if (maxHeight && finalHeight > maxHeight) {
    finalHeight = maxHeight;
  }
  if (minHeight && finalHeight < minHeight) {
    finalHeight = minHeight;
  }

  textarea.style.height = `${finalHeight}px`;

  // 如果内容超过最大高度，显示滚动条
  if (scrollHeight > maxHeight) {
    textarea.style.overflowY = 'auto';
  } else {
    textarea.style.overflowY = 'hidden';
  }
}

// 格式化函数
function formatValue(value: string): string {
  if (props.formatter) {
    return props.formatter(value);
  }
  return value;
}

// 事件处理
function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  let newValue = target.value;

  // 如果有格式化函数，应用格式化
  if (props.formatter) {
    newValue = formatValue(newValue);
    // 如果值被格式化了，需要更新textarea的值
    if (newValue !== target.value) {
      target.value = newValue;
      // 保持光标位置
      const cursorPos = newValue.length;
      setTimeout(() => {
        target.setSelectionRange(cursorPos, cursorPos);
      }, 0);
    }
  }

  internalValue.value = newValue;
  emit('update:modelValue', internalValue.value);
  emit('input', internalValue.value, event);

  if (props.autoResize) {
    adjustHeight();
  }
}

function handleChange(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  emit('change', target.value, event);
}

function handleFocus(event: FocusEvent) {
  emit('focus', event);
}

function handleBlur(event: FocusEvent) {
  if (props.autoExitOnBlur && props.editMode === 'click') {
    // 延迟退出编辑模式，避免点击其他元素时立即退出
    setTimeout(() => {
      exitEditMode();
    }, 100);
  }
  emit('blur', event);
}

function handleKeydown(event: KeyboardEvent) {
  // ESC键退出编辑
  if (event.key === 'Escape' && props.autoExitOnEscape) {
    exitEditMode();
    event.preventDefault();
  }

  // Ctrl+Enter 或 Cmd+Enter 保存并退出编辑
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && props.autoExitOnCtrlEnter) {
    exitEditMode();
    event.preventDefault();
  }

  emit('keydown', event);
}

// 点击单元格进入编辑模式
function handleCellClick() {
  if (props.disabled || props.editMode !== 'click') return;

  if (!isEditing.value) {
    enterEditMode();
  }
}

// 进入编辑模式
function enterEditMode() {
  if (props.disabled) return;

  isEditing.value = true;
  emit('edit-start');

  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus();
      if (props.autoResize) {
        adjustHeight();
      }
    }
  });
}

// 退出编辑模式
function exitEditMode() {
  if (!isEditing.value) return;

  isEditing.value = false;
  emit('edit-end');
}

function handlePaste(event: ClipboardEvent) {
  if (!props.enablePasteFormatter || !props.formatter) {
    return; // 如果未启用粘贴格式化或没有格式化函数，使用默认行为
  }

  // 阻止默认粘贴行为
  event.preventDefault();

  // 获取粘贴的文本
  const pastedText = event.clipboardData?.getData('text') || '';

  // 应用格式化
  const formattedText = formatValue(pastedText);

  // 手动插入格式化后的文本
  const target = event.target as HTMLTextAreaElement;
  const start = target.selectionStart;
  const end = target.selectionEnd;
  const currentValue = target.value;

  // 构建新值
  const newValue = currentValue.substring(0, start) + formattedText + currentValue.substring(end);

  // 更新值
  target.value = newValue;
  internalValue.value = newValue;

  // 设置光标位置
  const newCursorPos = start + formattedText.length;
  target.setSelectionRange(newCursorPos, newCursorPos);

  // 触发事件
  emit('update:modelValue', internalValue.value);
  emit('input', internalValue.value, event);

  if (props.autoResize) {
    adjustHeight();
  }
}

// 组件挂载后调整高度
onMounted(() => {
  if (props.autoResize) {
    nextTick(() => {
      adjustHeight();

      textareaRef.value?.focus();
    });
  }
});

// 暴露方法
defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
  select: () => textareaRef.value?.select(),
  enterEditMode,
  exitEditMode,
  isEditing: () => isEditing.value
});
</script>

<style scoped>
.editable-textarea-cell {
  position: relative;
  width: 100%;
  min-height: 48px;
  max-height: 96px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.editable-textarea-cell:hover {
  background-color: rgba(64, 158, 255, 0.04);
}

.editable-textarea-cell.is-editing {
  cursor: text;
  background-color: transparent;
}

.editable-textarea-cell.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 查看模式样式 */
.cell-display {
  position: relative;
  /* padding: 8px 12px; */
  min-height: 32px;
  max-height: 80px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  box-sizing: border-box;
  overflow: hidden;
}

.cell-text {
  flex: 1;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
  color: #333;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.cell-placeholder {
  flex: 1;
  color: #c0c4cc;
  font-style: italic;
  line-height: 1.5;
}

.edit-indicator {
  opacity: 0;
  color: #409eff;
  margin-left: 8px;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.editable-textarea-cell:hover .edit-indicator {
  opacity: 1;
}

.editable-textarea-cell.is-empty:hover .cell-placeholder {
  color: #409eff;
}

/* 编辑模式样式 */
.cell-edit {
  position: relative;
  width: 100%;
  min-height: 32px;
  max-height: 80px;
  box-sizing: border-box;
}

.textarea-input {
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
  line-height: 1.5;
  background-color: #fff;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  resize: none;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  min-height: 32px;
  max-height: 80px;
  overflow-y: auto;
}

.textarea-input:hover {
  border-color: #c0c4cc;
  background-color: #fafafa;
}

.textarea-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
  background-color: #fff;
}

.textarea-input:disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}

.textarea-input::placeholder {
  color: #c0c4cc;
}

.textarea-count {
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-size: 12px;
  color: #909399;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0 4px;
  border-radius: 2px;
}
</style>
