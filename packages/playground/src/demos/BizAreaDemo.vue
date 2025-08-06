<template>
  <div class="demo-container">
    <div class="demo-section">
      <h4>省市区选择器</h4>
      <div class="demo-item">
        <BizArea
          v-model="selectedArea"
          placeholder="请选择省市区"
          :clearable="true"
          :filterable="true"
          @change="handleAreaChange"
        />
        <p v-if="selectedArea" class="selected-info">
          已选择: {{ selectedArea }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedArea = ref('');

const handleAreaChange = value => {
  console.log('省市区选择变化:', value);
};
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
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;

      .selected-info {
        margin-top: 16px;
        padding: 8px 12px;
        background: #eff6ff;
        color: #1d4ed8;
        border-radius: 4px;
        font-size: 14px;
      }
    }
  }
}
</style>
