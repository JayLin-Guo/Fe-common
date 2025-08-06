<template>
  <div class="components-view">
    <!-- 组件列表页面 -->
    <div v-if="!selectedComponent" class="components-list">
      <div class="page-header">
        <h2 class="page-title">组件库</h2>
        <p class="page-description">Jr UI Components 组件展示与测试</p>
      </div>

      <div class="components-grid">
        <div
          v-for="component in components"
          :key="component.name"
          class="component-card"
          @click="viewComponent(component)"
        >
          <div class="card-icon">
            <Icon :icon="component.icon" />
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ component.label }}</h3>
            <p class="card-description">{{ component.description }}</p>
          </div>
          <div class="card-status" :class="component.status">
            {{ component.statusText }}
          </div>
        </div>
      </div>
    </div>

    <!-- 组件演示页面 -->
    <div v-else class="component-demo">
      <div class="demo-header">
        <button class="back-btn" @click="backToList">
          <Icon icon="mdi:arrow-left" />
          返回组件列表
        </button>
        <div class="demo-info">
          <h2 class="demo-title">{{ selectedComponent.label }}</h2>
          <p class="demo-description">{{ selectedComponent.description }}</p>
        </div>
      </div>

      <div class="demo-content">
        <component :is="getDemoComponent(selectedComponent.name)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

// 导入组件演示
import BizMessageDemo from '../demos/BizMessageDemo.vue';
import BizMainFormDemo from '../demos/BizMainFormDemo.vue';
import BizAreaDemo from '../demos/BizAreaDemo.vue';
import BaseTableDemo from '../demos/BaseTableDemo.vue';
import BizSvgIconDemo from '../demos/BizSvgIconDemo.vue';
import FormDesignerDemo from '../demos/FormDesignerDemo.vue';

const selectedComponent = ref(null);

// 组件列表配置
const components = ref([
  {
    name: 'BizMessage',
    label: 'BizMessage',
    description: '业务消息提示组件',
    icon: 'mdi:message-alert',
    status: 'stable',
    statusText: '稳定',
  },
  {
    name: 'BizArea',
    label: 'BizArea',
    description: '省市区级联选择器',
    icon: 'mdi:map-marker',
    status: 'stable',
    statusText: '稳定',
  },
  {
    name: 'BaseTable',
    label: 'BaseTable',
    description: '基础表格组件',
    icon: 'mdi:table',
    status: 'stable',
    statusText: '稳定',
  },
  {
    name: 'FormDesigner',
    label: 'FormDesigner',
    description: '可视化表单设计器',
    icon: 'mdi:form-dropdown',
    status: 'beta',
    statusText: 'Beta',
  },
]);

// 组件演示映射
const demoComponents = {
  BizMessage: BizMessageDemo,
  BizMainForm: BizMainFormDemo,
  BizArea: BizAreaDemo,
  BaseTable: BaseTableDemo,
  BizSvgIcon: BizSvgIconDemo,
  FormDesigner: FormDesignerDemo,
};

const viewComponent = component => {
  selectedComponent.value = component;
};

const backToList = () => {
  selectedComponent.value = null;
};

const getDemoComponent = componentName => {
  return demoComponents[componentName];
};
</script>

<style lang="scss" scoped>
.components-view {
  height: 100%;
  overflow: hidden;
}

// 组件列表页面
.components-list {
  height: 100%;
  overflow-y: auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;

  .page-title {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
  }

  .page-description {
    margin: 0;
    font-size: 14px;
    color: #64748b;
  }
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.component-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .card-content {
    flex: 1;
    min-width: 0;

    .card-title {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }

    .card-description {
      margin: 0;
      font-size: 13px;
      color: #64748b;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .card-status {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;

    &.stable {
      background: #dcfce7;
      color: #166534;
    }

    &.beta {
      background: #fef3c7;
      color: #92400e;
    }

    &.experimental {
      background: #fecaca;
      color: #991b1b;
    }
  }
}

// 组件演示页面
.component-demo {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.demo-header {
  padding: 10px 14px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
  flex-shrink: 0;

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    color: #64748b;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 16px;

    &:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      color: #475569;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .demo-info {
    display: flex;
    align-items: center;
    .demo-title {
      margin: 0 0 6px 0;
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
    }

    .demo-description {
      margin: 0;
      font-size: 14px;
      color: #64748b;
      margin-left: 20px;
    }
  }
}

.demo-content {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  background: #f8fafc;
}

// 响应式设计
@media (max-width: 768px) {
  .components-list {
    padding: 16px;
  }

  .page-header {
    margin-bottom: 16px;

    .page-title {
      font-size: 20px;
    }

    .page-description {
      font-size: 13px;
    }
  }

  .components-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .component-card {
    padding: 12px;

    .card-icon {
      width: 36px;
      height: 36px;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    .card-content {
      .card-title {
        font-size: 15px;
      }

      .card-description {
        font-size: 12px;
      }
    }

    .card-status {
      font-size: 10px;
      padding: 1px 6px;
    }
  }

  .demo-header {
    padding: 16px 20px;

    .demo-info {
      .demo-title {
        font-size: 18px;
      }

      .demo-description {
        font-size: 13px;
      }
    }
  }

  .demo-content {
    padding: 20px 16px;
  }
}

@media (max-width: 480px) {
  .components-grid {
    grid-template-columns: 1fr;
  }

  .component-card {
    .card-content {
      .card-description {
        white-space: normal;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        overflow: hidden;
      }
    }
  }
}
</style>
