import { ElMessageBox, ElMessage } from "element-plus";
import type { Emitter } from "mitt";
import mitt from "mitt";

export const emitter: Emitter<any> = mitt();

export const showError = (tip: string, e?: any) => {
  ElMessage.error(
    tip +
      (e ? e.message || e.response || JSON.stringify(e).substring(0, 80) : "")
  );
};

export const getInput = async (
  title: string,
  content: string,
  input?: string,
  inputPattern?: RegExp,
  inputErrorMessage?: string
) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.prompt(title, content, {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: inputPattern,
      inputErrorMessage,
      inputValue: input ?? ""
    })
      .then(({ value }) => {
        resolve(value);
      })
      .catch(() => {
        reject("cancel");
      });
  });
};

export const showConfirm = async (content: string, title?: string) => {
  return await ElMessageBox.confirm(content, title ?? "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true
  });
};

export function sleep(ms?: number) {
  return new Promise(resolve => setTimeout(resolve, ms ?? 100));
}
