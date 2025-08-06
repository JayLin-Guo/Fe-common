<template>
  <div class="drag-control-container">
    <div
      v-for="(list, index) in controlList"
      :key="index"
      class="control-group"
    >
      <div class="group-title">
        {{ list.title }}
      </div>

      <draggable
        :itemKey="index + ''"
        tag="ul"
        v-model="list.children"
        :group="{ name: 'form', pull: 'clone', put: false }"
        ghost-class="ghost"
        :sort="false"
        :clone="clone"
        class="control-grid"
      >
        <template #item="{ element }">
          <li :class="['control-item', element.type]" :title="element.label">
            <div class="control-icon">
              <i :class="`icon-${element.icon}`"></i>
            </div>
            <span class="control-label">{{ element.label }}</span>
          </li>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, PropType } from 'vue';
import { SchemaJson } from '../types/designForm';
import Draggable from 'vuedraggable-es';
import { jsonParseStringify } from '../utils';

const props = defineProps({
  controlSchema: {
    type: Array as PropType<SchemaJson[]>,
    default: () => [],
  },
});

const controlList = ref<SchemaJson[]>([]);
const clone = (origin: any) => jsonParseStringify(origin);

watch(
  () => props.controlSchema,
  (list: any) => {
    controlList.value = list;
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<style scoped>
.drag-control-container {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;

    &:hover {
      background: #94a3b8;
    }
  }
}

.control-group {
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.9);

  padding: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    transition: all 0.2s ease;
  }
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  padding: 0 0 8px 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30px;
    height: 2px;
    background: #3b82f6;
    border-radius: 1px;
  }
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
  cursor: grab;
  transition: all 0.2s ease;
  height: auto;
  min-height: 24px;

  &:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  &:active {
    cursor: grabbing;
    transform: translateY(0);
  }
}

.control-icon {
  margin-bottom: 6px;
  font-size: 16px;
  color: #6b7280;
  line-height: 1;
  transition: color 0.2s ease;

  .control-item:hover & {
    color: #3b82f6;
  }

  i {
    display: block;
  }
}

.control-label {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  text-align: center;
  line-height: 1.3;
  word-break: break-word;
  transition: color 0.2s ease;

  /* 超出内容省略号 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

  .control-item:hover & {
    color: #3b82f6;
  }
}

/* 拖拽时的样式 */
.ghost {
  opacity: 0.5;
  background: #f3f4f6;
  border: 2px dashed #9ca3af;
}

/* 响应式调整 */
@media (max-width: 280px) {
  .control-grid {
    grid-template-columns: 1fr;
  }

  .control-item {
    min-height: 50px;
    padding: 10px 6px;
  }
}
</style>
