<template>
  <el-table border stripe :data="data" v-bind="$attrs">
    <template v-for="(item, index) in config.tableColumn" :key="index">
      <!-- 特殊列类型：selection, index, expand -->
      <el-table-column
        v-if="isSpecialColumn(item)"
        v-bind="getColumnProps(item)"
      >
        <template #default="scope" v-if="item.type === 'index'">
          {{ getIndexNumber(scope.$index) }}
        </template>
        <template #default="scope" v-else-if="item.type === 'expand'">
          <slot :name="item.slotName" :row="scope.row" :i="scope.$index">
            {{ getCellValue(scope.row, item) }}
          </slot>
        </template>
      </el-table-column>

      <!-- 包含子列的列 -->
      <el-table-column v-else-if="item.children" v-bind="getColumnProps(item)">
        <el-table-column
          v-for="(el, i) in item.children"
          :key="i"
          v-bind="getColumnProps(el)"
        />
      </el-table-column>

      <!-- 自定义插槽列 -->
      <el-table-column v-else-if="item.slotName" v-bind="getColumnProps(item)">
        <template #header="scope">
          <slot
            :name="item.slotName + 'Header'"
            :row="scope.row"
            :i="scope.$index"
            :index="scope.$index"
            :scope="scope"
          >
            {{ item?.label }}
          </slot>
        </template>
        <template #default="scope">
          <slot
            :name="item.slotName"
            :row="scope.row"
            :i="scope.$index"
            :index="scope.$index"
            :scope="scope"
          >
            {{ getCellValue(scope.row, item) }}
          </slot>
        </template>
      </el-table-column>

      <!-- 普通列 -->
      <el-table-column v-else v-bind="getColumnProps(item)" />
    </template>
  </el-table>

  <div v-show="total && total > 0">
    <el-pagination
      :pager-count="5"
      :layout="
        config?.pagingColumn?.layout || 'total,prev, pager, next, sizes,jumper'
      "
      v-model:page-size="params.limit"
      :page-sizes="config?.pagingColumn?.pageSizes || [10, 20, 30, 40]"
      :total="total"
      v-model:current-page="params.page"
      popper-class="cui-diypage"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BaseTable',
});
import { ref, computed, watch, type PropType } from 'vue';
import type {
  TableConfig,
  PaginationParams,
  TableColumn,
  BaseTableEmits,
} from './type';

// 定义 props 使用更严格的类型
const props = defineProps({
  /** 表格数据 */
  data: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
    required: true,
  },
  /** 分页参数（双向绑定） */
  modelValue: {
    type: Object as PropType<PaginationParams>,
    default: () => ({
      page: 1,
      limit: 10,
    }),
  },
  /** 总条目数 */
  total: {
    type: Number,
    default: 0,
  },
  /** 表格配置 */
  config: {
    type: Object as PropType<TableConfig>,
    default: () => ({
      tableColumn: [],
      pagingColumn: {
        layout: 'total,prev, pager, next, sizes,jumper',
        pageSizes: [10, 20, 30, 40],
      },
    }),
    required: true,
  },
  /** 是否显示加载中 */
  loading: {
    type: Boolean,
    default: false,
  },
  /** 表格高度 */
  height: {
    type: [String, Number] as PropType<string | number>,
  },
  /** 表格最大高度 */
  maxHeight: {
    type: [String, Number] as PropType<string | number>,
  },
  /** 是否显示表头 */
  showHeader: {
    type: Boolean,
    default: true,
  },
  /** 空数据时显示的文本内容 */
  emptyText: {
    type: String,
    default: '暂无数据',
  },
});

// 使用接口定义 emits
const emits = defineEmits<BaseTableEmits>();

const params = ref<PaginationParams>({
  page: props.modelValue?.page || 1,
  limit: props.modelValue?.limit || 10,
});

// 判断是否为特殊列类型
const isSpecialColumn = (item: TableColumn) => {
  return ['selection', 'index', 'expand'].includes(item.type || '');
};

// 获取列属性配置
const getColumnProps = (item: TableColumn) => {
  const commonProps = {
    prop: item.prop,
    label: item.label,
    width: item.width,
    minWidth: item.minWidth,
    maxWidth: item.maxWidth,
    align: item.align,
    showOverflowTooltip: item.showOverflowTooltip,
    ...item.columnProps,
  };

  // 特殊列类型的特殊处理
  switch (item.type) {
    case 'selection':
      return {
        type: 'selection',
        width: 40,
        align: item.align || 'center',
        ...item.columnProps,
      };
    case 'index':
      return {
        type: 'index',
        label: item.label,
        width: item.width,
        align: item.align || 'center',
      };
    case 'expand':
      return {
        type: 'expand',
        width: item.width,
        align: item.align,
      };
    default:
      return commonProps;
  }
};

// 获取序号
const getIndexNumber = (index: number) => {
  const currentPage: number = params.value.page || 1;
  return (
    params.value.limit && params.value.limit * (currentPage - 1) + index + 1
  );
};

// 获取单元格值（类型安全）
const getCellValue = (row: any, item: TableColumn) => {
  const key = item.prop || item.slotName;
  return key ? (row[key] ?? '') : '';
};

// 监听分页参数变化
watch(
  () => params.value,
  () => {
    if (props.modelValue) {
      emits('update:modelValue', Object.assign(props.modelValue, params.value));
    }
    emits('search', params.value);
    emits('changePage', params.value);
  },
  {
    deep: true,
  }
);
</script>

<style lang="scss" scoped></style>
