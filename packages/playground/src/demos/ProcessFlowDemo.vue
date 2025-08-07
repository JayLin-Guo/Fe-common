<template>
  <div class="process-flow-demo">
    <h2>🔄 ProcessFlow 流程组件演示</h2>

    <!-- 基础用法 -->
    <div class="demo-section">
      <h3>📦 基础用法</h3>
      <p>展示基本的横向流程，带有鱼尾箭头连接</p>
      <div class="demo-container">
        <BizProcessFlow :steps="basicSteps" @step-click="handleStepClick" />
      </div>
    </div>

    <!-- 字段配置演示 -->
    <div class="demo-section">
      <h3>⚙️ 字段配置演示</h3>
      <p>使用自定义字段名称，展示组件的灵活性</p>
      <div class="demo-container">
        <BizProcessFlow
          :steps="customFieldSteps"
          :field-config="customFieldConfig"
          @step-click="handleStepClick"
        />
      </div>
      <div class="config-info">
        <h4>配置说明：</h4>
        <pre>{{ JSON.stringify(customFieldConfig, null, 2) }}</pre>
        <h4>数据结构示例：</h4>
        <pre>{{ JSON.stringify(customFieldSteps[0], null, 2) }}</pre>
      </div>
    </div>

    <!-- 订单流程 -->
    <div class="demo-section">
      <h3>🛒 订单流程示例</h3>
      <p>模拟电商订单的完整流程</p>
      <div class="demo-container">
        <BizProcessFlow
          :steps="orderSteps"
          @step-click="handleOrderStepClick"
        />
      </div>
      <div class="demo-actions">
        <el-button type="primary" @click="simulateOrderProgress"
          >模拟订单进度</el-button
        >
        <el-button @click="resetOrderSteps">重置状态</el-button>
      </div>
    </div>

    <!-- 自定义图标 -->
    <div class="demo-section">
      <h3>🎭 自定义图标</h3>
      <p>使用 Iconify 图标库的自定义图标</p>
      <div class="demo-container">
        <BizProcessFlow :steps="iconSteps" @step-click="handleStepClick" />
      </div>
    </div>

    <!-- 项目开发流程 -->
    <div class="demo-section">
      <h3>💻 项目开发流程</h3>
      <p>展示软件开发的各个阶段</p>
      <div class="demo-container">
        <BizProcessFlow :steps="devSteps" @step-click="handleStepClick" />
      </div>
    </div>

    <!-- 垂直布局 -->
    <div class="demo-section">
      <h3>📐 垂直布局</h3>
      <p>适用于侧边栏或高度较大的区域</p>
      <div class="demo-container vertical-demo">
        <BizProcessFlow
          :steps="verticalSteps"
          vertical
          @step-click="handleStepClick"
        />
      </div>
    </div>

    <!-- 错误状态演示 -->
    <div class="demo-section">
      <h3>❌ 错误状态演示</h3>
      <p>展示流程中出现错误的情况</p>
      <div class="demo-container">
        <BizProcessFlow :steps="errorSteps" @step-click="handleStepClick" />
      </div>
    </div>

    <!-- 文本溢出演示 -->
    <div class="demo-section">
      <h3>📝 文本溢出演示</h3>
      <p>标题和描述过长时会显示省略号，鼠标悬停显示完整内容</p>
      <div class="demo-container">
        <BizProcessFlow :steps="overflowSteps" @step-click="handleStepClick" />
      </div>
    </div>

    <!-- 交互控制 -->
    <div class="demo-section">
      <h3>🎮 交互控制</h3>
      <p>动态修改步骤状态</p>
      <div class="demo-container">
        <BizProcessFlow
          :steps="interactiveSteps"
          @step-click="handleInteractiveStepClick"
        />
      </div>
      <div class="demo-actions">
        <el-button
          v-for="(step, index) in interactiveSteps"
          :key="index"
          :type="getButtonType(step.status || 'pending')"
          size="small"
          @click="toggleStepStatus(index)"
        >
          {{ step.title }}: {{ step.status || 'pending' }}
        </el-button>
      </div>
    </div>

    <!-- 事件日志 -->
    <div class="demo-section" v-if="eventLogs.length > 0">
      <h3>📝 事件日志</h3>
      <div class="event-logs">
        <div v-for="(log, index) in eventLogs" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-content">{{ log.content }}</span>
        </div>
      </div>
      <el-button size="small" @click="clearLogs">清空日志</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
// import ProcessFlow from '../../../ui-components/src/ProcessFlow/index.vue';
import { BizProcessFlow } from '@jr/ui-components';
import type {
  ProcessStep,
  FieldConfig,
} from '../../../ui-components/src/ProcessFlow/types';

// 事件日志
const eventLogs = ref<Array<{ time: string; content: string }>>([]);

const addLog = (content: string) => {
  console.log(content, 'content===>>');
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    content,
  });
  if (eventLogs.value.length > 10) {
    eventLogs.value.pop();
  }
};

const clearLogs = () => {
  eventLogs.value = [];
};

// 基础步骤
const basicSteps = ref<ProcessStep[]>([
  {
    id: 1,
    title: 'Saturn阿阿阿阿阿阿阿阿人人人人人人人人人',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Jupiter',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Venus',
    status: 'active',
  },
  {
    id: 4,
    title: 'Mercury',
    status: 'pending',
  },
  {
    id: 5,
    title: 'Mars',
    status: 'pending',
  },
]);

// 订单流程
const orderSteps = ref<ProcessStep[]>([
  {
    id: 'order',
    title: '提交订单',
    description: '用户提交订单信息',
    status: 'completed',
    icon: 'carbon:shopping-cart',
  },
  {
    id: 'payment',
    title: '支付确认',
    description: '等待支付确认',
    status: 'completed',
    icon: 'carbon:payment',
  },
  {
    id: 'shipping',
    title: '商品发货',
    description: '商家准备发货',
    status: 'active',
    icon: 'carbon:delivery-truck',
  },
  {
    id: 'delivery',
    title: '配送中',
    description: '商品配送中',
    status: 'pending',
    icon: 'carbon:delivery',
  },
  {
    id: 'received',
    title: '确认收货',
    description: '用户确认收货',
    status: 'disabled',
    icon: 'carbon:checkmark-filled',
  },
]);

// 自定义图标步骤
const iconSteps = ref<ProcessStep[]>([
  {
    title: '设计',
    description: 'UI/UX 设计',
    status: 'completed',
    icon: 'carbon:design',
  },
  {
    title: '开发',
    description: '功能开发',
    status: 'active',
    icon: 'carbon:code',
  },
  {
    title: '测试',
    description: '质量测试',
    status: 'pending',
    icon: 'carbon:test-tool',
  },
  {
    title: '发布',
    description: '产品发布',
    status: 'disabled',
    icon: 'carbon:rocket',
  },
]);

// 项目开发流程
const devSteps = ref<ProcessStep[]>([
  {
    title: '需求分析',
    description: '分析业务需求',
    status: 'completed',
    icon: 'carbon:document',
  },
  {
    title: '架构设计',
    description: '系统架构设计',
    status: 'completed',
    icon: 'carbon:architecture',
  },
  {
    title: '编码实现',
    description: '功能开发编码',
    status: 'active',
    icon: 'carbon:code',
  },
  {
    title: '测试验证',
    description: '功能测试验证',
    status: 'pending',
    icon: 'carbon:test-tool',
  },
  {
    title: '部署上线',
    description: '生产环境部署',
    status: 'disabled',
    icon: 'carbon:cloud-upload',
  },
]);

// 垂直布局步骤
const verticalSteps = ref<ProcessStep[]>([
  {
    title: '用户注册',
    description: '填写基本信息',
    status: 'completed',
  },
  {
    title: '邮箱验证',
    description: '验证邮箱地址',
    status: 'completed',
  },
  {
    title: '完善资料',
    description: '补充个人信息',
    status: 'active',
  },
  {
    title: '开始使用',
    description: '进入主界面',
    status: 'pending',
  },
]);

// 错误状态步骤
const errorSteps = ref<ProcessStep[]>([
  {
    title: '数据准备',
    description: '准备处理数据',
    status: 'completed',
  },
  {
    title: '数据处理',
    description: '处理业务数据',
    status: 'completed',
  },
  {
    title: '数据验证',
    description: '验证数据完整性',
    status: 'error',
  },
  {
    title: '结果输出',
    description: '输出处理结果',
    status: 'disabled',
  },
]);

// 交互控制步骤
const interactiveSteps = ref<ProcessStep[]>([
  {
    title: '步骤 1',
    description: '点击按钮切换状态',
    status: 'pending',
  },
  {
    title: '步骤 2',
    description: '点击按钮切换状态',
    status: 'pending',
  },
  {
    title: '步骤 3',
    description: '点击按钮切换状态',
    status: 'pending',
  },
]);

// 自定义字段配置演示
const customFieldConfig: FieldConfig = {
  titleField: 'name',
  descriptionField: 'desc',
  statusField: 'state',
  iconField: 'iconName',
  idField: 'key',
};

const customFieldSteps = ref([
  {
    key: 'step1',
    name: '需求分析',
    desc: '收集和分析业务需求',
    state: 'completed',
    iconName: 'carbon:document',
  },
  {
    key: 'step2',
    name: '系统设计',
    desc: '设计系统架构和接口',
    state: 'active',
    iconName: 'carbon:blueprint',
  },
  {
    key: 'step3',
    name: '开发实现',
    desc: '编码实现功能模块',
    state: 'pending',
    iconName: 'carbon:code',
  },
  {
    key: 'step4',
    name: '测试验收',
    desc: '测试功能并验收',
    state: 'pending',
    iconName: 'carbon:test-tool',
  },
]);

// 文本溢出演示
const overflowSteps = ref<ProcessStep[]>([
  {
    id: 1,
    title: '这是一个非常长的标题用来测试文本溢出效果和省略号显示功能',
    description:
      '这是一个超级长的描述文本，用来演示当描述内容过长时组件如何处理文本溢出，显示省略号并通过鼠标悬停展示完整内容',
    status: 'completed',
  },
  {
    id: 2,
    title: '中等长度的标题测试',
    description: '中等长度的描述内容',
    status: 'active',
  },
  {
    id: 3,
    title: '短标题',
    description: '短描述',
    status: 'pending',
  },
  {
    id: 4,
    title: '超长业务流程处理步骤标题演示',
    description:
      '这里展示了一个业务流程中可能出现的超长描述内容，包含详细的操作说明和注意事项',
    status: 'pending',
  },
]);

// 事件处理
const handleStepClick = (step: ProcessStep, index: number) => {
  console.log(step, index, 'step===>>');
  addLog(`点击了步骤: ${step.title} (索引: ${index})`);
};

const handleOrderStepClick = (step: ProcessStep, index: number) => {
  addLog(`点击了订单步骤: ${step.title}`);
};

const handleInteractiveStepClick = (step: ProcessStep, index: number) => {
  toggleStepStatus(index);
  addLog(`交互点击: ${step.title} -> ${step.status}`);
};

// 模拟订单进度
let orderProgressTimer: NodeJS.Timeout | null = null;

const simulateOrderProgress = () => {
  if (orderProgressTimer) {
    clearInterval(orderProgressTimer);
  }

  let currentStep = 0;
  const statusFlow = ['active', 'completed'];

  orderProgressTimer = setInterval(() => {
    if (currentStep < orderSteps.value.length - 1) {
      // 设置当前步骤为完成
      orderSteps.value[currentStep].status = 'completed';

      // 设置下一步为活跃
      currentStep++;
      if (currentStep < orderSteps.value.length) {
        orderSteps.value[currentStep].status = 'active';
        addLog(`订单进度更新: ${orderSteps.value[currentStep].title}`);
      }
    } else {
      // 最后一步完成
      orderSteps.value[currentStep].status = 'completed';
      addLog('订单流程完成！');
      clearInterval(orderProgressTimer!);
      orderProgressTimer = null;
    }
  }, 2000);
};

const resetOrderSteps = () => {
  if (orderProgressTimer) {
    clearInterval(orderProgressTimer);
    orderProgressTimer = null;
  }

  orderSteps.value.forEach((step, index) => {
    if (index === 0) {
      step.status = 'completed';
    } else if (index === 1) {
      step.status = 'completed';
    } else if (index === 2) {
      step.status = 'active';
    } else {
      step.status = index === 3 ? 'pending' : 'disabled';
    }
  });
  addLog('订单状态已重置');
};

// 切换步骤状态
const toggleStepStatus = (index: number) => {
  const step = interactiveSteps.value[index];
  const statuses: ProcessStep['status'][] = [
    'pending',
    'active',
    'completed',
    'error',
    'disabled',
  ];
  const currentIndex = statuses.indexOf(step.status);
  const nextIndex = (currentIndex + 1) % statuses.length;
  step.status = statuses[nextIndex];
};

// 获取按钮类型
const getButtonType = (status: string) => {
  switch (status) {
    case 'active':
      return 'primary';
    case 'completed':
      return 'success';
    case 'error':
      return 'danger';
    case 'disabled':
      return 'info';
    default:
      return 'default';
  }
};
</script>

<style lang="scss" scoped>
.process-flow-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    color: #2c3e50;
    margin-bottom: 30px;
    text-align: center;
  }

  .demo-section {
    margin-bottom: 40px;
    padding: 20px;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    background: #fafbfc;

    h3 {
      color: #409eff;
      margin-bottom: 10px;
      border-bottom: 2px solid #409eff;
      padding-bottom: 5px;
    }

    p {
      color: #606266;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .demo-container {
      background: white;
      padding: 30px 20px;
      border-radius: 6px;
      border: 1px solid #ebeef5;
      margin-bottom: 15px;

      &.vertical-demo {
        height: 400px;
        display: flex;
        justify-content: center;
      }
    }

    .demo-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 15px;
    }
  }

  .event-logs {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 15px;
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 10px;

    .log-item {
      display: flex;
      gap: 10px;
      margin-bottom: 8px;
      font-size: 13px;

      &:last-child {
        margin-bottom: 0;
      }

      .log-time {
        color: #6c757d;
        font-family: monospace;
        min-width: 80px;
      }

      .log-content {
        color: #495057;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .process-flow-demo {
    padding: 10px;

    .demo-section {
      padding: 15px;

      .demo-container {
        padding: 20px 10px;

        &.vertical-demo {
          height: 300px;
        }
      }
    }
  }

  .config-info {
    margin-top: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;

    h4 {
      margin: 0 0 10px 0;
      color: #495057;
      font-size: 14px;
      font-weight: 600;
    }

    pre {
      background: #ffffff;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 12px;
      margin: 0 0 16px 0;
      font-size: 12px;
      line-height: 1.4;
      color: #495057;
      overflow-x: auto;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
