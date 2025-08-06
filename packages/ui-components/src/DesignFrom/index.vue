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

    case 'save':
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

// 处理表单项点击（选中）
const handleItemClick = (item: any, index: number) => {
  state.selectedElement = item;
  state.activeKey = getGroupName(item, index);
};

// 处理表单项删除
const handleItemDelete = (item: any, index: number) => {
  if (state.selectedElement === item) {
    state.selectedElement = null;
    state.activeKey = '';
  }
};

// 处理表单项克隆
const handleItemClone = (item: any, index: number) => {
  // 如果需要选中新克隆的元素
  state.selectedElement = item;
  state.activeKey = getGroupName(item, index);
};

// 处理属性更新
const handleUpdateElement = (updatedElement: any) => {
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
@import './styles/theme.scss';

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
