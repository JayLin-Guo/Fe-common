<script setup lang="ts">
import {
  onBeforeMount,
  provide,
  reactive,
  ref,
  watch,
  watchEffect,
  PropType,
} from 'vue';
import { SchemaJson } from './types/designForm';
import DragControl from './components/dragControl.vue';
import HeadTools from './components/headTools.vue';
import FormControlAttr from './components/formControlAttr.vue';
import Core from './FormCore.vue';
import { getGroupName } from './utils.js';

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
  designType: 'default',
  formDict: {},
  formOtherData: {
    source: '',
    formName: '未命名表单',
  },
  selectedElement: null as any, // 当前选中的元素
  activeKey: '', // 当前选中元素的标识
});

provide('formDesignType', state.designType);
provide('schemaConf', props.schemaConf);

// 处理工具栏按钮点击
const handleToolClick = (type: string) => {
  console.log('工具栏点击:', type);

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
      console.log('切换预览模式:', state.previewVisible);
      break;

    case 'save':
      // 保存表单
      emits('save', {
        formData: state.formData,
        formOtherData: state.formOtherData,
      });
      console.log(state, 'state==>');
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

// 处理表单项点击（选中）
const handleItemClick = (item: any, index: number) => {
  console.log('选中元素:', item, index);
  state.selectedElement = item;
  state.activeKey = getGroupName(item, index);
};

// 处理表单项删除
const handleItemDelete = (item: any, index: number) => {
  console.log('删除元素:', item, index);
  if (state.selectedElement === item) {
    state.selectedElement = null;
    state.activeKey = '';
  }
};

// 处理表单项克隆
const handleItemClone = (item: any, index: number) => {
  console.log('克隆元素:', item, index);
  // 如果需要选中新克隆的元素
  state.selectedElement = item;
  state.activeKey = getGroupName(item, index);
};

// 处理属性更新
const handleUpdateElement = (updatedElement: any) => {
  console.log('更新元素属性:', updatedElement);

  // 在 formData.list 中找到对应的元素并更新
  const index = state.formData.list.findIndex(
    (item: any) => item === state.selectedElement
  );
  if (index !== -1) {
    (state.formData.list as any[]).splice(index, 1, updatedElement);
    state.selectedElement = updatedElement;
  }
};

const initDesignFormData = async () => {
  pageLoading.value = true;
  try {
    // 初始化逻辑
    console.log('初始化表单设计器');
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
      <drag-control :controlSchema="schemaConf.filedSchema" />
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
  </div>
</template>

<style lang="scss" scoped>
.design-container {
  display: flex;
  height: 100%;
  min-height: 500px; /* 减少最小高度 */
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;

  .filed-container {
    width: 280px;
    background: #ffffff;
    border-right: 1px solid #e2e8f0;
    position: relative;
  }

  .main-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    position: relative;
    min-height: 0; /* 关键：允许flex子项收缩 */

    .main-form {
      flex: 1;
      margin: 8px 16px 16px 16px; /* 减少上边距，为头部工具栏节省空间 */
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
      overflow-y: auto; /* 允许垂直滚动 */
      overflow-x: hidden; /* 隐藏水平滚动 */
      position: relative;
      min-height: 400px; /* 减少最小高度 */
      padding: 16px; /* 减少内边距 */

      .empty-tips {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #64748b;
        font-size: 16px;
        font-weight: 500;
        pointer-events: none;
        z-index: 1;
        padding: 32px;
        border: 2px dashed #cbd5e1;
        border-radius: 12px;
        background: #f8fafc;

        &::before {
          content: '✨';
          display: block;
          font-size: 36px;
          margin-bottom: 8px;
          opacity: 0.6;
        }

        &::after {
          content: '拖拽左侧组件到此处开始设计表单';
          display: block;
          font-size: 14px;
          color: #94a3b8;
          margin-top: 8px;
        }
      }
    }
  }

  .control-container {
    width: 300px;
    background: #ffffff;
    border-left: 1px solid #e2e8f0;
    position: relative;
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .design-container {
    .filed-container,
    .control-container {
      width: 260px;
    }
  }
}

@media (max-width: 768px) {
  .design-container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;

    .filed-container,
    .control-container {
      width: 100%;
      height: 200px;
      border: none;
      border-bottom: 1px solid #e2e8f0;
    }

    .main-body {
      .main-form {
        margin: 4px 8px 8px 8px;
        min-height: 300px;
        padding: 12px;
      }
    }
  }
}
</style>
