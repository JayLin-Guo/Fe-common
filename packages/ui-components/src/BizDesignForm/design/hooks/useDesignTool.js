// useDesignTool.ts
import { useDesignStore } from "@/piniaStore/modules/design";
import { json2string, objToStringify, stringToObj } from "../../utils/design";
import { useAceDrawer } from "./useAceDrawer";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { HeadToolAction } from "./enum";

export function useDesignTool(drawer, state, pageLoading) {
  const store = useDesignStore();
  // const route = useRoute().query || {};
  // const { openDrawer } = useAceDrawer(drawer, state);

  const formType = [
    "input",
    "select",
    "radio",
    "checkbox",
    "date",
    "time",
    "datetime",
    "switch",
    "slider",
    "cascader",
    "upload",
    "textarea",
    "tree",
    "tree-select",
    "color-picker",
    "rate",
    "transfer",
    "icon",
    "custom",
    "cityArea",
  ];

  // 将数据保存在服务端
  const saveData = async () => {
    // let params = {
    //   data: objToStringify(state.formData),
    //   source: state.formOtherData.source,
    //   name: state.formOtherData.formName,
    //   type: 1,
    //   dict: json2string(state.formDict),
    // };

    const { list } = JSON.parse(JSON.stringify(state.formData));
    if (!list?.length) {
      ElMessage.warning("请先添加表单内容");
      return;
    }
    pageLoading.value = true;

    const transformList = list.reduce(
      (accumulator, item, index) => {
        const { type, name, formItem, columns, attr } = item;

        let currentStep = `step${accumulator.stepCount}`;

        if (type === "title") {
          accumulator.stepCount += 1;
          currentStep = `step${accumulator.stepCount}`;
          accumulator[currentStep] = [];
        }

        if (index === 0 && type !== "title") {
          accumulator[currentStep] = [];
        }

        if (type !== "title") {
          let transformedItem = {};

          if (formType.includes(type)) {
            transformedItem = {
              type: "form",
              field: name,
              label: formItem.label,
              span: 24,
            };
          } else if (type === "grid" && columns) {
  
            transformedItem = columns.map(({ list, attr }) => {
              return {
                type: "form",
                label: list.length > 0 ? list[0].formItem.label : "",
                field: list.length > 0 ? list[0].name : null,
                span: attr?.span || 12,
              };
            });
          } else if (type === "table") {
            transformedItem = {
              type: "table",
              columns: item.list,
            };
          }

          if (
            transformedItem.type ||
            (Array.isArray(transformedItem) && transformedItem.length > 0)
          ) {
            if (Array.isArray(transformedItem)) {
              accumulator[currentStep].push(...transformedItem);
            } else {
              accumulator[currentStep].push(transformedItem);
            }
          }
        }

        return accumulator;
      },
      { stepCount: 0 }
    );
    // console.log(transformList, 'transformList')
    const params = {
      type: store.currentMenuItem.type,
      platID: store.currentMenuItem.platID,
      jsonStr: objToStringify({
        sourceData: state.formData,
        realData: transformList,
      }),
    };
    // console.log(state.formData, "state.formData===>>>");

    console.log(transformList, "transformList===>>>");

    try {
      await store.saveDesignFormData(params);
      store.setActiveKey("");
      store.setControlAttr({});
      ElMessage.success("保存成功");
    } catch (error) {
      ElMessage.error("保存失败");
    } finally {
      pageLoading.value = false;
    }
  };

  const headToolClick = (type) => {
    switch (type) {
      case HeadToolAction.Delete:
        state.formData = {
          list: [],
          form: {
            size: "default",
          },
          config: {},
        };
        store.setActiveKey("");
        store.setControlAttr({});
        break;
      case HeadToolAction.Preview:
        store.setActiveKey("");
        store.setControlAttr({});
        state.previewVisible = true;
        let stringPreview = objToStringify(state.formData);
        const formName = state.formData.form.name;

        const reg = new RegExp(`get${formName}ControlByName`, "g");
        stringPreview = stringPreview.replace(
          reg,
          `getPreview${formName}ControlByName`
        );
        state.formDataPreview = stringToObj(stringPreview);
        state.formDataPreview.form.name = `Preview${formName}`;
        break;
      case HeadToolAction.GenerateJson:
        openDrawer({ type: "creatJson", content: state.formData });
        break;
      case HeadToolAction.Save:
        saveData();
        break;
      case HeadToolAction.Vue:
        // vueFileEl.value.open(state.formData);
        break;
    }
  };

  return {
    headToolClick,
  };
}
