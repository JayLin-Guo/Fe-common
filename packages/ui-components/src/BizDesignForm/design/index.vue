<script setup>
import { onBeforeMount, provide, reactive, ref, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import DragControl from './components/dragControl.vue';
import HeadTools from './components/headTools.vue';
import FormControlAttr from './components/formControlAttr.vue';
import { useAceDrawer } from './hooks/useAceDrawer';
import { useDesignTool } from './hooks/useDesignTool';
import { DrawerDirection } from './hooks/enum';
import akForm from '../form/index.vue';
import { useDesignStore } from '@/piniaStore/modules/design';
import { stringToObj } from '@/components/BizDesignForm/utils/design';

defineOptions({ name: 'designFormIndex' });

const pageLoading = ref(false);

const route = useRoute().query || {};
const designStore = useDesignStore();

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
  designType: typeof route.type === 'string' ? route.type : 'default', // 确保 designType 是 string
  formDict: {},
  formOtherData: {
    source: typeof route.source === 'string' ? route.source : '', // 确保 source 是 string
    formName: '未命名表单',
  },
});

provide('formDesignType', state.designType);

const showMessage = (message, type) => {
  const messageFunction =
    type === 'success' ? ElMessage.success : ElMessage.error;
  messageFunction(message);
};

// Template selection
// const selectTemplate = (data: FormData) => {
//   state.formData = stringToObj(objToStringify(data))
// }

const searchCheckField = data => {
  state.formData.list.push(data);
};
const previewForm = ref();
const previewSubmit = () => {
  previewForm.value.validate((valid, fields) => {
    if (valid) {
      showMessage('校验通过', 'success');
      console.log(fields);
    } else {
      showMessage('校验不通过', 'error');
    }
  });
};

const drawer = reactive({
  visible: false,
  type: '',
  title: '',
  codeType: '',
  direction: DrawerDirection.LTR,
  callback: undefined,
  content: '',
});

// Drawer and design tool hooks

const { headToolClick } = useDesignTool(drawer, state, pageLoading);

const initDesignFormData = async () => {
  pageLoading.value = true;
  try {
    await designStore.fetchControlList();
    const data = await designStore.fetchFormDataInfo();
    if (data && data.jsonStr) {
      const regxObj = stringToObj(data.jsonStr) || {
        list: [],
        form: { size: 'default' },
        config: {},
      };
      state.formData = regxObj.sourceData;
    } else {
      state.formData = {
        list: [],
        form: { size: 'default' },
        config: {},
      };
    }
  } catch (e) {
    console.error(e);
  } finally {
    pageLoading.value = false;
  }
};

watchEffect(async () => {
  if (designStore.currentMenuItem && designStore.currentMenuItem.type) {
    initDesignFormData();
  }
});

onBeforeMount(() => {
  initDesignFormData();
});
</script>

<template>
  <div class="design-container" v-loading="pageLoading">
    <drag-control
      :form-id="state.formOtherData.source"
      @clickCheck="searchCheckField"
    />

    <div class="main-body">
      <head-tools @click="headToolClick" />
      <div class="main-form" v-loading="state.loading">
        <div class="empty-tips" v-if="state.formData.list.length === 0">
          从左侧拖拽来添加字段
        </div>
        <ak-form :type="5" :data="state.formData" :dict="state.formDict" />
      </div>
    </div>

    <form-control-attr
      ref="formControlAttrEl"
      :form-data="state.formData.form"
      :form-config="state.formData.config"
      v-model:form-other-data="state.formOtherData"
    />

    <!-- <ace-drawer
      v-model="drawer.visible"
      :title="drawer.title"
      :direction="drawer.direction"
      :content="drawer.content"
      :code-type="drawer.codeType"
      @before-close="drawerBeforeClose"
      @confirm="dialogConfirm" /> -->

    <el-drawer
      v-model="state.previewVisible"
      size="80%"
      title="预览"
      modal
      append-to-body
      :z-index="10000"
      style="background-color: #efefef"
      :with-header="false"
    >
      <div style="height: 100%; padding: 20px" class="preview-form">
        <el-card>
          <ak-form
            :data="state.formDataPreview"
            :dict="state.formDict"
            isPreview
            ref="previewForm"
            v-if="state.previewVisible"
          />
        </el-card>
      </div>

      <template #footer>
        <div
          style="
            height: 60px;
            line-height: 60px;
            background-color: white;
            padding-right: 20px;
            text-align: center;
          "
        >
          <el-button
            size="small"
            type="primary"
            style="color: white; font-size: 13px; width: 80px; height: 30px"
            @click="previewSubmit"
          >
            提交
          </el-button>
          <el-button
            size="small"
            @click="state.previewVisible = false"
            style="color: #333; font-size: 13px; width: 80px; height: 30px"
          >
            取消
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped>
@use '@/components/BizDesignForm/design.scss';
</style>
