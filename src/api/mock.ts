import { http } from "../utils/http";

// echarts数据
export const echartsJson = (params?: object) => {
  return http.request("get", "/getEchartsInfo", { params });
};
