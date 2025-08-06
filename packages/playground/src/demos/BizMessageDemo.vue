<template>
  <div class="demo-container">
    <div class="demo-section">
      <h4>基础用法</h4>
      <div class="demo-item">
        <BizMessage
          type="success"
          title="成功提示"
          message="这是一个成功消息"
          :show-close="true"
          :show-confirm="true"
        />
      </div>
    </div>

    <div class="demo-section">
      <h4>不同类型</h4>
      <div class="demo-item">
        <div class="message-types">
          <BizMessage
            type="info"
            title="信息提示"
            message="这是一个信息消息"
            :show-close="true"
          />
          <BizMessage
            type="warning"
            title="警告提示"
            message="这是一个警告消息"
            :show-close="true"
          />
          <BizMessage
            type="error"
            title="错误提示"
            message="这是一个错误消息"
            :show-close="true"
          />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h4>方法调用</h4>
      <div class="demo-item">
        <div class="button-group">
          <button @click="showSuccess" class="demo-btn success">
            成功消息
          </button>
          <button @click="showWarning" class="demo-btn warning">
            警告消息
          </button>
          <button @click="showError" class="demo-btn error">错误消息</button>
          <button @click="showInfo" class="demo-btn info">信息消息</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BizMessage } from '@jr/ui-components';

const showSuccess = () => {
  BizMessage.success('操作成功！');
};

const showWarning = () => {
  BizMessage.warning('请注意检查输入内容');
};

const showError = () => {
  BizMessage.error('操作失败，请重试');
};

const showInfo = () => {
  BizMessage.info('这是一条提示信息');
};
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

  .message-types {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .button-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    .demo-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &.success {
        background: #10b981;
        color: white;

        &:hover {
          background: #059669;
        }
      }

      &.warning {
        background: #f59e0b;
        color: white;

        &:hover {
          background: #d97706;
        }
      }

      &.error {
        background: #ef4444;
        color: white;

        &:hover {
          background: #dc2626;
        }
      }

      &.info {
        background: #3b82f6;
        color: white;

        &:hover {
          background: #2563eb;
        }
      }
    }
  }
}
</style>
