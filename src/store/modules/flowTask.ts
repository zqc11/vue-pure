import { defineStore } from "pinia";
import { store } from "/@/store";
import { flowTaskType } from "./types";
import { postTask } from "/@/api/task";

export const useFlowTaskStore = defineStore({
  id: "flow-task",
  state: (): flowTaskType => ({
    baseInfo: {
      title: "",
      desc: "",
      type: ""
    },
    blueprints: [],
    formData: {
      formDataJson: ""
    },
    flowChart: {
      nodes: [],
      edges: []
    },
    permission: {
      maintain: [],
      statistics: []
    }
  }),
  actions: {
    setBaseInfo(info) {
      this.baseInfo = info;
    },
    setblueprints(file) {
      this.blueprints.push(file);
    },
    setformData(formData) {
      this.formData.formDataJson = formData;
    },
    setFlowChart(flowChart) {
      this.flowChart = flowChart;
    },
    setPermission(permission) {
      this.permission.maintain = permission.maintain;
      this.permission.statistics = permission.statistics;
    },
    postTask() {
      console.log(this);
      return postTask(this.state);
    }
  }
});

export function useFlowTaskStoreHook() {
  return useFlowTaskStore(store);
}
