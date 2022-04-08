import { defineStore } from "pinia";
import { OperationType } from "./types";
import { store } from "/@/store";

export const useOperationStore = defineStore({
  id: "operation",
  state: (): OperationType => ({
    currentTask: {},
    currentBlueprint: {}
  }),
  actions: {
    SET_CURRENT_TASK(task) {
      this.currentTask = task;
    },
    GET_CURRENT_TASK() {
      return this.currentTask;
    },
    SET_CURRENT_BLUEPRINT(blueprint) {
      this.currentBlueprint = blueprint;
    },
    GET_CURRENT_BLUEPRINT() {
      return this.currentBlueprint;
    }
  }
});

export function useOperationStoreHook() {
  return useOperationStore(store);
}
