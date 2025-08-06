<template>
  <div class="cui-main-form-item">
    <div class="cui-main-form-item-label">
      <span v-if="!slots.label">{{ label }}</span>
      <slot v-else name="label"></slot>
    </div>
    <div class="cui-main-form-item-content">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
const slots = useSlots()
const props = defineProps({
  label: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.cui-main-form-item {
  .cui-main-form-item-label {
    background: linear-gradient(135deg, rgba(255, 107, 3, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%);
    padding: 12px 20px;
    margin-bottom: 20px;
    font-weight: lighter;
    border-left: 2px solid #ff6b03;
    border-radius: 6px;
    color: #000;
  }

  .cui-main-form-item-content {
    flex: 1;
    :deep(.flex.mb15 .ml20) {
      line-height: 40px;
    }
  }
}

</style>
