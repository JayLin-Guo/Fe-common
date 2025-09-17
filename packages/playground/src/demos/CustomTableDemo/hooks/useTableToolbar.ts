import { ref } from 'vue';

export function useTableToolbar() {
  // Toolbar 相关配置
  const showToolbar = ref(true);
  const toolbarConfig = ref({
    title: '',
    description: '按 Ctrl+V 可批量粘贴数据',
    showAreaSelectionToggle: true,
    showTableInfo: true,
    showSelectionInfo: true,
    showRefresh: true,
    showSettings: true,
  });

  // Toolbar 事件处理方法
  function onAreaSelectionToggle(
    value: boolean,
    enableAreaSelection: any,
    eventInfo: any
  ) {
    enableAreaSelection.value = value;
    eventInfo.value = `区域选择开关已${value ? '开启' : '关闭'}`;
    console.log('区域选择开关切换:', value);
  }

  function onToolbarRefresh(eventInfo: any) {
    eventInfo.value = '刷新表格数据...';
    console.log('工具栏刷新按钮被点击');

    // 模拟刷新操作
    setTimeout(() => {
      eventInfo.value = '表格数据刷新完成';
    }, 1000);
  }

  function onToolbarSettings(eventInfo: any) {
    eventInfo.value = '打开表格设置...';
    console.log('工具栏设置按钮被点击');
  }

  return {
    showToolbar,
    toolbarConfig,
    onAreaSelectionToggle,
    onToolbarRefresh,
    onToolbarSettings,
  };
}
