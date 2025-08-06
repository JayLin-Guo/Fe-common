<template>
  <div class="demo-container">
    <div class="demo-section">
      <h4>分页表格</h4>
      <div class="demo-item">
        <BaseTable
          :data="tableData"
          :config="tableConfig"
          :total="100"
          v-model="paginationParams"
          @changePage="handleTableSearch"
        >
          <template #action="{ row }">
            <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
          </template>
        </BaseTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { BaseTable } from '@jr/ui-components';

const tableData = ref([
  { id: 1, name: '张三', age: 25, city: '北京' },
  { id: 2, name: '李四', age: 30, city: '上海' },
  { id: 3, name: '王五', age: 28, city: '广州' },
  { id: 4, name: '钱七', age: 22, city: '杭州' },
]);

const tableConfig = ref({
  tableColumn: [
    { prop: 'id', label: 'ID', width: 80 },
    { prop: 'name', label: '姓名', width: 120 },
    { prop: 'age', label: '年龄' },
    { prop: 'city', label: '城市' },
    { prop: '', label: '操作', slotName: 'action' },
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

const handleTableSearch = params => {
  console.log('表格搜索:', params);
};

const handleEdit = row => {
  console.log('编辑:', row);
};
</script>

<style lang="scss" scoped>
.demo-container {
  .demo-section {
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
}
</style>
