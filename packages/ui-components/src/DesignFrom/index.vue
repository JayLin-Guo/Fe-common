<script setup lang="ts">
import {
  onBeforeMount,
  provide,
  reactive,
  ref,
  computed,
  watch,
  watchEffect,
  PropType,
} from 'vue';
import { SchemaJson } from './types/designForm';
import DragControl from './components/dragControl.vue';
import HeadTools from './components/headTools.vue';
import FormControlAttr from './components/formControlAttr.vue';
import BizJsonEditor from '../BizJsonEditor/index.vue';
import Core from './FormCore.vue';
import { getGroupName } from './utils.js';
import {
  defaultComponentsConf,
  layoutComponentsConf,
} from './components/beseFormSchema';

defineOptions({ name: 'designFormIndex' });

interface SchemaConf {
  templateList: any[];
  filedSchema: SchemaJson[];
}

const props = defineProps({
  schemaConf: {
    type: Object as PropType<SchemaConf>,
    default: () => ({}),
  },
  customAttrConfig: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(['save', 'export', 'import']);

const pageLoading = ref(false);

const state = reactive({
  formData: {
    list: [],
    form: { size: 'default' },
    config: {},
  },
  editor: {},
  loading: false,
  formDataPreview: {},
  previewVisible: false,
  jsonVisible: false,
  designType: 'default',
  formDict: {},
  formOtherData: {
    source: '',
    formName: '未命名表单',
  },
  selectedElement: null as any, // 当前选中的元素
  activeKey: '', // 当前选中元素的标识
  selectedElementPath: null as (string | number)[] | null, // 当前选中的元素在 formData.list 中的路径
});

provide('formDesignType', state.designType);
provide('schemaConf', props.schemaConf);

// 处理工具栏按钮点击
const handleToolClick = (type: string) => {
  switch (type) {
    case 'delete':
      // 清空表单
      if (confirm('确定要清空所有字段吗？')) {
        state.formData.list = [];
        state.selectedElement = null;
      }
      break;

    case 'preview':
      // 预览表单
      state.previewVisible = !state.previewVisible;
      break;

    case 'json':
      // 预览表单
      state.jsonVisible = !state.jsonVisible;
      break;

    case 'save':
      console.log(state, 'state===>>>>');
      // 保存表单
      emits('save', {
        formData: state.formData,
        formOtherData: state.formOtherData,
      });
      break;

    case 'import':
      // 导入表单
      emits('import');
      break;

    case 'export':
      // 导出表单
      emits('export', {
        formData: state.formData,
        formOtherData: state.formOtherData,
      });
      break;
  }
};

const jsonData = ref('');
watch(
  () => state.formData,
  (newVal: any) => {
    jsonData.value = newVal;
  },
  { deep: true }
);

// 处理表单项点击（选中）
const handleItemClick = (item: any, index: number) => {
  console.log('🎯 选中元素:', item);
  console.log('📝 元素索引:', index);

  state.selectedElement = item;
  state.activeKey = getGroupName(item, index);
  // 添加路径追踪
  state.selectedElementPath = findElementPath(state.formData.list, item);

  console.log('🛤️ 计算出的路径:', state.selectedElementPath);
  console.log('🔑 激活键:', state.activeKey);
};

// 处理表单项删除
const handleItemDelete = (item: any, index: number) => {
  if (state.selectedElement === item) {
    state.selectedElement = null;
    state.activeKey = '';
    state.selectedElementPath = null;
  }
};

// 处理表单项克隆
const handleItemClone = (item: any, index: number) => {
  // 如果需要选中新克隆的元素
  state.selectedElement = item;
  state.activeKey = getGroupName(item, index);
  // 更新路径追踪
  state.selectedElementPath = findElementPath(state.formData.list, item);
};

/**
 * 深度递归查找元素在表单数据中的路径
 * @param {Array} list - 表单数据列表
 * @param {Object} targetElement - 目标元素
 * @param {Array} currentPath - 当前路径
 * @returns {Array|null} - 元素路径数组，如 [0, 'columns', 1, 'list', 2]
 */
const findElementPath = (
  list: any[],
  targetElement: any,
  currentPath: (string | number)[] = []
): (string | number)[] | null => {
  if (!Array.isArray(list)) return null;

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const itemPath = [...currentPath, i];

    // 直接匹配
    if (item === targetElement) {
      return itemPath;
    }

    // 检查嵌套结构
    // 1. 栅格布局 - columns[].list
    if (item.type === 'grid' && item.columns) {
      for (let colIndex = 0; colIndex < item.columns.length; colIndex++) {
        const column = item.columns[colIndex];
        if (column.list) {
          const nestedPath = findElementPath(column.list, targetElement, [
            ...itemPath,
            'columns',
            colIndex,
            'list',
          ]);
          if (nestedPath) return nestedPath;
        }
      }
    }

    // 2. 标签页 - columns[].list
    if (item.type === 'tabs' && item.columns) {
      for (let tabIndex = 0; tabIndex < item.columns.length; tabIndex++) {
        const tab = item.columns[tabIndex];
        if (tab.list) {
          const nestedPath = findElementPath(tab.list, targetElement, [
            ...itemPath,
            'columns',
            tabIndex,
            'list',
          ]);
          if (nestedPath) return nestedPath;
        }
      }
    }

    // 3. 卡片容器 - list
    if ((item.type === 'card' || item.type === 'div') && item.list) {
      const nestedPath = findElementPath(item.list, targetElement, [
        ...itemPath,
        'list',
      ]);
      if (nestedPath) return nestedPath;
    }

    // 4. 弹性容器 - list
    if (item.type === 'flex' && item.list) {
      const nestedPath = findElementPath(item.list, targetElement, [
        ...itemPath,
        'list',
      ]);
      if (nestedPath) return nestedPath;
    }
  }

  return null;
};

/**
 * 根据路径获取嵌套元素
 * @param {Object} formData - 表单数据
 * @param {Array} path - 元素路径
 * @returns {Object|null} - 目标元素
 */
const getElementByPath = (
  formData: any,
  path: (string | number)[]
): any | null => {
  if (!path || path.length === 0) return null;

  let current = formData.list;

  for (let i = 0; i < path.length; i++) {
    const key = path[i];

    if (Array.isArray(current)) {
      current = current[key as number];
    } else if (current && typeof current === 'object') {
      current = current[key as string];
    } else {
      return null;
    }

    if (current === undefined) return null;
  }

  return current;
};

/**
 * 根据路径更新嵌套元素
 * @param {Object} formData - 表单数据
 * @param {Array} path - 元素路径
 * @param {Object} updatedElement - 更新后的元素
 */
const updateElementByPath = (
  formData: any,
  path: (string | number)[],
  updatedElement: any
): boolean => {
  if (!path || path.length === 0) {
    return false;
  }

  let current = formData.list; // 从 formData.list 开始，不是 formData
  const lastKey = path[path.length - 1];
  const parentPath = path.slice(0, -1);

  // 导航到父级容器
  for (const key of parentPath) {
    if (Array.isArray(current)) {
      current = current[key as number];
    } else if (current && typeof current === 'object') {
      current = current[key as string];
    } else {
      return false;
    }

    if (current === undefined) {
      console.log('❌ 导航到 undefined');
      return false;
    }
  }

  // 更新目标元素
  if (Array.isArray(current)) {
    current.splice(lastKey as number, 1, updatedElement);

    return true;
  } else if (current && typeof current === 'object') {
    current[lastKey as string] = updatedElement;

    return true;
  }

  return false;
};

// 处理属性更新 - 重写支持嵌套更新
const handleUpdateElement = (updatedElement: any) => {
  // 如果有路径信息，使用路径更新
  if (state.selectedElementPath) {
    const success = updateElementByPath(
      state.formData,
      state.selectedElementPath,
      updatedElement
    );

    if (success) {
      state.selectedElement = updatedElement;
      return;
    } else {
      console.log('❌ 路径更新失败');
    }
  }

  const index = state.formData.list.findIndex(
    (item: any) => item === state.selectedElement
  );

  if (index !== -1) {
    (state.formData.list as any[]).splice(index, 1, updatedElement);
    state.selectedElement = updatedElement;
  } else {
    const newPath = findElementPath(state.formData.list, state.selectedElement);

    if (newPath) {
      state.selectedElementPath = newPath;
      const success = updateElementByPath(
        state.formData,
        newPath,
        updatedElement
      );
      if (success) {
        state.selectedElement = updatedElement;
      } else {
      }
    } else {
      console.warn('❌ 无法找到要更新的元素:', state.selectedElement);
    }
  }
};

const controlSchema = computed(() => {
  if (props.schemaConf.filedSchema) {
    return props.schemaConf.filedSchema.concat(layoutComponentsConf);
  }

  return defaultComponentsConf;
});

const initDesignFormData = async () => {
  pageLoading.value = true;
  try {
    // 初始化逻辑
  } catch (e) {
    console.error(e);
  } finally {
    pageLoading.value = false;
  }
};

watchEffect(async () => {
  initDesignFormData();
});

onBeforeMount(() => {
  initDesignFormData();
});
</script>

<template>
  <div class="design-container" v-loading="pageLoading">
    <div class="filed-container">
      <drag-control :controlSchema="controlSchema" />
    </div>

    <div class="main-body">
      <head-tools @click="handleToolClick" />
      <div class="main-form" v-loading="state.loading">
        <div class="empty-tips" v-if="state.formData.list.length === 0">
          从左侧拖拽来添加字段
        </div>
        <core
          :type="5"
          :data="state.formData"
          :active="state.activeKey"
          @item-click="handleItemClick"
          @item-delete="handleItemDelete"
          @item-clone="handleItemClone"
        />
      </div>
    </div>

    <div class="control-container">
      <form-control-attr
        :selected-element="state.selectedElement"
        @update-element="handleUpdateElement"
      />
    </div>
    <el-dialog v-model="state.jsonVisible" title="JSON" width="50%">
      <div
        class="json-container"
        style="width: 100%; height: 500px; overflow-y: scroll"
      >
        <BizJsonEditor v-model="jsonData" />
      </div>

      <template #footer>
        <el-button type="primary" @click="state.jsonVisible = false">
          关闭
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@use './styles/theme.scss' as *;

.design-container {
  display: flex;
  height: 100%;
  min-height: 500px;
  background: $gray-50;
  border-radius: $border-radius-md;
  overflow: hidden;
  box-shadow: $shadow-md;
  border: 1px solid $gray-200;

  .filed-container {
    width: 280px;
    background: $white;
    border-right: 1px solid $gray-200;
    position: relative;
  }

  .main-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: $gray-50;
    position: relative;
    min-height: 0;

    .main-form {
      flex: 1;
      margin: $spacing-sm $spacing-lg $spacing-lg $spacing-lg;
      background: $white;
      border-radius: $border-radius-md;
      box-shadow: $shadow;
      border: 1px solid $gray-200;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      min-height: 400px;
      padding: $spacing-lg;

      .empty-tips {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: $gray-600;
        font-size: $font-size-lg;
        font-weight: 500;
        pointer-events: none;
        z-index: 1;
        padding: $spacing-xxl;
        border: 2px dashed $gray-300;
        border-radius: $border-radius-lg;
        background: $gray-50;

        &::before {
          content: '✨';
          display: block;
          font-size: 36px;
          margin-bottom: $spacing-sm;
          opacity: 0.6;
        }
      }
    }
  }

  .control-container {
    width: 300px;
    background: $white;
    border-left: 1px solid $gray-200;
    position: relative;
  }
}
</style>
