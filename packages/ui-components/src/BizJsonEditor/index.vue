<template>
  <JsonEditorVue
    style="width: 100%"
    ref="editorRef"
    v-model="jsonString"
    lang="json"
    theme="dark"
    mode="code"
    :navigationBar="false"
    :statusBar="false"
    :mainMenuBar="false"
    @change="handleChange"
  />
</template>
<script lang="ts" setup>
import { computed, isRef, ref, watch } from 'vue';
import JsonEditorVue from 'json-editor-vue';

import { reactive } from 'vue';

const props = defineProps({
  modelValue: {
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
const jsonString = ref('');
watch(
  () => props.modelValue,
  (newVal: any) => {
    let jsonVal;
    if (isRef(newVal)) {
      jsonVal = newVal.value;
    } else {
      jsonVal = newVal;
    }

    console.log(jsonVal, 'jsonVal');
    if (!jsonVal) return;
    if (typeof jsonVal === 'object' && jsonVal !== null) {
      jsonString.value = jsonVal;
    } else {
      jsonString.value = JSON.parse(jsonVal);
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

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
