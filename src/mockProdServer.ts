import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import echartsMock from "../mock/echarts";
import asyncRoutesMock from "../mock/asyncRoutes";

export const mockModules = [...echartsMock, ...asyncRoutesMock];

export function setupProdMockServer() {
  // 用于配置生产环境动态Mock
  createProdMockServer(mockModules);
}
