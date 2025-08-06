<template>
  <div class="cui-main-form">
    <slot></slot>
  </div>
</template>

<script setup>
defineOptions({
  name: 'BizMainForm'
})
</script>

<style scoped>
.cui-main-form {
  width: 100%;
  height: 100%;
}
</style>
