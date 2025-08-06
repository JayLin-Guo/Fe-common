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

<style lang="scss" scoped>
@use '../styles/theme.scss' as *;

.main-tools {
  @include toolbar-base;
  justify-content: flex-end;
  padding: $spacing-xs 0;
  min-height: 40px;
  margin-right: 2px;
}

.tool-btn {
  display: flex;
  align-items: center;
  padding: 0 $spacing-sm;
  background: $white;
  border: 1px solid $gray-200;
  border-radius: $border-radius;
  cursor: pointer;
  font-size: $font-size-sm;
  font-weight: 500;
  color: $gray-700;
  transition: all $transition-normal;
  user-select: none;
  height: 32px;

  &:hover {
    background: $gray-50;
    border-color: $gray-300;
    transform: translateY(-1px);
    box-shadow: $shadow;
  }

  &:active {
    transform: translateY(0);
  }

  .icon {
    font-size: $font-size-md;
    margin-right: $spacing-xs;
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
    border-color: $primary-color;
    background: $primary-lighter;
    color: $primary-color;
  }
}

/* 预览按钮 - 蓝色主题 */
.tool-btn:nth-child(2) {
  &:hover {
    border-color: $info-color;
    background: rgba($info-color, 0.05);
    color: $info-color;
  }
}

/* 清空按钮 - 红色主题 */
.tool-btn:nth-child(1) {
  &:hover {
    border-color: $danger-color;
    background: rgba($danger-color, 0.05);
    color: $danger-color;
  }
}

/* 导入按钮 - 绿色主题 */
.tool-btn:nth-child(3) {
  &:hover {
    border-color: $success-color;
    background: rgba($success-color, 0.05);
    color: $success-color;
  }
}
</style>
