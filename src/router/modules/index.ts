// 静态路由
import homeRouter from "./home";
import editorRouter from "./editor";
import remainingRouter from "./remaining";
import flowTaskRouter from "./flowtask";
import newFlowRouter from "./newFlow";
import flowTemplateRouter from "./flowTemplate";
import { RouteRecordRaw, RouteComponent } from "vue-router";

import {
  ascending,
  formatTwoStageRoutes,
  formatFlatteningRoutes
} from "../utils";

// 原始静态路由（未做任何处理）
const routes = [
  homeRouter,
  editorRouter,
  flowTaskRouter,
  newFlowRouter,
  flowTemplateRouter
];

// 导出处理后的静态路由（三级及以上的路由全部拍成二级）
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(ascending(routes))
);

// 用于渲染菜单，保持原始层级
export const constantMenus: Array<RouteComponent> = ascending(routes).concat(
  ...remainingRouter
);
