### 组件名称
base-table 基础表格组件

### 基础用法

``` html
<template>
  <base-table
    v-model="pagination"
    :data="tableData"
    :config="tableConfig"
    :total="total"
    @search="fetchData"
  >
    <!-- 自定义插槽 -->
    <template #operation="{ row }">
      <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
      <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
    </template>
  </base-table>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseTable from '@/components/baseTable/index.vue'

// 分页参数
const pagination = ref({
  page: 1,
  limit: 10
})

// 表格数据
const tableData = ref([])
const total = ref(0)

// 表格配置
const tableConfig = ref({
  tableColumn: [
    { type: 'selection', width: 50 },
    { type: 'index', label: '序号', width: 70 },
    { label: '姓名', prop: 'name', minWidth: 100 },
    { label: '年龄', prop: 'age', width: 80 },
    { label: '地址', prop: 'address', minWidth: 200, showOverflowTooltip: true },
    { label: '操作', slotName: 'operation', width: 150, align: 'center' }
  ],
  pagingColumn: {
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [10, 20, 30, 50]
  }
})

// 获取数据方法
const fetchData = async () => {
  try {
    // 发起请求获取数据
    const res = await api.getList({
      page: pagination.value.page,
      limit: pagination.value.limit,
      // ...其他查询参数
    })
    
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

```

### 属性说明

| 属性名 | 说明 | 类型 | 默认值 |
|-------|------|------|-------|
| data | 表格数据 | Array | [] |
| config | 表格配置 | TableConfig | {} |
| modelValue (v-model) | 分页参数 | PaginationParams | {page: 1, limit: 10} |
| total | 数据总数 | Number | 0 |

### TableConfig 类型定义
```ts
interface TableConfig {
  tableColumn: TableColumn[];  // 表格列配置
  pagingColumn?: PagingColumn; // 分页配置
}

interface TableColumn {
  type?: 'selection' | 'index' | 'expand'; // 列类型
  prop?: string;               // 数据字段名
  label?: string;              // 列标题
  width?: string | number;     // 列宽度
  minWidth?: string | number;  // 最小列宽
  maxWidth?: string | number;  // 最大列宽
  align?: 'left' | 'center' | 'right'; // 对齐方式
  showOverflowTooltip?: boolean; // 是否显示提示框
  slotName?: string;           // 插槽名称
  children?: TableColumn[];    // 子列（多级表头）
}

interface PagingColumn {
  layout?: string;             // 分页组件布局
  pageSizes?: number[];        // 每页显示数量选项
}

interface PaginationParams {
  page: number;                // 当前页码
  limit: number;               // 每页数量
}
```
### 事件
| 事件名 | 说明 | 回调参数 |
|-------|------|----------|
| update:modelValue | 分页参数变化时触发 | 新的分页参数 |
| search | 分页参数变化时触发，用于重新获取数据 | - |

### 插槽
| 插槽名 | 说明 | 插槽作用域 |
|-------|------|----------|
| [column.slotName] | 自定义列内容 | { row, i } |
| [column.slotName + 'Header'] | 自定义列头 | { row, i } |
### 完整实践示例
```html
<template>
  <div class="table-container">
    <search-form v-model="queryParams" :form-config="searchConfig" @search="handleSearch">
      <template #buttons>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="danger" @click="handleBatchDelete" :disabled="!selectedRows.length">批量删除</el-button>
      </template>
    </search-form>
    
    <base-table
      v-model="pagination"
      :data="tableData"
      :config="tableConfig"
      :total="total"
      @search="fetchData"
      @selection-change="handleSelectionChange"
    >
      <template #operation="{ row }">
        <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        <el-button type="success" link @click="handleView(row)">查看</el-button>
      </template>
      
      <template #status="{ row }">
        <el-switch
          v-model="row.status"
          :active-value="1"
          :inactive-value="0"
          @change="(val) => handleStatusChange(row, val)"
        />
      </template>
    </base-table>
    
    <!-- 表单弹窗 -->
    <user-form-dialog
      v-model="dialogVisible"
      :form-data="formData"
      :title="dialogTitle"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import BaseTable from '@/components/baseTable/index.vue'
import SearchForm from '@/components/searchForm/index.vue'
import UserFormDialog from './components/UserFormDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, deleteUser, updateUserStatus } from '@/api/user'

// 查询参数
const queryParams = ref({
  username: '',
  status: '',
  dateRange: []
})

// 搜索表单配置
const searchConfig = {
  schema: [
    {
      field: 'username',
      label: '用户名',
      type: 'input',
      colProps: { span: 6 }
    },
    {
      field: 'status',
      label: '状态',
      type: 'select',
      colProps: { span: 6 },
      props: {
        options: [
          { label: '全部', value: '' },
          { label: '启用', value: '1' },
          { label: '禁用', value: '0' }
        ]
      }
    },
    {
      field: 'dateRange',
      label: '创建时间',
      type: 'daterange',
      colProps: { span: 6 },
      DateMap: ['startTime', 'endTime']
    },
    {
      type: 'operate',
      options: ['search', 'clear'],
      colProps: { span: 6 }
    }
  ]
}

// 表格数据
const tableData = ref([])
const total = ref(0)
const selectedRows = ref([])

// 分页参数
const pagination = ref({
  page: 1,
  limit: 10
})

// 表格配置
const tableConfig = ref({
  tableColumn: [
    { type: 'selection', width: 50 },
    { type: 'index', label: '序号', width: 70 },
    { label: '用户名', prop: 'username', minWidth: 120 },
    { label: '姓名', prop: 'realName', minWidth: 120 },
    { label: '手机号', prop: 'phone', width: 120 },
    { label: '邮箱', prop: 'email', minWidth: 150 },
    { label: '状态', slotName: 'status', width: 80, align: 'center' },
    { label: '创建时间', prop: 'createTime', width: 160 },
    { label: '操作', slotName: 'operation', width: 180, align: 'center' }
  ],
  pagingColumn: {
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [10, 20, 50, 100]
  }
})

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const formData = ref({})

// 获取表格数据
const fetchData = async () => {
  try {
    const params = {
      ...queryParams.value,
      ...pagination.value
    }
    const res = await getUserList(params)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.value.page = 1
  fetchData()
}

// 选择行变化
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 新增用户
const handleAdd = () => {
  formData.value = {}
  dialogTitle.value = '新增用户'
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  formData.value = { ...row }
  dialogTitle.value = '编辑用户'
  dialogVisible.value = true
}

// 查看用户
const handleView = (row) => {
  formData.value = { ...row, readonly: true }
  dialogTitle.value = '查看用户'
  dialogVisible.value = true
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该用户?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }
  
  ElMessageBox.confirm(`确认删除选中的 ${selectedRows.value.length} 条数据?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const ids = selectedRows.value.map(item => item.id)
    await deleteUser(ids)
    ElMessage.success('批量删除成功')
    fetchData()
  }).catch(() => {})
}

// 状态变更
const handleStatusChange = async (row, status) => {
  try {
    await updateUserStatus(row.id, status)
    ElMessage.success(`${status ? '启用' : '禁用'}成功`)
  } catch (error) {
    // 回滚UI状态
    row.status = status ? 0 : 1
    console.error('更新状态失败:', error)
  }
}

// 表单提交成功回调
const handleSuccess = () => {
  fetchData()
  dialogVisible.value = false
}

onMounted(() => {
  fetchData()
})
</script>
```
### 与其他组件配合使用
BaseTable 组件设计为可以与 SearchForm 组件无缝配合，实现完整的"搜索+表格+分页"功能模式。通过组合这两个组件，可以快速构建出符合业务需求的数据展示页面。
组件扩展
### 如果有特殊需求，可以通过以下方式扩展组件功能：
使用 v-bind="$attrs" 传递额外的 Element Plus Table 属性
利用自定义插槽实现复杂的列内容渲染
在父组件中处理更复杂的数据交互逻辑
