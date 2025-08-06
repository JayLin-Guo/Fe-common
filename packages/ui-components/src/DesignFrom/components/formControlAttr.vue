<template>
  <div class="form-control-attr">
    <div class="attr-header">
      <h4>属性配置</h4>
      <div class="element-info" v-if="props.selectedElement">
        <span class="element-type">{{
          getElementTypeName(props.selectedElement.type)
        }}</span>
      </div>
    </div>

    <div class="attr-content" v-if="props.selectedElement">
      <!-- 属性配置内容 -->
      <div v-if="attrConfig">
        <!-- 动态渲染属性分组 -->
        <div
          v-for="group in attrConfig.groups"
          :key="group.title"
          class="attr-group"
        >
          <div class="group-title">{{ group.title }}</div>

          <!-- 动态渲染属性项 -->
          <div v-for="attr in group.attrs" :key="attr.key" class="attr-item">
            <label>{{ attr.label }}：</label>

            <!-- 文本输入 -->
            <input
              v-if="attr.type === 'input'"
              :value="getAttrValue(attr.key)"
              type="text"
              :placeholder="attr.placeholder"
              @input="setAttrValue(attr.key, $event.target.value)"
            />

            <!-- 多行文本 -->
            <textarea
              v-else-if="attr.type === 'textarea'"
              :value="getAttrValue(attr.key)"
              :placeholder="attr.placeholder"
              @input="setAttrValue(attr.key, $event.target.value)"
            ></textarea>

            <!-- 数字输入 -->
            <input
              v-else-if="attr.type === 'number'"
              :value="getAttrValue(attr.key)"
              type="number"
              :placeholder="attr.placeholder"
              @input="setAttrValue(attr.key, Number($event.target.value) || '')"
            />

            <!-- 下拉选择 -->
            <select
              v-else-if="attr.type === 'select'"
              :value="getAttrValue(attr.key)"
              @change="setAttrValue(attr.key, $event.target.value)"
            >
              <option
                v-for="option in attr.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>

            <!-- 复选框 -->
            <label v-else-if="attr.type === 'checkbox'" class="checkbox-label">
              <input
                type="checkbox"
                :checked="getAttrValue(attr.key)"
                @change="setAttrValue(attr.key, $event.target.checked)"
              />
              <span>{{ attr.label }}</span>
            </label>

            <!-- 选项配置器 -->
            <div v-else-if="attr.type === 'options'" class="options-config">
              <div
                v-for="(option, index) in getAttrValue(attr.key) || []"
                :key="index"
                class="option-item"
              >
                <input
                  v-model="option.label"
                  type="text"
                  placeholder="选项文本"
                  @input="updateElement"
                />
                <input
                  v-model="option.value"
                  type="text"
                  placeholder="选项值"
                  @input="updateElement"
                />
                <button type="button" @click="removeOption(attr.key, index)">
                  删除
                </button>
              </div>
              <button
                type="button"
                @click="addOption(attr.key)"
                class="add-option-btn"
              >
                添加选项
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 如果没有属性配置，显示基本信息 -->
      <div v-else class="basic-info">
        <div class="attr-group">
          <div class="group-title">组件信息</div>
          <div class="attr-item">
            <label>组件类型：</label>
            <span>{{ props.selectedElement?.type || '未知' }}</span>
          </div>
          <div class="no-config-tip">
            <p>该组件暂无可配置属性</p>
          </div>
        </div>
      </div>
    </div>

    <div class="attr-content" v-else>
      <div class="no-selection">
        <div class="no-selection-icon">⚙️</div>
        <div class="no-selection-text">请选择一个组件来编辑属性</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue';
import {
  getAttrConfig,
  getNestedValue,
  setNestedValue,
  initElementAttrs,
} from './attrConfig.js';

// 验证导入
if (!getAttrConfig) {
  console.error('getAttrConfig 导入失败');
}

const props = defineProps({
  selectedElement: {
    type: Object,
    default: null,
  },
  customAttrConfig: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(['update-element']);

const localElement = ref({});

// 获取当前元素的属性配置
const attrConfig = computed(() => {
  if (!props.selectedElement) return null;

  try {
    return getAttrConfig(props.selectedElement.type, props.customAttrConfig);
  } catch (error) {
    console.error('获取属性配置失败:', error);
    // 返回基础配置作为fallback
    return {
      groups: [
        {
          title: '基础属性',
          attrs: [
            {
              key: 'formItem.label',
              label: '标签',
              type: 'input',
              defaultValue: '',
              placeholder: '请输入标签',
            },
          ],
        },
      ],
    };
  }
});

// 组件类型名称映射
const elementTypeNames = {
  input: '输入框',
  textarea: '多行文本',
  select: '下拉选择',
  radio: '单选框',
  checkbox: '复选框',
  number: '数字输入',
  button: '按钮',
  title: '标题',
  txt: '文本',
  grid: '栅格',
  divider: '分割线',
  card: '卡片',
  tabs: '标签页',
  flex: '弹性字段',
  div: '容器',
};

// 获取元素类型显示名称
const getElementTypeName = type => {
  return elementTypeNames[type] || type;
};

// 监听选中元素的变化
watch(
  () => props.selectedElement,
  newElement => {
    if (newElement) {
      localElement.value = JSON.parse(JSON.stringify(newElement));

      // 初始化默认属性值
      try {
        initElementAttrs(
          localElement.value,
          newElement.type,
          props.customAttrConfig
        );
      } catch (error) {
        console.error('初始化属性失败:', error);
      }

      // 确保必要的属性存在
      if (!localElement.value.formItem) {
        localElement.value.formItem = {};
      }
      if (!localElement.value.control) {
        localElement.value.control = {};
      }
      if (!localElement.value.config) {
        localElement.value.config = {};
      }
    }
  },
  { immediate: true, deep: true }
);

// 获取属性值
const getAttrValue = path => {
  return getNestedValue(localElement.value, path);
};

// 设置属性值
const setAttrValue = (path, value) => {
  setNestedValue(localElement.value, path, value);
  updateElement();
};

// 更新元素
const updateElement = () => {
  emits('update-element', localElement.value);
};

// 添加选项
const addOption = path => {
  const options = getNestedValue(localElement.value, path) || [];
  options.push({
    label: '新选项',
    value: 'new_option_' + Date.now(),
  });
  setNestedValue(localElement.value, path, options);
  updateElement();
};

// 删除选项
const removeOption = (path, index) => {
  const options = getNestedValue(localElement.value, path) || [];
  options.splice(index, 1);
  setNestedValue(localElement.value, path, options);
  updateElement();
};
</script>

<style scoped>
.form-control-attr {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.attr-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;

  h4 {
    margin: 0;
    color: #374151;
    font-size: 16px;
    font-weight: 600;
  }
}

.element-info {
  margin-top: 4px;

  .element-type {
    display: inline-block;
    padding: 2px 8px;
    background: #3b82f6;
    color: white;
    font-size: 12px;
    border-radius: 12px;
    font-weight: 500;
  }
}

.attr-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.no-selection {
  text-align: center;
  color: #64748b;
  padding: 60px 20px;

  .no-selection-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .no-selection-text {
    font-size: 14px;
    color: #94a3b8;
  }
}

.attr-group {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.group-title {
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

.attr-item {
  margin-bottom: 12px;

  label {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
    color: #606266;
    font-weight: 500;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
    outline: none;

    &:focus {
      border-color: #409eff;
    }
  }

  input[type='checkbox'] {
    width: auto;
    margin-right: 6px;
  }
}

.options-config {
  .option-item {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;

    input {
      flex: 1;
    }

    button {
      padding: 6px 12px;
      background: #f56c6c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.add-option-btn {
  width: 100%;
  padding: 8px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: #2563eb;
  }
}

/* 复选框标签样式 */
.checkbox-label {
  display: flex !important;
  align-items: center;
  margin-bottom: 0 !important;
  cursor: pointer;

  input[type='checkbox'] {
    margin-right: 8px;
    margin-bottom: 0;
  }

  span {
    font-size: 14px;
    color: #374151;
  }
}

/* 多行文本框样式 */
textarea {
  min-height: 60px;
  resize: vertical;
  font-family: inherit;
}

/* 选项配置器样式优化 */
.options-config {
  .option-item {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;

    input {
      flex: 1;
      margin-bottom: 0;
    }

    button {
      padding: 4px 8px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;

      &:hover {
        background: #dc2626;
      }
    }
  }
}

/* 输入框和选择框的统一样式 */
input,
textarea,
select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
}

/* 数字输入框特殊样式 */
input[type='number'] {
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

/* 基本信息和无配置提示样式 */
.basic-info {
  .no-config-tip {
    padding: 16px;
    margin-top: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    text-align: center;

    p {
      margin: 0;
      color: #64748b;
      font-size: 14px;
    }
  }

  .attr-item span {
    color: #374151;
    font-weight: 500;
  }
}
</style>
