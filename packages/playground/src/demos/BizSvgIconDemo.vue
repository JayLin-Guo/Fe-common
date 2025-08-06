<template>
  <div class="demo-container">
    <div class="demo-section">
      <h4>SVG图标展示</h4>
      <div class="demo-item">
        <div class="icon-showcase">
          <div class="icon-item">
            <BizSvgIcon name="success" :size="24" color="#52c41a" />
            <span>success</span>
          </div>
          <div class="icon-item">
            <BizSvgIcon name="error" :size="32" color="#ff4d4f" />
            <span>error</span>
          </div>
          <div class="icon-item">
            <BizSvgIcon name="warning" :size="40" color="#faad14" />
            <span>warning</span>
          </div>
          <div class="icon-item">
            <BizSvgIcon name="info" :size="28" color="#1890ff" />
            <span>info</span>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h4>不同尺寸</h4>
      <div class="demo-item">
        <div class="size-showcase">
          <BizSvgIcon name="success" :size="16" color="#52c41a" />
          <BizSvgIcon name="success" :size="24" color="#52c41a" />
          <BizSvgIcon name="success" :size="32" color="#52c41a" />
          <BizSvgIcon name="success" :size="48" color="#52c41a" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// BizSvgIcon 组件会在这里被使用
</script>

<style lang="scss" scoped>
.demo-container {
  .demo-section {
    margin-bottom: 32px;

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
    }
  }

  .icon-showcase {
    display: flex;
    gap: 32px;
    align-items: center;

    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      span {
        font-size: 12px;
        color: #64748b;
        font-weight: 500;
      }
    }
  }

  .size-showcase {
    display: flex;
    gap: 24px;
    align-items: center;
  }
}
</style>
