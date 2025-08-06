<!-- FallbackWidget - 处理未注册的控件类型 -->
<template>
  <div class="fallback-widget" @click="handleClick">
    <!-- 未知组件类型的通用显示 -->
    <div class="unknown-control">
      <div class="unknown-header">
        <Icon icon="mdi:help-circle" class="unknown-icon" />
        <span class="unknown-title">未知组件</span>
        <span class="unknown-type">{{ element.type }}</span>
      </div>
      <div class="unknown-content">
        <p class="unknown-description">
          组件类型 "{{ element.type }}" 尚未实现
        </p>
        <div class="unknown-props" v-if="hasProps">
          <h4>配置属性:</h4>
          <pre>{{ JSON.stringify(element.control, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

interface Props {
  element: any;
  designMode?: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits(['group-click']);

// 是否有配置属性
const hasProps = computed(() => {
  return props.element.control && Object.keys(props.element.control).length > 0;
});

const handleClick = () => {
  emits('group-click', props.element);
};
</script>

<style lang="scss" scoped>
@use '../../styles/theme.scss' as *;

.fallback-widget {
  @include widget-base;

  &:hover {
    @include widget-hover;
  }
}

.unknown-control {
  padding: $spacing-md;
  border: 2px dashed $gray-300;
  border-radius: $border-radius-md;
  background: $gray-50;
  text-align: center;

  .unknown-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-xs;
    margin-bottom: $spacing-sm;

    .unknown-icon {
      color: $warning-color;
      font-size: $font-size-lg;
    }

    .unknown-title {
      font-weight: 600;
      color: $gray-700;
    }

    .unknown-type {
      padding: 2px 8px;
      background: $warning-color;
      color: white;
      border-radius: $border-radius-sm;
      font-size: $font-size-sm;
      font-family: monospace;
    }
  }

  .unknown-content {
    .unknown-description {
      color: $gray-600;
      margin-bottom: $spacing-sm;
      font-size: $font-size-sm;
    }

    .unknown-props {
      text-align: left;
      margin-top: $spacing-sm;

      h4 {
        margin: 0 0 $spacing-xs 0;
        font-size: $font-size-sm;
        color: $gray-700;
      }

      pre {
        background: white;
        border: 1px solid $gray-200;
        border-radius: $border-radius-sm;
        padding: $spacing-sm;
        font-size: 12px;
        max-height: 150px;
        overflow-y: auto;
        color: $gray-800;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .unknown-control {
    padding: $spacing-sm;

    .unknown-header {
      flex-direction: column;
      gap: $spacing-xs;

      .unknown-type {
        font-size: 11px;
      }
    }

    .unknown-props pre {
      font-size: 11px;
      max-height: 100px;
    }
  }
}
</style>
