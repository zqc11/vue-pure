import { Map, Draw, Control } from "vjmap";
import { useAppStore } from "/@/store/modules/vjmap/app";
import { getMapSnapPoints } from "./snap";
import { ElMessage } from "element-plus";
import {
  getBlueprintDrawData,
  saveBlueprintDrawData,
  saveBlueprintSnapData
} from "/@/api/task";
import { ResultType } from "/@/store/modules/types";
import { useOperationStoreHook } from "/@/store/modules/operation";
export function useDrawTool(map: Map) {
  const app = useAppStore();

  let drawTool: Control | undefined;
  const snapObj: any = {}; // 设置的捕捉的实体

  function getAddControls() {
    return [
      {
        id: "SaveJson",
        title: "保存数据，下次打开地图时将自动加载",
        style: {
          "background-size": "90% 90%",
          "background-repeat": "no-repeat",
          "background-image": `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAUBJREFUWEftl18SwTAQxvM5Ag6gTsIhePLGIZQHvOAQXMAl9CQ4AI7QNduRDtU0G5P6M9O8dKbdZH/Z/bLZQn154Mv+VQXwuxGoB+EQSg3e0QgB0fWwXEjm5kag2Rp3qFbbSxYw2ZBScwlELkAjCPcK6CCOu9qBBnp8l+f8EVwCYQU4n9YRO2q0J8TPy2FZqBttl4JbIlEaABH6AO0YpCgSzgBSXXCk6sG0Z4MoFYBhUwii6HJcpZrSGxEDSHeetUtPVAXw9xHgXLroQNcPbxrIFhgbjC5Y/gGIkspoHEASqdIApKW4VACTHjjv2TvDewp4Z/q2fErD/Zh9DiBHBFxqPwJQpEHvAO82JC/NjEslTPpBYGM76y7fiWh0Pa622TnG7iZRLzBzcWKyBdFCV0YxgA/HkjV+979AQu/DporADW28gzByvbLmAAAAAElFTkSuQmCC')`
        },
        onActivate: async (ctx: any) => {
          const entsJson = ctx.api.getAll();
          const id = useOperationStoreHook().GET_CURRENT_BLUEPRINT().id;
          const annotatations = {};
          for (const key in app.myAnnotataions) {
            annotatations[key] = app.myAnnotataions[key];
          }
          saveBlueprintSnapData({
            id,
            snapData: JSON.stringify(annotatations)
          })
            .then((response: ResultType) => {
              if (response.success) {
                ElMessage({
                  type: "success",
                  message: "保存成功"
                });
              }
            })
            .catch(error => {
              ElMessage({
                type: "error",
                message: error.message
              });
            });

          saveBlueprintDrawData({ id, drawData: JSON.stringify(entsJson) })
            .then((response: ResultType) => {
              if (response.success) {
                ElMessage({
                  type: "success",
                  message: "保存成功"
                });
              }
            })
            .catch(error => {
              ElMessage({
                type: "error",
                message: error.message
              });
            });
        }
      }
    ];
  }

  const showHideDrawTool = () => {
    if (drawTool) {
      map.removeControl(drawTool);
      drawTool = undefined;
    } else {
      const tool = new (Draw.Tool as any)({
        addControls: getAddControls(),
        api: {
          getSnapFeatures: snapObj //要捕捉的数据项在后面，通过属性features赋值
        }
      });
      map.addControl(tool, "top-left");
      drawTool = tool;
      loadData(drawTool);
    }
    getSnapFeatures();
  };
  let hasSnapQuery = false;
  const getSnapFeatures = async () => {
    if (!hasSnapQuery && app.snapQueryLimit > 0) {
      hasSnapQuery = true;
      snapObj.features = [];
      getMapSnapPoints(map, snapObj);
    }
  };

  return {
    showHideDrawTool
  };
}
// 加载数据
const loadData = (drawTool: any) => {
  const id = useOperationStoreHook().GET_CURRENT_BLUEPRINT().id;
  let data;
  getBlueprintDrawData(id).then((response: ResultType) => {
    if (response.success) {
      data = response.data;
      if (data !== null && data != "") {
        try {
          data = JSON.parse(data);
          drawTool.set(data);
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
};
