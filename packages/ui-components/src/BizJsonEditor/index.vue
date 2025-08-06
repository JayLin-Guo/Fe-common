<template>
  <JsonEditorVue
    ref="editorRef"
    v-model:value="jsonString"
    lang="json"
    theme="dark"
    :navigationBar="false"
    :statusBar="false"
    :mainMenuBar="false"
    mode="code"
    @change="handleChange"
  />
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import JsonEditorVue from 'json-editor-vue';

import { reactive } from 'vue';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  theme: {
    type: String,
    default: 'chrome',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const editorRef = ref<any>(null);

const jsonString = computed(() => {
  try {
    return JSON.stringify(JSON.parse(props.value), null, 2);
  } catch (e) {
    return props.value;
  }
});

const handleChange = ({ text }: any) => {
  console.log(JSON.parse(text), '修改后的');
};

const jsonError = (e: any) => {
  console.log(`JSON字符串错误：${e.message}`);
};

const validateJson = () => {
  try {
    editorRef.value.validate();
  } catch (e) {
    return false;
  }
  return true;
};

defineExpose({
  validateJson,
});
</script>
