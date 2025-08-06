<!-- Created by 337547038 on 2021/6/1 0001. -->
<template>
  <div class="sidebar-tools">
    <el-tabs v-model="state.tabsName">
      <el-tab-pane label="属性配置" name="first">
        <el-form size="small" class="form" label-position="top" inline label-width="120">
          <!-- <div class="h3">
            <h3>通用属性</h3>
          </div> -->

          <template v-for="(item, index) in attrList" :key="index">
            <el-form-item :label="item.label">
              <el-select
                v-if="item.type === 'select' && controlData.type !== 'table' && controlData.type !== 'grid'"
                :placeholder="item.placeholder"
                v-model="item.value"
                :filterable="item.path === 'name'"
                :allow-create="item.path === 'name'"
                :clearable="item.clearable"
                @change="controlChange(item, $event)">
                <el-option
                  v-for="(opt, key) in item.dict"
                  :key="key"
                  :value="item.path === 'name' ? opt.name : key"
                  :label="item.path === 'name' ? `${opt.label}(${opt.name})` : opt" />
              </el-select>
              <!-- 栅格特殊配置 -->
              <el-select
                v-else-if="item.type === 'select' && controlData.type === 'grid'"
                :placeholder="item.placeholder"
                v-model="controlData.control.span"
                filterable
                clearable
                placement="bottom"
                @change="handleUpdateConfig(item, $event)">
                <el-option v-for="(opt, key) in item.dict" :key="key" :value="opt.value" :label="opt.label" />
              </el-select>

              <!-- TAble特殊配置 -->
              <el-select
                v-else-if="item.type === 'select' && controlData.type === 'table'"
                :placeholder="item.placeholder"
                v-model="controlData.list"
                filterable
                multiple
                collapse-tags
                collapse-tags-tooltip
                clearable
                placement="bottom">
                <el-option-group v-for="group in item.dict" :key="group.label" :label="group.label">
                  <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item" />
                </el-option-group>
              </el-select>

              <el-switch v-else-if="item.type === 'switch'" v-model="item.value" @change="controlChange(item, $event)" />
              <el-input v-else :type="item.inputStyle" v-model="item.value" :placeholder="item.placeholder" @input="controlChange(item, $event)" />
            </el-form-item>
          </template>
          <!-- TAbS特殊配置 -->
          <template v-if="showHide(['tabs'], true)">
            <div class="h3">
              <h3>标签配置项</h3>
            </div>
            <el-form-item v-for="(item, index) in controlData.columns" :key="index">
              <el-col :span="12">
                <el-input placeholder="标签配置项" v-model="item.label" />
              </el-col>
              <el-col :span="2" :offset="1">
                <i class="icon-del" @click="delSelectOption(index, 'tabs')"></i>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button @click="addSelectOption('tabs')">增加标签</el-button>
            </el-form-item>
          </template>

          <!-- 下拉选项 多选配置 -->
          <!-- <div
            v-if="
              showHide(
                [
                  'radio',
                  'select',
                  'checkbox',
                  'cascader',
                  'inputSlot',
                  'treeSelect',
                ],
                true
              )
            "
          >
            <div class="h3">
              <h3>选项配置</h3>
            </div>
            <el-form-item label="添加全部项" v-if="showHide(['select'], true)">
              <el-input
                placeholder="请输入全部项文案"
                v-model="controlData.config.addAll"
              />
            </el-form-item>
            <el-form-item label="选项数据源">
              <el-select
                v-model="controlData.config.optionsType"
                @change="controlData.config.optionsFun = ''"
              >
                <el-option :value="0" label="固定选项" />
                <el-option :value="1" label="数据源" />
                <el-option :value="2" label="接口字典" />
              </el-select>
            </el-form-item>
            <template v-if="controlData.config.optionsType === 0">
              <div v-if="controlData.type !== 'cascader'">
                <el-form-item
                  v-for="(item, index) in controlData.options"
                  :key="index"
                >
                  <el-col :span="10">
                    <el-input placeholder="选项标签" v-model="item.label" />
                  </el-col>
                  <el-col :span="10" :offset="1">
                    <el-input placeholder="选项值" v-model="item.value" />
                  </el-col>
                  <el-col :span="2" :offset="1">
                    <i class="icon-del" @click="delSelectOption(index)"></i>
                  </el-col>
                </el-form-item>
              </div>
              <el-form-item>
                <el-button @click="addSelectOption"
                  >{{ controlData.type === "cascader" ? "编辑" : "新增" }}
                </el-button>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item>
                <el-input
                  v-model="controlData.config.optionsFun"
                  :placeholder="
                    getOptionPlaceholder(controlData.config.optionsType)
                  "
                >
                  <template
                    #prepend
                    v-if="controlData.config.optionsType === 1"
                  >
                    <el-select
                      v-model="controlData.config.method"
                      style="width: 80px"
                    >
                      <el-option label="get" value="get" />
                      <el-option label="post" value="post" />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <template v-if="controlData.config.optionsType === 1">
                <el-form-item label="指定label属性值">
                  <el-input
                    v-model="controlData.config.label"
                    placeholder="返回数据中没有label时可设置"
                  />
                </el-form-item>
                <el-form-item label="指定value属性值">
                  <el-input
                    v-model="controlData.config.value"
                    placeholder="返回数据中没有value时可设置"
                  />
                </el-form-item>
              </template>
              <el-form-item v-if="controlData.config.optionsType === 1">
                <el-button @click="openAttrDialog('optionsParams')"
                  >beforeFetch
                </el-button>
                <el-button @click="openAttrDialog('optionsResult')"
                  >afterFetch
                </el-button>
              </el-form-item>
            </template>
            <el-form-item label="尝试转换value值为">
              <el-select
                v-model="controlData.config.transformData"
                placeholder="默认为number"
              >
                <el-option value="none">不转换</el-option>
                <el-option value="number">number</el-option>
                <el-option value="string">string</el-option>
              </el-select>
            </el-form-item>
          </div> -->

          <!-- <template
            v-if="
              !state.isSearch &&
              showHide([
                'txt',
                'title',
                'table',
                'grid',
                'tabs',
                'card',
                'switch',
                'gridChild',
                'tableColumn',
                'divider',
                'div',
                'button',
              ])
            "
          >
            <div class="h3">
              <h3>校验设置</h3>
            </div>
            <div v-if="showHide(['input', 'password', 'component'], true)">
              <el-form-item
                v-for="(item, index) in controlData.customRules"
                :key="item.type"
              >
                <el-input v-model="item.message" placeholder="校验提示信息">
                  <template #prepend>
                    <el-select
                      v-model="item.type"
                      style="width: 80px"
                      @change="rulesSelectChange(item, $event)"
                    >
                      <el-option
                        v-for="list in state.customRulesList"
                        :key="list.type"
                        :label="list.label"
                        :value="list.type"
                      />
                    </el-select>
                  </template>
                  <template #append>
                    <i class="icon-del" @click="delAddRules(index)"></i>
                  </template>
                </el-input>
                <el-input
                  placeholder="正则表达式"
                  v-model="item.rules"
                  v-if="item.type === 'rules'"
                />
                <el-input
                  placeholder="方法名称，此方法仅适用于导出vue文件"
                  v-model="item.methods"
                  v-if="item.type === 'methods'"
                />
              </el-form-item>
              <el-form-item>
                <el-button @click="addRulesFast">快速添加</el-button>
                <el-button @click="openAttrDialog('editRules')"
                  >编写校验规则
                </el-button>
              </el-form-item>
            </div>
            <el-form-item v-else>
              <el-checkbox
                :modelValue="checkboxRequired"
                @change="requiredChange"
                >必填
              </el-checkbox>
              <el-input
                placeholder="自定义必填错误提示"
                v-model="controlData.item.rules[0].message"
                v-if="controlData.item?.rules && controlData.item?.rules[0]"
              />
            </el-form-item>
          </template> -->
          <!-- <div v-if="showHide(['grid', 'card', 'gridChild', 'divider', 'div'])">
            <div class="h3">
              <h3>其他属性</h3>
            </div>

            <el-button size="small" @click="openAttrDialog('editProps')"
              >编辑属性
            </el-button>
          </div> -->
        </el-form>
      </el-tab-pane>
      <!-- TODO： 暂时不需要这么多配置 -->
      <!-- <el-tab-pane label="表单配置" name="second">
        <el-form size="small" class="form" label-position="top" inline label-width="120">
          <el-form-item v-for="(item, index) in formAttr.filter(item => !item.hide)" :label="item.label" :key="index">
            <el-select v-if="item.type === 'select'" v-model="item.value" :filterable="item.key === 'class'"
              :allow-create="item.key === 'class'" :placeholder="item.placeholder" :clearable="item.clearable"
              @change="formAttrChange(item)">
              <el-option :label="opt.label || opt.name" v-for="opt in item.options" :key="opt.label || opt.name"
                :value="formatNumber(opt.value ?? opt.id)" />
            </el-select>
            <el-switch v-else-if="item.type === 'switch'" v-model="item.value" @input="formAttrChange(item, $event)" />
            <el-input v-else v-model="item.value" :placeholder="item.placeholder" @input="formAttrChange(item)" />
          </el-form-item>
          <el-form-item v-if="!state.isSearch">
            <template #label>添加时获取请求
              <el-tooltip content="新增表单数据时，从接口获取新增初始数据" placement="top">
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <el-switch v-model="formConfig.addLoad" @change="
              formAttrChange({ key: 'addLoad', path: 'config' }, $event)
              " />
          </el-form-item>
          <el-form-item>
            <el-button @click="openAttrDialog('editCss')">编辑表单样式
            </el-button>
            <el-button @click="openAttrDialog('editDict')">设置数据字典
            </el-button>
          </el-form-item>
          <template v-if="!state.isSearch">
            <div class="h3">
              <h3>接口数据事件</h3>
            </div>
            <el-form-item label="新增数据保存url">
              <el-input placeholder="表单提交的url，通用提交时可不设置" v-model="formConfig.submitUrl" />
            </el-form-item>
            <el-form-item label="修改数据保存url">
              <el-input placeholder="修改提交的url，通用提交时可不设置" v-model="formConfig.editUrl" />
            </el-form-item>
            <el-form-item label="获取表单数据url">
              <el-input placeholder="获取表单数据url，通用提交时可不设置" v-model="formConfig.requestUrl" />
            </el-form-item>
            <el-form-item class="event-btn">
              <el-button @click="openAttrDialog('beforeFetch')">beforeFetch
              </el-button>
              <el-button @click="openAttrDialog('afterFetch')">afterFetch
              </el-button>
              <el-button @click="openAttrDialog('beforeSubmit')">beforeSubmit
              </el-button>
              <el-button @click="openAttrDialog('afterSubmit')">afterSubmit
              </el-button>
              <el-button @click="openAttrDialog('change')">表单组件改变事件change
              </el-button>
            </el-form-item>
          </template>
        </el-form>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script setup>
import { reactive, computed, toRefs, ref, watch, inject } from 'vue'
import { useDesignStore } from '@/piniaStore/modules/design'
import validate from '@/components/BizDesignForm/form/validate'
import { ElMessage } from 'element-plus'
import { formatNumber } from '../../utils/design'

import { defineProps, defineEmits } from 'vue'
import { useSchema } from '@/components/BizDesignForm/design/schema/useSchema'

const { getFormSchema, getTempSchema } = useSchema()
const props = defineProps({
  formData: null,
  formConfig: {
    type: Object,
    default: () => ({})
  },
  formOtherData: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['openDialog', 'update:formOtherData'])

const { formConfig, formData } = toRefs(props)
const store = useDesignStore()
//const route = useRoute()
const controlData = computed(() => {
  console.log(store.controlAttr, 'controlAttr==>>>>>')
  return store.controlAttr
})
const dataSourceOption = ref([])

// 表单属性配置
const formAttr = computed(() => {
  const isSearch = state.isSearch
  return getFormSchema(props, formData, formConfig, isSearch, dataSourceOption) || []
})
const attrList = computed(() => {
  if (Object.keys(controlData.value).length) {
    const { control = {}, type, name, config = {}, formItem = {}, attr = {} } = controlData.value
    let columnIndex = false // 是否显示序号列

    const temp = getTempSchema(name, config, state, control, formItem, type, attr, columnIndex)
    // 过滤显示对应的值
    return temp.filter(item => {
      let hasFilter = true
      if (item.vShow) {
        hasFilter = item.vShow.includes(type)
      }
      if (item.vHide) {
        hasFilter = !item.vHide.includes(type)
      }
      if (item.vIf) {
        // 不显示vif＝true的
        hasFilter = false
      }
      return hasFilter
    })
  } else {
    return []
  }
})
const designType = inject('formDesignType')
const state = reactive({
  dataSourceFiledList: [],
  customRulesList: [
    ...validate,
    {
      type: 'rules',
      label: '自定义正则'
    },
    {
      type: 'methods',
      label: '自定义方法'
    }
  ], // 自定义校验规则
  isSearch: designType === 'search',
  tabsName: 'first'
})
watch(
  () => store.activeKey,
  val => {
    if (val) {
      // 有值时自动跳到第一项
      state.tabsName = 'first'
    }
  }
)

const handleUpdateConfig = (obj, val) => {
  if (controlData.value.type === 'grid') {
    // 计算所需的元素数量
    const requiredCount = Math.ceil(24 / controlData.value.control.span)

    // 更新现有元素的 `span`
    controlData.value.columns.forEach(item => {
      item.attr.span = controlData.value.control.span
    })

    // 如果现有数量不足，补充元素
    while (controlData.value.columns.length < requiredCount) {
      controlData.value.columns.push({
        attr: { span: controlData.value.control.span },
        list: []
      })
    }

    // 如果超出数量，不做处理，或者可以裁剪多余元素
    controlData.value.columns = controlData.value.columns.slice(0, requiredCount)
  }
}

const controlChange = (obj, val) => {
  // select多选属性，
  switch (obj.eventName) {
    case 'selectMultiple':
      /*if (val) {
        // 多选，将值改为数组
        controlData.value.control.modelValue = []
      } else {
        // 单选
        controlData.value.control.modelValue = ''
      }*/
      controlData.value.control.modelValue = val ? [] : ''
      break
    case 'tableColumn1':
      tableColumnAdd(val)
      break
    case 'formatNumber':
      // val = parseInt(val) // 将值转数值
      break
    case 'filedNameKey':
      // 选择字段标识时，同时修改显示标题
      // 根据value找key
      if (obj.type === 'select') {
        state.dataSourceFiledList.forEach(item => {
          if (item.name === val) {
            if (controlData.value.formItem) {
              controlData.value.formItem.label = item.label
            }
            controlData.value.name = item.label
          }
        })
      }
      break
    case 'setInputSlot':
      if (val) {
        // 将类型改为inputSlot
        controlData.value.type = 'inputSlot'
        ElMessage.success(`请在对应的Input输入框属性前后缀设置key:${controlData.value.name}`)
      } else {
        controlData.value.type = 'select'
      }
      // 这里会报错Cannot set properties of null (setting 'checked')
      // 因value:type===inputSlot，这里使用了v-model，影响不大暂不处理
      break
  }
  if (obj.path) {
    const newVal = obj.isNum ? formatNumber(val) : val // 类型为数字时转整数
    obj.path && getPropByPath(controlData.value, obj.path, newVal)
  }
}
// 修改指定路径下的值
const getPropByPath = (obj, path, val) => {
  let tempObj = obj
  const keyArr = path.split('.')
  let i = 0
  for (i; i < keyArr.length - 1; i++) {
    const key = keyArr[i]
    if (key in tempObj) {
      tempObj = tempObj[key]
    } else {
      throw new Error(`${key} is undefined`)
      // break
    }
  }
  const key = keyArr[i]
  const value = tempObj[keyArr[i]]
  // 检查最后一级是否存在
  /*if (!(key in tempObj)) {
  throw new Error(`${key} is undefined`)
}*/
  if (val !== undefined) {
    tempObj[key] = val
  }
  return {
    obj: tempObj,
    key: key,
    value: value
  }
}
// 属性设置相关结束
// 多选固定选项删除
const delSelectOption = (index, type) => {
  if (type === 'tabs') {
    controlData.value.columns.splice(index, 1)
  } else {
    controlData.value.options.splice(index, 1)
  }
}
// 多选固定选项增加
const addSelectOption = type => {
  const cType = controlData.value.type
  if (cType === 'cascader') {
    // 级联时打开弹窗口
    openAttrDialog('cascader')
  } else if (cType === 'treeSelect') {
    openAttrDialog('treeSelect')
  } else {
    if (type === 'tabs') {
      controlData.value.columns.push({
        label: '标签名称',
        list: []
      })
    } else {
      controlData.value.options.push({
        label: '',
        value: ''
      })
    }
  }
}
/**
 * 打开编辑器事件
 * @param type
 */
const openAttrDialog = type => {
  let editData = controlData.value.control
  const { type: cType, config, options, control } = controlData.value
  let codeType = ''
  if (cType === 'button') {
    // 按钮组件编辑属性
    editData = config
    type = 'button'
  }
  switch (type) {
    case 'editCss':
      codeType = 'css'
      break
    case 'editDict':
      codeType = 'json'
      break
    case 'editRules':
      editData = controlData.value.formItem?.rules || []
      break
    case 'treeSelect':
      editData = control.data
      break
    case 'cascader':
      editData = options
      break
    case 'optionsParams': // 选项请求附加参数
      editData = config.beforeFetch
      break
    case 'optionsResult':
      editData = config.afterFetch
      break
  }
  const emitsParams = {
    content: editData,
    codeType: codeType,
    type: type,
    callback: result => {
      switch (type) {
        case 'editRules':
          if (!controlData.value.formItem) {
            controlData.value.formItem = {}
          }
          controlData.value.formItem.rules = result
          break
        case 'editProps':
          controlData.value.control = {}
          Object.assign(controlData.value.control, result)
          break
        case 'treeSelect':
          controlData.value.control.data = result
          break
        case 'cascader':
          controlData.value.options = result
          break
        case 'optionsParams':
          controlData.value.config.beforeFetch = result
          break
        case 'optionsResult':
          controlData.value.config.afterFetch = result
          break
        case 'button':
          controlData.value.config = result
          break
      }
    }
  }
  emits('openDialog', emitsParams)
}
// 必填校验
const requiredChange = val => {
  if (!controlData.value.formItem?.rules) {
    controlData.value.formItem.rules = []
  }
  if (val) {
    controlData.value.formItem.rules.push({
      required: true,
      message: '必填项',
      trigger: 'change'
    })
  } else {
    controlData.value.formItem.rules.splice(0, 1)
  }
}
// 根据不同类型判断是否显示当前属性
const showHide = (type, show) => {
  // show=true 条件成立显示，false符合条件隐藏
  if ((type && type.length === 0) || Object.keys(controlData.value).length === 0) {
    return false
  }
  const index = type.indexOf(controlData.value.type)
  return show ? index !== -1 : index === -1
}
// 子表时添加序号和操作列
const tableColumnAdd = val => {
  const item = {
    name: 'index',
    type: 'index',
    item: {
      label: '序号'
    },
    control: {},
    config: {}
  }
  if (val) {
    controlData.value.list.unshift(item)
  } else {
    controlData.value.list.splice(0, 1)
  }
}
// 校验规则必填勾选设置，存在校验规则时勾选
const checkboxRequired = computed(() => {
  const val = controlData.value?.formItem?.rules
  return val && val.length > 0
})
// 快速添加一条校验规则
const addRulesFast = () => {
  if (!controlData.value.customRules) {
    controlData.value.customRules = []
  }
  controlData.value.customRules.push({
    type: 'required',
    message: '必填项',
    trigger: 'blur'
  })
}
// 删除一条校验规则
const delAddRules = index => {
  controlData.value.customRules?.splice(index, 1)
}

// 根据选定数据源获取表单字段
const getFormFieldBySource = (id, callback) => {
  if (state.isSearch) {
    // 搜索设计这里不需要数据源
    return
  }
  const source = id
  if (source) {
    //    getRequest('sourceById', { id: source })
    //     .then((res: { data: any }) => {
    //       // console.log(res)
    //       const tableData = res.data?.tableData
    //       try {
    //         state.dataSourceFiledList = JSON.parse(tableData)
    //       } catch (e) {
    //        state.dataSourceFiledList = []
    //      }
    //      callback && callback(state.dataSourceFiledList)
    //    })
    //    .catch((res: any) => {
    //      console.log(res)
    //   })
  }
}
const getDataSource = () => {
  // 获取数据源，表单设计才加载，搜索设置不需要
  if (!state.isSearch) {
    // getRequest('sourceList').then((res: any) => {
    //   dataSourceOption.value = res.data.list
    // })
  }
}
// 表单属性修改
const formAttrChange = (obj, val) => {
  if (obj.key === 'source') {
    getFormFieldBySource(obj.value) // 改变了数据源了，重新请求数据
    // 清空设计区已选择的组件，再一次选择时字段标识才会变
    store.setActiveKey('')
    store.setControlAttr({})
  }
  if (['formName', 'source'].includes(obj.key)) {
    emits('update:formOtherData', Object.assign(props.formOtherData, { [obj.key]: obj.value }))
    return
  }
  if (obj.path === 'config') {
    formConfig.value[obj.key] = obj.value || val
  } else {
    formData.value[obj.key] = obj.value
  }
}
// 返回选项配置提示
const getOptionPlaceholder = type => {
  switch (type) {
    case 1:
      return '数据源接口URL或api的key,可带参数'
    case 2:
      return '字典key，默认为字段标识'
  }
  return ''
}
// 快速添加校验规则改变时，填写默认的校验提示信息
const rulesSelectChange = (item, val) => {
  const filter = validate.filter(item => item.type === val)
  if (filter && filter.length) {
    item.message = filter[0].message
  }
}
getDataSource()
defineExpose({ getFormFieldBySource })
</script>
<style lang="scss" scoped>
@use '@/components/BizDesignForm/design.scss';
</style>
