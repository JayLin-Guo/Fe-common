import { ref, h } from 'vue';
import { TableColumn } from '@jr/ui-components';

export function useTableData() {
  // 表格数据
  const tableData = ref<TableColumn[]>([
    {
      id: 1,
      name: '张三',
      age: 25,
      address: '北京市朝阳区',
      status: '在职',
      description: '前端开发工程师，负责Vue项目开发',
      cleanText: '',
    },
    {
      id: 2,
      name: '李四',
      age: 30,
      address: '上海市浦东区',
      status: '离职',
      description: '后端开发工程师，负责Java后台开发',
      cleanText: '',
    },
    {
      id: 3,
      name: '王五',
      age: 28,
      address: '广州市天河区',
      status: '在职',
      description: '产品经理，负责产品需求分析',
      cleanText: '',
    },
    {
      id: 4,
      name: '赵六',
      age: 32,
      address: '深圳市南山区',
      status: '在职',
      description: 'UI设计师，负责界面设计',
      cleanText: '',
    },
    {
      id: 5,
      name: '钱七',
      age: 27,
      address: '杭州市西湖区',
      status: '离职',
      description: '测试工程师，负责系统测试',
      cleanText: '',
    },
    {
      id: 6,
      name: '孙八',
      age: 35,
      address: '南京市江宁区',
      status: '在职',
      description: '项目经理，负责项目管理和协调',
      cleanText: '',
    },
  ]);

  // 表格列配置
  const tableColumns = ref([
    { type: 'checkbox' as const, label: '', width: '50px' },
    { type: 'index' as const, label: '序号', width: '70px' },
    { prop: 'id', label: 'ID', width: '80px' },
    {
      prop: 'name',
      label: '姓名',
      width: '120px',
      headerSlot: 'nameHeader',
    },
    {
      prop: 'age',
      label: '年龄',
      width: '100px',
      headerRender: (column: TableColumn, index: number) =>
        h('div', { class: 'custom-header' }, [
          h('span', { style: { color: '#409eff' } }, column.label),
          h('el-icon', { style: { marginLeft: '4px' } }, [h('InfoFilled')]),
        ]),
    },
    {
      prop: 'status',
      label: '状态',
      width: '100px',
      headerRender: (column, index) => `
        <div style="display: flex; align-items: center; justify-content: center;">
          <span style="color: #67c23a; font-weight: bold;">${column.label}</span>
          <span style="margin-left: 4px; font-size: 12px; color: #909399;">📊</span>
        </div>
      `,
    },
    {
      prop: 'address',
      label: '地址',
      width: '200px',
      headerRender: (column, index) => `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 4px;
          font-size: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        ">
          <span>🏠</span>
          <span style="margin-left: 4px;">${column.label}</span>
        </div>
      `,
    },
    { prop: 'phone', label: '电话', width: '140px' },
    { prop: 'idCard', label: '身份证号', width: '180px' },
    {
      prop: 'position',
      label: '职位',
      width: '150px',
      headerRender: (column, index) =>
        h(
          'div',
          {
            class: 'sortable-header',
            onClick: () => handleSort(column.prop),
          },
          [
            h('span', column.label),
            h('div', { class: 'sort-icons' }, [
              h('el-icon', { class: 'sort-icon' }, [h('CaretTop')]),
              h('el-icon', { class: 'sort-icon' }, [h('CaretBottom')]),
            ]),
          ]
        ),
    },
    {
      prop: 'description',
      label: '描述',
      width: '250px',
      type: 'textarea' as const,
      headerSlot: 'descriptionHeader',
      textareaConfig: {
        placeholder: '请输入描述信息...',
        rows: 3,
        autoResize: true,
        showCount: true,
        maxlength: 200,
        formatter: (value: string) => {
          return value.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim();
        },
        enablePasteFormatter: true,
      },
    },
    {
      prop: 'cleanText',
      label: '纯净文本',
      width: '200px',
      type: 'textarea' as const,
      textareaConfig: {
        placeholder: '粘贴任何文本，会自动清理格式...',
        rows: 2,
        autoResize: true,
        showCount: false,
        formatter: (value: string) => {
          return value
            .replace(/[\s\n\r\t]+/g, '')
            .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
        },
        enablePasteFormatter: true,
      },
    },
  ]);

  // 排序处理函数
  function handleSort(prop: string | undefined) {
    if (!prop) return;
    console.log('排序列:', prop);
  }

  // 更新表格数据的方法
  function updateTableData(updates: any[]) {
    updates.forEach(update => {
      if (tableData.value[update.rowIndex]) {
        tableData.value[update.rowIndex][update.prop] = update.newValue;
      }
    });
  }

  return {
    tableData,
    tableColumns,
    handleSort,
    updateTableData,
  };
}
