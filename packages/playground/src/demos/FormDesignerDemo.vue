<template>
  <div class="demo-container fill-height">
    <div class="demo-section fill-height">
      <h4>表单设计器</h4>
      <div class="demo-item fill-height">
        <DesignForm :schemaConf="designformSchema" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { DesignForm } from '@jr/ui-components';
import { ref } from 'vue';
// import { designformSchema } from '../schema/designformSchema';

const designformSchema = ref();
</script>

<style lang="scss" scoped>
@use '../styles/demo.scss' as *;
</style>
