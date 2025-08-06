<template>
  <div v-loading="loading" style="height: 96%; width: 96%">
    <el-form
      v-bind="data.form"
      style="height: 100%"
      :model="model"
      ref="ruleForm"
      size="small"
      label-width="220px"
      class="add-form"
      label-suffix="："
    >
      <form-group
        :data="data.list"
        :type="type"
        :active="active"
        @item-click="handleItemClick"
        @item-delete="handleItemDelete"
        @item-clone="handleItemClone"
      />
      <slot></slot>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { ref, provide, computed } from 'vue';
import FormGroup from './components/formGroup.vue';
import { constFormProps } from './utils.js';
const props = defineProps({
  type: {
    type: Number,
    required: true,
    default: () => 1, // 1新增；2修改；3查看（表单模式）；4查看；5设计
  },
  data: {
    type: Object,
    default: () => {
      return {
        list: [],
        form: {},
        config: {},
      };
    },
  },
  active: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(['item-click', 'item-delete', 'item-clone']);

// 事件处理函数
const handleItemClick = (item: any, index: number) => {
  emits('item-click', item, index);
};

const handleItemDelete = (item: any, index: number) => {
  emits('item-delete', item, index);
};

const handleItemClone = (item: any, index: number) => {
  emits('item-clone', item, index);
};
const loading = ref(false);
const model = ref({});

// 表单参数
const formProps = computed(() => {
  return {
    model: model.value,
    type: props.type,
    hideField: props.data.config?.hideField,
    showColon: props.data.form?.showColon,
  };
});

provide(constFormProps, formProps);
</script>
