<!-- FallbackWidget - 处理未注册的控件类型 -->
<template>
  <div class="fallback-widget" @click="handleClick">
    <!-- 文本区域 -->
    <div v-if="element.type === 'textarea'" class="form-control">
      <label v-if="element.formItem?.label"
        >{{ element.formItem.label }}：</label
      >
      <textarea
        :placeholder="element.control?.placeholder || '请输入'"
        :disabled="designMode"
        class="textarea-control"
        rows="3"
      ></textarea>
    </div>

    <!-- 下拉选择 -->
    <div v-else-if="element.type === 'select'" class="form-control">
      <label v-if="element.formItem?.label"
        >{{ element.formItem.label }}：</label
      >
      <select :disabled="designMode" class="select-control">
        <option value="">{{ element.control?.placeholder || '请选择' }}</option>
        <option
          v-for="(option, index) in element.control?.options"
          :key="index"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- 单选框 -->
    <div v-else-if="element.type === 'radio'" class="form-control">
      <label v-if="element.formItem?.label"
        >{{ element.formItem.label }}：</label
      >
      <div class="radio-group">
        <label
          v-for="(option, index) in element.control?.options"
          :key="index"
          class="radio-item"
        >
          <input
            type="radio"
            :name="element.name"
            :value="option.value"
            :disabled="designMode"
          />
          {{ option.label }}
        </label>
      </div>
    </div>

    <!-- 复选框 -->
    <div v-else-if="element.type === 'checkbox'" class="form-control">
      <label v-if="element.formItem?.label"
        >{{ element.formItem.label }}：</label
      >
      <div class="checkbox-group">
        <label
          v-for="(option, index) in element.control?.options"
          :key="index"
          class="checkbox-item"
        >
          <input type="checkbox" :value="option.value" :disabled="designMode" />
          {{ option.label }}
        </label>
      </div>
    </div>

    <!-- 数字输入 -->
    <div v-else-if="element.type === 'number'" class="form-control">
      <label v-if="element.formItem?.label"
        >{{ element.formItem.label }}：</label
      >
      <input
        type="number"
        :placeholder="element.control?.placeholder || '请输入数字'"
        :disabled="designMode"
        class="input-control"
      />
    </div>

    <!-- 日期选择 -->
    <div v-else-if="element.type === 'date'" class="form-control">
      <label v-if="element.formItem?.label"
        >{{ element.formItem.label }}：</label
      >
      <input type="date" :disabled="designMode" class="input-control" />
    </div>

    <!-- 时间选择 -->
    <div v-else-if="element.type === 'time'" class="form-control">
      <label v-if="element.formItem?.label"
        >{{ element.formItem.label }}：</label
      >
      <input type="time" :disabled="designMode" class="input-control" />
    </div>

    <!-- 文件上传 -->
    <div v-else-if="element.type === 'file'" class="form-control">
      <label v-if="element.formItem?.label"
        >{{ element.formItem.label }}：</label
      >
      <input type="file" :disabled="designMode" class="input-control" />
    </div>

    <!-- 按钮 -->
    <div v-else-if="element.type === 'button'" class="form-control">
      <button
        :disabled="designMode"
        class="button-control"
        :class="element.control?.type || 'default'"
      >
        {{ element.control?.text || '按钮' }}
      </button>
    </div>

    <!-- 标题 -->
    <div v-else-if="element.type === 'title'" class="form-control">
      <h3 class="title-control">{{ element.control?.text || '标题' }}</h3>
    </div>

    <!-- 文本 -->
    <div v-else-if="element.type === 'txt'" class="form-control">
      <div class="text-control">{{ element.control?.text || '文本内容' }}</div>
    </div>

    <!-- 未知控件类型 -->
    <div v-else class="form-control">
      <label v-if="element.formItem?.label"
        >{{ element.formItem.label }}：</label
      >
      <div class="unknown-control">
        <span class="icon">⚠️</span>
        <span class="text">未知控件类型: {{ element.type }}</span>
        <small class="hint">可通过 WidgetFactory 注册该控件</small>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  element: {
    type: Object,
    required: true,
  },
  designMode: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['group-click']);

const handleClick = () => {
  if (props.designMode) {
    emits('group-click', props.element);
  }
};
</script>

<style scoped>
.fallback-widget {
  transition: all 0.2s ease;
}

.form-control {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.form-control label {
  min-width: 80px;
  font-weight: 500;
  color: #606266;
  text-align: right;
  flex-shrink: 0;
}

/* 输入框样式 */
.input-control,
.textarea-control,
.select-control {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.input-control:focus,
.textarea-control:focus,
.select-control:focus {
  border-color: #409eff;
}

.input-control:disabled,
.textarea-control:disabled,
.select-control:disabled {
  background-color: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
}

.textarea-control {
  resize: vertical;
  min-height: 60px;
}

/* 选项组样式 */
.radio-group,
.checkbox-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.radio-item,
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.radio-item input,
.checkbox-item input {
  margin: 0;
}

/* 按钮样式 */
.button-control {
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-control.primary {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.button-control.success {
  background: #67c23a;
  color: white;
  border-color: #67c23a;
}

.button-control.warning {
  background: #e6a23c;
  color: white;
  border-color: #e6a23c;
}

.button-control.danger {
  background: #f56c6c;
  color: white;
  border-color: #f56c6c;
}

.button-control:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 标题和文本样式 */
.title-control {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.text-control {
  color: #606266;
  line-height: 1.6;
}

/* 未知控件样式 */
.unknown-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  background: #fff5f5;
  border: 1px solid #fbc4c4;
  border-radius: 4px;
  color: #f56c6c;
  text-align: center;
}

.unknown-control .icon {
  font-size: 20px;
}

.unknown-control .text {
  font-weight: 500;
}

.unknown-control .hint {
  color: #909399;
  font-size: 12px;
}

/* 设计模式样式 */
.fallback-widget:hover {
  background-color: rgba(0, 0, 0, 0.02);
  cursor: pointer;
}
</style>
