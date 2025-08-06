<template>
  <svg class="svg-icon" :class="{ 'svg-icon-spin': spin }" :style="svgStyle" aria-hidden="true">
    <use :href="symbolId" />
  </svg>
</template>

<script setup>
defineOptions({
  name: 'BizSvgIcon'
})
import { computed } from 'vue'

const props = defineProps({
  // 图标名称，对应SVG文件名
  name: {
    type: String,
    required: true
  },
  // 图标颜色
  color: {
    type: String,
    default: 'currentColor'
  },
  // 图标大小
  size: {
    type: [Number, String],
    default: '1em'
  },
  // 是否旋转
  spin: {
    type: Boolean,
    default: false
  }
})

// 计算Symbol ID
const symbolId = computed(() => {
  return `#icon-${props.name}`
})

// 计算SVG样式
const svgStyle = computed(() => {
  return {
    width: typeof props.size === 'number' ? `${props.size}px` : props.size,
    height: typeof props.size === 'number' ? `${props.size}px` : props.size,
    color: props.color
  }
})
</script>

<style lang="scss" scoped>
.svg-icon {
  fill: currentColor;
  vertical-align: middle;
  overflow: hidden;
}

.svg-icon-spin {
  animation: svg-icon-spin 1s linear infinite;
}

@keyframes svg-icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
