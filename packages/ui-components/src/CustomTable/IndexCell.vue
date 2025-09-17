<template>
  <div class="index-cell">
    <span class="index-number">{{ displayIndex }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { IndexCellProps } from './types';

const props = withDefaults(defineProps<IndexCellProps>(), {
  startIndex: 1
});

const displayIndex = computed(() => props.index + props.startIndex);
</script>

<style scoped>
.index-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.index-number {
  color: #909399;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  user-select: none;
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
  .index-number {
    color: #a8abb2;
  }
}
</style>
