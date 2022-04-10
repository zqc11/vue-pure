import { ref, onUnmounted, watch, nextTick } from "vue";
import { emitter } from "/@/utils/ui/ui";

export const useMapAction = (
  eleClasses: string[],
  noEventsEleIds: string[]
) => {
  const isMapDoActioning = ref(false);

  const ismapDoAction = (action: any) => {
    isMapDoActioning.value = action?.do;
  };
  emitter.on("ismapDoAction", ismapDoAction);
  onUnmounted(() => emitter.off("ismapDoAction", ismapDoAction));

  watch(isMapDoActioning, val => {
    for (const cls of eleClasses) {
      const elements = document.getElementsByClassName(
        cls
      ) as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < elements.length; i++) {
        const ele = elements.item(i);
        if (ele && ele.style) {
          if (val) {
            // @ts-ignore
            ele.style._restore_display = ele.style.display; //保存老的状态
            ele.style.display = "none";
          } else {
            // @ts-ignore
            if (ele.style._restore_display !== undefined) {
              // 如果有老的状态，用之前的显示或隐藏状态
              // @ts-ignore
              ele.style.display = ele.style._restore_display;
              // @ts-ignore
              delete ele.style._restore_display;
            }
          }
        }
      }
    }

    for (const id of noEventsEleIds) {
      const ele = document.getElementById(id);
      if (ele && ele.style) {
        if (val) {
          // @ts-ignore
          ele.style._restore_pointerEvents = ele.style.pointerEvents; //保存老的状态
          ele.style.pointerEvents = "none";
        } else {
          // @ts-ignore
          if (ele.style._restore_pointerEvents !== undefined) {
            // 如果有老的状态，用之前的显示或隐藏状态
            // @ts-ignore
            ele.style.pointerEvents = ele.style._restore_pointerEvents;
            // @ts-ignore
            delete ele.style._restore_pointerEvents;
          }
        }
      }
    }
  });

  return {
    isMapDoActioning
  };
};

export const beginDoMapAction = async () => {
  emitter.emit("ismapDoAction", { do: true });
  await nextTick();
};

export const waitActionSelResult = () => {
  return new Promise(resolve => {
    const ismapDoAction = (action: any) => {
      // 取消监听
      emitter.off("ismapDoAction", ismapDoAction);
      resolve(action?.sel);
    };
    emitter.on("ismapDoAction", ismapDoAction);
  });
};

export const changeActionUiStatus = async (status: {
  message?: string;
  disableButtons?: boolean;
}) => {
  emitter.emit("changActionUiStatus", status);
  await nextTick();
};

export const doAction = async (action?: Function) => {
  await beginDoMapAction();
  let result: any;
  if (typeof action == "function") {
    result = await action(); // 执行动作
  }
  const sel = await waitActionSelResult(); // 等待选择确定还是取消
  return {
    sel,
    result
  };
};
