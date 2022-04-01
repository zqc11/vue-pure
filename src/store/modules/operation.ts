import { defineStore } from "pinia";
import { OperationType } from "./types";
import { store } from "/@/store";

export const useOperationStore = defineStore({
  id: "operation",
  state: (): OperationType => ({
    currentTask: {}
  }),
  actions: {
    SET_CURRENT_TASK(task) {
      this.currentTask = task;
    },
    GET_CURRENT_TASK() {
      return this.currentTask;
    }
  }
});

export function useOperationStoreHook() {
  return useOperationStore(store);
}
