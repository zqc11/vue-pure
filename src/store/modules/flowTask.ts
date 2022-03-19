import { defineStore } from "pinia";
import { store } from "/@/store";
import { flowTaskType } from "./types";

export const useFlowTaskStore = defineStore({
  id: "flow-task",
  state: (): flowTaskType => ({
    baseInfo: {
      title: "",
      desc: "",
      type: ""
    },
    uploadFiles: [],
    formData: {
      formJson: null
    },
    flowChart: {
      flowchartJson: null
    }
  }),
  actions: {
    setBaseInfo(info) {
      this.baseInfo = info;
    },
    setuploadFiles(file) {
      this.uploadFiles.push(file);
    },
    setformData(formData) {
      this.formData.formJson = formData;
    },
    setFlowChart(flowChart) {
      this.flowChart.flowchartJson = flowChart;
    }
  }
});

export function useFlowTaskStoreHook() {
  return useFlowTaskStore(store);
}
