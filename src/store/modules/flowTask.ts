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
      if (flowChart.nodes.length == 0) return;
      let currentNum = 0;
      // 得到startNode的id
      let currentNodeId = flowChart.nodes.filter(
        node => node.type === "bpmn:startEvent"
      )[0].id;
      console.log("currentNodeId", currentNodeId);
      let nextNode;
      do {
        // 查询edges中sourceNodeId==startNode.id的edge的targetNodeId
        const filterEdges = flowChart.edges.filter(
          edge => edge.sourceNodeId === currentNodeId
        );
        console.log("filterEdges", filterEdges);
        // 通过targetNodeId获得nextNode
        for (const edge of filterEdges) {
          const targetNodeId = edge.targetNodeId;
          nextNode = flowChart.nodes.filter(
            node => node.id === targetNodeId
          )[0];
          console.log("nextNode", nextNode);
          // 如果nextNode.properties.orderNum === -1
          if (nextNode.properties.orderNum === -1) {
            if (currentNum === 0) {
              nextNode.properties.status = "进行中";
            }
            nextNode.properties.orderNum = ++currentNum;
            currentNodeId = nextNode.id;
            if (nextNode.type === "bpmn:endEvent") break;
          }
        }
        // 直到nextNode.type == endNode.type
      } while (nextNode.type !== "bpmn:endEvent");
      this.flowChart = flowChart;
    },
    setPermission(permission) {
      this.permission.maintain = permission.maintain;
      this.permission.statistics = permission.statistics;
    },
    postTask() {
      return postTask(this.state);
    }
  }
});

export function useFlowTaskStoreHook() {
  return useFlowTaskStore(store);
}
