<template>
  <div class="demo-container">
    <div class="demo-section">
      <h4>表单设计器</h4>
      <div class="demo-item">
        <DesignForm :schemaConf="designformSchema" />
      </div>
    </div>
  </div>
</template>

<script setup>
import DesignForm from '@jr/ui-components/DesignFrom/index.vue';
import { designformSchema } from '../schema/designformSchema';
</script>

<style lang="scss" scoped>
.demo-container {
  .demo-section {
    h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #374151;
    }

    .demo-item {
      height: 600px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
  }
}
</style>
