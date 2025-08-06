<template>
  <BizJsonEditor v-model="json" />
</template>

<script setup>
import { ref } from 'vue';
import { BizJsonEditor } from '@jr/ui-components';

const json = ref({
  name: 'John',
});
// const json = ref({
//   name: 'John',
//   age: 30,
//   city: 'New York',
// });
//
</script>
