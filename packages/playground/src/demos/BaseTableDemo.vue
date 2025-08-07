<template>
  <div class="base-table-demo">
    <h2>📊 表格设计器演示</h2>

    <div class="demo-section">
      <h3>🎨 表单设计器中的表格组件</h3>
      <p>在表单设计器中，您可以：</p>
      <ul>
        <li>拖拽表格组件到画布</li>
        <li>点击"管理列"按钮配置表格列</li>
        <li>设置表格基础属性（边框、斑马纹、分页等）</li>
        <li>预览表格效果</li>
      </ul>

      <!-- 表单设计器 -->
      <design-form-index
        :schema-conf="schemaConf"
        @save="handleSave"
        @export="handleExport"
      />
    </div>

    <div class="demo-section" v-if="generatedTableConfig">
      <h3>🚀 生成的表格配置</h3>
      <div class="config-preview">
        <pre>{{ JSON.stringify(generatedTableConfig, null, 2) }}</pre>
      </div>

      <h4>📋 使用生成的配置渲染表格</h4>
      <base-table
        v-model="pagination"
        :data="sampleData"
        :config="generatedTableConfig"
        :total="total"
        @search="handleSearch"
      >
        <!-- 自定义插槽示例 -->
        <template #operation="{ row }">
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </base-table>
    </div>

    <div class="demo-section">
      <h3>📚 BaseTable 基础用法</h3>
      <base-table
        v-model="basicPagination"
        :data="basicTableData"
        :config="basicTableConfig"
        :total="basicTotal"
        @search="handleBasicSearch"
      >
        <template #status="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
        <template #operation="{ row }">
          <el-button type="primary" link size="small">编辑</el-button>
          <el-button type="danger" link size="small">删除</el-button>
        </template>
      </base-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import BaseTable from '../../../ui-components/src/baseTable/index.vue';
import DesignFormIndex from '../../../ui-components/src/DesignFrom/index.vue';

// 表单设计器配置
const schemaConf = {
  templateList: [],
  filedSchema: [
    {
      title: '表格组件',
      children: [
        {
          type: 'table',
          label: '数据表格',
          icon: 'table',
          name: 'table',
          control: {
            data: [
              {
                id: 1,
                name: '张三',
                age: 25,
                email: 'zhangsan@example.com',
                status: 1,
              },
              {
                id: 2,
                name: '李四',
                age: 30,
                email: 'lisi@example.com',
                status: 0,
              },
              {
                id: 3,
                name: '王五',
                age: 28,
                email: 'wangwu@example.com',
                status: 1,
              },
            ],
            config: {
              tableColumn: [
                { type: 'selection' as const, width: 50 },
                { type: 'index' as const, label: '序号', width: 70 },
                { label: '姓名', prop: 'name', minWidth: 100 },
                { label: '年龄', prop: 'age', width: 80 },
                {
                  label: '邮箱',
                  prop: 'email',
                  minWidth: 150,
                  showOverflowTooltip: true,
                },
                {
                  label: '状态',
                  prop: 'status',
                  slotName: 'status',
                  width: 80,
                  align: 'center' as const,
                },
                {
                  label: '操作',
                  slotName: 'operation',
                  width: 150,
                  align: 'center' as const,
                },
              ],
              pagingColumn: {
                layout: 'total, sizes, prev, pager, next, jumper',
                pageSizes: [10, 20, 30, 50],
              },
            },
            modelValue: { page: 1, limit: 10 },
            total: 100,
          },
          config: {
            showBorder: true,
            showStripe: true,
            showPagination: true,
          },
        },
      ],
    },
  ],
};

// 生成的表格配置
const generatedTableConfig = ref(null);

// 示例数据
const sampleData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', status: 1 },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', status: 0 },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', status: 1 },
  { id: 4, name: '赵六', age: 32, email: 'zhaoliu@example.com', status: 1 },
]);

const pagination = ref({ page: 1, limit: 10 });
const total = ref(50);

// 基础表格演示
const basicPagination = ref({ page: 1, limit: 10 });
const basicTotal = ref(100);

const basicTableData = ref([
  {
    id: 1,
    username: 'admin',
    realName: '管理员',
    phone: '13800138000',
    email: 'admin@example.com',
    status: 1,
    createTime: '2023-01-01 10:00:00',
  },
  {
    id: 2,
    username: 'user1',
    realName: '用户一',
    phone: '13800138001',
    email: 'user1@example.com',
    status: 1,
    createTime: '2023-01-02 10:00:00',
  },
  {
    id: 3,
    username: 'user2',
    realName: '用户二',
    phone: '13800138002',
    email: 'user2@example.com',
    status: 0,
    createTime: '2023-01-03 10:00:00',
  },
  {
    id: 4,
    username: 'user3',
    realName: '用户三',
    phone: '13800138003',
    email: 'user3@example.com',
    status: 1,
    createTime: '2023-01-04 10:00:00',
  },
]);

const basicTableConfig = ref({
  tableColumn: [
    { type: 'selection' as const, width: 50 },
    { type: 'index' as const, label: '序号', width: 70 },
    { label: '用户名', prop: 'username', minWidth: 120 },
    { label: '姓名', prop: 'realName', minWidth: 120 },
    { label: '手机号', prop: 'phone', width: 120 },
    { label: '邮箱', prop: 'email', minWidth: 150 },
    { label: '状态', slotName: 'status', width: 80, align: 'center' as const },
    { label: '创建时间', prop: 'createTime', width: 160 },
    {
      label: '操作',
      slotName: 'operation',
      width: 150,
      align: 'center' as const,
    },
  ],
  pagingColumn: {
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [10, 20, 50, 100],
  },
});

// 处理设计器保存
const handleSave = (data: any) => {
  console.log('保存表单数据:', data);

  // 查找表格组件并提取配置
  const findTableConfig = (list: any[]): any => {
    for (const item of list) {
      if (item.type === 'table') {
        return item.control.config;
      }
      // 递归查找嵌套组件
      if (item.columns) {
        for (const col of item.columns) {
          if (col.list) {
            const config: any = findTableConfig(col.list);
            if (config) return config;
          }
        }
      }
      if (item.list) {
        const config: any = findTableConfig(item.list);
        if (config) return config;
      }
    }
    return null;
  };

  const tableConfig = findTableConfig(data.formData.list);
  if (tableConfig) {
    generatedTableConfig.value = tableConfig;
  }
};

// 处理设计器导出
const handleExport = (data: any) => {
  console.log('导出表单数据:', data);
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'form-config.json';
  a.click();
  URL.revokeObjectURL(url);
};

// 处理表格搜索
const handleSearch = (params: any) => {
  console.log('表格搜索参数:', params);
  // 这里可以调用 API 获取数据
};

const handleBasicSearch = (params: any) => {
  console.log('基础表格搜索参数:', params);
  // 这里可以调用 API 获取数据
};
</script>

<style lang="scss" scoped>
.base-table-demo {
  padding: 20px;

  .demo-section {
    margin-bottom: 40px;

    h3 {
      color: #409eff;
      border-bottom: 2px solid #409eff;
      padding-bottom: 8px;
      margin-bottom: 20px;
    }

    ul {
      background: #f8f9fa;
      padding: 15px 20px;
      border-radius: 4px;
      border-left: 4px solid #409eff;

      li {
        margin-bottom: 8px;
        color: #606266;
      }
    }
  }

  .config-preview {
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 20px;
    max-height: 300px;
    overflow-y: auto;

    pre {
      margin: 0;
      font-size: 12px;
      color: #333;
    }
  }
}
</style>
