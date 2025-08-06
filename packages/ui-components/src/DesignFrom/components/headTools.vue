<template>
  <div class="main-tools">
    <slot></slot>
    <div
      v-for="item in btnList"
      :key="item.icon"
      class="tool-btn"
      @click="btnClick(item.icon)"
    >
      <template v-if="item.icon === 'delete'">
        <Icon icon="carbon:trash-can" class="icon" />
      </template>
      <template v-if="item.icon === 'preview'">
        <Icon icon="carbon:view" class="icon" />
      </template>
      <template v-if="item.icon === 'save'">
        <Icon icon="carbon:save" class="icon" />
      </template>
      <template v-if="item.icon === 'import'">
        <Icon icon="carbon:document-import" class="icon" />
      </template>
      <template v-if="item.icon === 'export'">
        <Icon icon="carbon:document-export" class="icon" />
      </template>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
  showKey: {
    type: Array,
    default: () => [],
  },
  hideKey: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits(['click']);

const btnList = computed(() => {
  const list = [
    { icon: 'delete', label: '清空', key: 1 },
    { icon: 'preview', label: '预览', key: 2 },
    { icon: 'import', label: '导入', key: 3 },
    { icon: 'export', label: '导出', key: 4 },
    { icon: 'save', label: '保存', key: 5 },
  ];

  if (props.showKey?.length) {
    return list.filter(item => props.showKey.includes(item.key));
  } else if (props.hideKey?.length) {
    return list.filter(item => !props.hideKey.includes(item.key));
  } else {
    return list;
  }
});

const btnClick = type => {
  emits('click', type);
};
</script>

<style scoped>
.main-tools {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 4px 0px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  min-height: 40px;
  margin-right: 2px;
}

.tool-btn {
  display: flex;
  align-items: center;
  padding: 0px 8px;
  background: #ffffff;
  border: 1px solid #e2e8f0;

  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease;
  user-select: none;
  height: 32px;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  .icon {
    font-size: 14px;
    margin-right: 4px;
    display: flex;
    align-items: center;
    width: 14px;
    height: 14px;
  }
}

/* 保存和导出按钮 - 橙色主题 */
.tool-btn:nth-child(4),
.tool-btn:nth-child(5) {
  &:hover {
    border-color: #ff6700;
    background: rgba(255, 103, 0, 0.05);
    color: #ff6700;
  }
}

/* 预览按钮 - 蓝色主题 */
.tool-btn:nth-child(2) {
  &:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
    color: #3b82f6;
  }
}

/* 清空按钮 - 红色主题 */
.tool-btn:nth-child(1) {
  &:hover {
    border-color: #dc2626;
    background: rgba(220, 38, 38, 0.05);
    color: #dc2626;
  }
}

/* 导入按钮 - 绿色主题 */
.tool-btn:nth-child(3) {
  &:hover {
    border-color: #16a34a;
    background: rgba(22, 163, 74, 0.05);
    color: #16a34a;
  }
}

/* 特殊按钮样式 */
.tool-btn[data-type='primary'] {
  background: #ff6700;
  border-color: #ff6700;
  color: white;

  &:hover {
    background: #e55a00;
    border-color: #e55a00;
    color: white;
    transform: translateY(-1px);
  }
}

.tool-btn[data-type='danger'] {
  background: #dc2626;
  border-color: #dc2626;
  color: white;

  &:hover {
    background: #b91c1c;
    border-color: #b91c1c;
    color: white;
    transform: translateY(-1px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-tools {
    padding: 12px 16px;
    gap: 8px;
    flex-wrap: wrap;
  }

  .tool-btn {
    padding: 6px 12px;
    font-size: 13px;

    .icon {
      font-size: 14px;
      margin-right: 4px;
    }
  }
}

@media (max-width: 480px) {
  .tool-btn {
    padding: 6px 8px;
    min-width: 40px;
    justify-content: center;

    span:not(.icon) {
      display: none;
    }

    .icon {
      margin-right: 0;
    }
  }
}
</style>
