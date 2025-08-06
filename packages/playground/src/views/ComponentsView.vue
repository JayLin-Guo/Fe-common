<template>
  <div class="components-view">
    <div class="page-header">
      <h2 class="page-title">组件库</h2>
      <p class="page-description">Jr UI Components 组件展示与测试</p>
    </div>

    <div class="components-grid">
      <div
        v-for="component in components"
        :key="component.name"
        class="component-card"
        @click="selectComponent(component)"
      >
        <div class="card-header">
          <div class="card-icon">
            <Icon :icon="component.icon" />
          </div>
          <div class="card-badge" :class="component.status">
            {{ component.statusText }}
          </div>
        </div>

        <div class="card-body">
          <h3 class="card-title">{{ component.label }}</h3>
          <p class="card-description">{{ component.description }}</p>

          <div class="card-tags">
            <span v-for="tag in component.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="card-footer">
          <button class="demo-btn" @click.stop="openDemo(component)">
            <Icon icon="mdi:play" />
            演示
          </button>
          <button class="code-btn" @click.stop="viewCode(component)">
            <Icon icon="mdi:code-tags" />
            代码
          </button>
        </div>
      </div>
    </div>

    <!-- 组件演示弹窗 -->
    <div v-if="showDemo" class="demo-modal" @click="closeDemo">
      <div class="demo-content" @click.stop>
        <div class="demo-header">
          <h3>{{ selectedComponent?.label }} - 演示</h3>
          <button class="close-btn" @click="closeDemo">
            <Icon icon="mdi:close" />
          </button>
        </div>

        <div class="demo-body">
          <component
            :is="getDemoComponent(selectedComponent?.name)"
            v-if="selectedComponent"
          />
        </div>
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

const showDemo = ref(false);
const selectedComponent = ref(null);

// 组件列表配置
const components = ref([
  {
    name: 'BizMessage',
    label: 'BizMessage',
    description: '业务消息提示组件，支持多种类型和自定义配置',
    icon: 'mdi:message-alert',
    status: 'stable',
    statusText: '稳定',
    tags: ['消息', '提示', '反馈'],
  },
  {
    name: 'BizMainForm',
    label: 'BizMainForm',
    description: '业务主表单容器组件，提供统一的表单布局',
    icon: 'mdi:form-select',
    status: 'stable',
    statusText: '稳定',
    tags: ['表单', '容器', '布局'],
  },
  {
    name: 'BizArea',
    label: 'BizArea',
    description: '支持搜索的省市区级联选择器',
    icon: 'mdi:map-marker',
    status: 'stable',
    statusText: '稳定',
    tags: ['选择器', '级联', '地区'],
  },
  {
    name: 'BaseTable',
    label: 'BaseTable',
    description: '基础表格组件，内置分页功能',
    icon: 'mdi:table',
    status: 'stable',
    statusText: '稳定',
    tags: ['表格', '分页', '数据'],
  },
  {
    name: 'BizSvgIcon',
    label: 'BizSvgIcon',
    description: 'SVG图标组件，支持多种尺寸和颜色',
    icon: 'mdi:vector-square',
    status: 'stable',
    statusText: '稳定',
    tags: ['图标', 'SVG', '矢量'],
  },
  {
    name: 'FormDesigner',
    label: 'FormDesigner',
    description: '通用的可视化表单设计器，支持拖拽设计和动态渲染',
    icon: 'mdi:form-dropdown',
    status: 'beta',
    statusText: 'Beta',
    tags: ['设计器', '表单', '可视化'],
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

const selectComponent = component => {
  console.log('选择组件:', component.name);
};

const openDemo = component => {
  selectedComponent.value = component;
  showDemo.value = true;
};

const closeDemo = () => {
  showDemo.value = false;
  selectedComponent.value = null;
};

const viewCode = component => {
  console.log('查看代码:', component.name);
  // 这里可以跳转到代码查看页面
};

const getDemoComponent = componentName => {
  return demoComponents[componentName];
};
</script>

<style lang="scss" scoped>
.components-view {
  height: 100%;
  overflow-y: auto;
  padding: 32px;
}

.page-header {
  margin-bottom: 32px;

  .page-title {
    margin: 0 0 8px 0;
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
  }

  .page-description {
    margin: 0;
    font-size: 16px;
    color: #64748b;
  }
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.component-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }
}

.card-header {
  padding: 20px 20px 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .card-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .card-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;

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

.card-body {
  padding: 20px;

  .card-title {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }

  .card-description {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .tag {
      padding: 4px 8px;
      background: #f1f5f9;
      color: #475569;
      font-size: 12px;
      border-radius: 6px;
      font-weight: 500;
    }
  }
}

.card-footer {
  padding: 0 20px 20px 20px;
  display: flex;
  gap: 12px;

  button {
    flex: 1;
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .demo-btn {
    background: #3b82f6;
    color: white;

    &:hover {
      background: #2563eb;
    }
  }

  .code-btn {
    background: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #f1f5f9;
      color: #475569;
    }
  }
}

// 演示弹窗样式
.demo-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.demo-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.demo-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: #f8fafc;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: all 0.2s ease;

    &:hover {
      background: #f1f5f9;
      color: #475569;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
}

.demo-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

// 响应式设计
@media (max-width: 768px) {
  .components-view {
    padding: 16px;
  }

  .components-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .component-card {
    .card-header {
      padding: 16px 16px 0 16px;

      .card-icon {
        width: 40px;
        height: 40px;

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }

    .card-body {
      padding: 16px;

      .card-title {
        font-size: 16px;
      }

      .card-description {
        font-size: 13px;
      }
    }

    .card-footer {
      padding: 0 16px 16px 16px;
    }
  }

  .demo-modal {
    padding: 10px;
  }

  .demo-content {
    max-height: 95vh;
  }

  .demo-header {
    padding: 16px 20px;

    h3 {
      font-size: 16px;
    }
  }

  .demo-body {
    padding: 20px;
  }
}
</style>
