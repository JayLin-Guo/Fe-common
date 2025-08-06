<template>
  <div class="playground-app">
    <header class="app-header">
      <div class="header-left">
        <h1>🎮 Jr UI Components Playground</h1>
        <p>组件库测试环境</p>
      </div>
      <div class="header-right">
        <el-select
          v-model="currentComponent"
          placeholder="选择组件"
          size="large"
          style="width: 200px"
        >
          <el-option
            v-for="component in components"
            :key="component.name"
            :label="component.label"
            :value="component.name"
          />
        </el-select>

        <el-button
          type="primary"
          size="large"
          @click="showComponentDialog = true"
          style="margin-left: 10px"
        >
          📋 组件总览
        </el-button>
      </div>
    </header>

    <!-- 组件选择弹窗 -->
    <el-dialog
      v-model="showComponentDialog"
      title="组件选择"
      width="600px"
      :show-close="true"
    >
      <div class="component-grid">
        <div
          v-for="component in components"
          :key="component.name"
          class="component-card"
          :class="{ active: currentComponent === component.name }"
          @click="selectComponent(component.name)"
        >
          <div class="card-icon">🧩</div>
          <div class="card-title">{{ component.label }}</div>
          <div class="card-desc">{{ component.description }}</div>
        </div>
      </div>
    </el-dialog>

    <main class="component-demo">
      <div class="demo-header">
        <h2>{{ getCurrentComponent()?.label }}</h2>
        <p>{{ getCurrentComponent()?.description }}</p>
      </div>

      <div class="demo-content">
        <!-- BizMessage 组件测试 -->
        <div v-if="currentComponent === 'BizMessage'" class="demo-section">
          <h4>全量引入测试</h4>
          <div class="demo-item">
            <BizMessage
              type="success"
              title="成功提示"
              message="这是一个成功消息"
              :show-close="true"
              :show-confirm="true"
            />
          </div>

          <h4>按需引入测试</h4>
          <div class="demo-item">
            <BizMessageImported
              type="warning"
              title="警告提示"
              message="这是按需引入的组件"
              :show-confirm="true"
            />
          </div>
        </div>

        <!-- BizMainForm 组件测试 -->
        <div v-if="currentComponent === 'BizMainForm'" class="demo-section">
          <h4>基础表单容器</h4>
          <div class="demo-item">
            <BizMainForm>
              <el-form :model="formData" label-width="120px">
                <el-form-item label="用户名">
                  <el-input
                    v-model="formData.username"
                    placeholder="请输入用户名"
                  />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="formData.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">提交</el-button>
                  <el-button>重置</el-button>
                </el-form-item>
              </el-form>
            </BizMainForm>
          </div>
        </div>

        <!-- BizArea 组件测试 -->
        <div v-if="currentComponent === 'BizArea'" class="demo-section">
          <h4>省市区选择器</h4>
          <div class="demo-item">
            <BizArea
              v-model="selectedArea"
              placeholder="请选择省市区"
              :clearable="true"
              :filterable="true"
              @change="handleAreaChange"
            />
            <p v-if="selectedArea">已选择: {{ selectedArea }}</p>
          </div>
        </div>

        <!-- BaseTable 组件测试 -->
        <div v-if="currentComponent === 'BaseTable'" class="demo-section">
          <h4>分页表格</h4>
          <div class="demo-item">
            <BaseTable
              :data="tableData"
              :config="tableConfig"
              :total="100"
              v-model="paginationParams"
              @search="handleTableSearch"
            />
          </div>
        </div>

        <!-- BizSvgIcon 组件测试 -->
        <div v-if="currentComponent === 'BizSvgIcon'" class="demo-section">
          <h4>SVG图标</h4>
          <div class="demo-item">
            <div style="display: flex; gap: 16px; align-items: center">
              <BizSvgIcon name="success" :size="24" color="#52c41a" />
              <BizSvgIcon name="error" :size="32" color="#ff4d4f" />
              <BizSvgIcon name="warning" :size="40" color="#faad14" />
            </div>
          </div>
        </div>

        <!-- FormDesigner 组件测试 -->
        <div
          v-if="currentComponent === 'FormDesigner'"
          class="demo-section form-designer"
        >
          <h4>表单设计器模式（基于您的模板配置）</h4>
          <div class="demo-item" style="height: 700px">
            <!-- <SimpleFormDesigner
              mode="design"
              :config="designerConfig"
              :schema="formDesignerSchema"
              @save="handleDesignerSave"
              @update:config="handleDesignerConfigUpdate"
            /> -->
            <DesignForm :schemaConf="designformSchema"></DesignForm>
          </div>

          <!-- <h4>表单渲染器模式</h4>
          <div class="demo-item">
            <SimpleFormDesigner
              mode="render"
              :config="renderConfig"
              :data="renderData"
              :schema="formDesignerSchema"
              @submit="handleRenderSubmit"
              @update:data="handleRenderDataUpdate"
            />
          </div> -->
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// 按需引入测试
import { BizMessage as BizMessageImported } from '@jr/ui-components';
// 引入简化版表单设计器
// import SimpleFormDesigner from '@jr/ui-components/FormDesigner/SimpleDesigner.vue';
import DesignForm from '@jr/ui-components/DesignFrom/index.vue';
// 引入表单设计器配置
import { formDesignerSchema } from './schema/formDesignerSchema.ts';

import { designformSchema } from './schema/designformSchema';

const currentComponent = ref('BizMessage');
const showComponentDialog = ref(false);

const components = [
  {
    name: 'BizMessage',
    label: 'BizMessage 业务消息',
    description: '业务消息提示组件，支持多种类型和自定义配置',
  },
  {
    name: 'BizMainForm',
    label: 'BizMainForm 主表单',
    description: '业务主表单容器组件',
  },
  {
    name: 'BizArea',
    label: 'BizArea 省市区选择',
    description: '支持搜索的省市区级联选择器',
  },
  {
    name: 'BaseTable',
    label: 'BaseTable 基础表格',
    description: '基础表格组件，内置分页功能',
  },
  {
    name: 'BizSvgIcon',
    label: 'BizSvgIcon SVG图标',
    description: 'SVG图标组件',
  },
  {
    name: 'FormDesigner',
    label: 'FormDesigner 表单设计器',
    description: '通用的可视化表单设计器，支持拖拽设计和动态渲染',
  },
];

// 表单数据
const formData = ref({
  username: '',
  email: '',
});

// 省市区选择
const selectedArea = ref('');

// 表格数据
const tableData = ref([
  { id: 1, name: '张三', age: 25, city: '北京' },
  { id: 2, name: '李四', age: 30, city: '上海' },
  { id: 3, name: '王五', age: 28, city: '广州' },
  { id: 4, name: '赵六', age: 35, city: '深圳' },
  { id: 5, name: '钱七', age: 22, city: '杭州' },
]);

const tableConfig = ref({
  tableColumn: [
    { prop: 'id', label: 'ID', width: 80 },
    { prop: 'name', label: '姓名', width: 120 },
    { prop: 'age', label: '年龄', width: 80 },
    { prop: 'city', label: '城市' },
  ],
  pagingColumn: {
    layout: 'total,prev, pager, next, sizes,jumper',
    pageSizes: [10, 20, 30, 40],
  },
});

const paginationParams = ref({
  page: 1,
  limit: 10,
});

const getCurrentComponent = () => {
  return components.find(comp => comp.name === currentComponent.value);
};

// 选择组件
const selectComponent = (componentName: string) => {
  currentComponent.value = componentName;
  showComponentDialog.value = false;
};

const handleAreaChange = (value: string) => {
  console.log('省市区选择变化:', value);
};

const handleTableSearch = () => {
  console.log('表格搜索:', paginationParams.value);
};

// FormDesigner 相关数据
const designerConfig = ref({
  fields: [],
  labelWidth: '120px',
  labelPosition: 'right',
  size: 'default',
});

const renderConfig = ref({
  fields: [
    {
      type: 'input',
      name: 'username',
      formItem: {
        label: '用户名',
        required: true,
      },
      control: {
        placeholder: '请输入用户名',
        clearable: true,
      },
      validation: {
        minLength: 3,
        maxLength: 20,
      },
    },
    {
      type: 'email',
      name: 'email',
      formItem: {
        label: '邮箱',
        required: true,
      },
      control: {
        placeholder: '请输入邮箱地址',
        clearable: true,
      },
    },
    {
      type: 'select',
      name: 'role',
      formItem: {
        label: '角色',
        required: true,
      },
      control: {
        placeholder: '请选择角色',
        clearable: true,
      },
      options: [
        { label: '管理员', value: 'admin' },
        { label: '用户', value: 'user' },
        { label: '访客', value: 'guest' },
      ],
    },
  ],
  labelWidth: '120px',
  labelPosition: 'right',
  size: 'default',
});

const renderData = ref({
  username: '',
  email: '',
  role: '',
});

const handleDesignerSave = (config: any) => {
  console.log('保存表单配置:', config);
  // 这里可以保存到服务器或本地存储
};

const handleDesignerConfigUpdate = (config: any) => {
  designerConfig.value = config;
  console.log('表单配置更新:', config);
};

const handleRenderSubmit = (data: any) => {
  console.log('提交表单数据:', data);
};

const handleRenderDataUpdate = (data: any) => {
  renderData.value = data;
  console.log('表单数据更新:', data);
};
</script>

<style scoped lang="scss">
.playground-app {
  display: flex;
  height: 100%;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-left {
    h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    p {
      margin: 0.5rem 0 0 0;
      opacity: 0.9;
      font-size: 0.9rem;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 10px;

    :deep(.el-select) {
      .el-input__wrapper {
        background-color: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.3);

        .el-input__inner {
          color: white;

          &::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }
        }
      }
    }
  }
}

// 组件选择弹窗样式
.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px 0;
}

.component-card {
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }

  &.active {
    border-color: #667eea;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .card-icon {
    font-size: 2rem;
    margin-bottom: 8px;
  }

  .card-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .card-desc {
    font-size: 0.85rem;
    opacity: 0.7;
    line-height: 1.4;
  }
}

.component-demo {
  width: 100%;
  padding: 1rem 2rem;
  height: calc(100% - 140px);
  margin-top: 80px;
  overflow-y: auto;

  .demo-header {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e9ecef;

    h2 {
      margin: 0 0 0.25rem 0;
      color: #212529;
      font-size: 1.5rem;
    }

    p {
      margin: 0;
      color: #6c757d;
      font-size: 0.9rem;
    }
  }

  .demo-section {
    h4 {
      margin: 1rem 0 0.5rem 0;
      color: #495057;
      font-size: 1rem;
    }

    .demo-item {
      margin-bottom: 1rem;
    }
  }
}
</style>
