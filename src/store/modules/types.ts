import { RouteRecordName } from "vue-router";

export type cacheType = {
  mode: string;
  name?: RouteRecordName;
};

export type positionType = {
  startIndex?: number;
  length?: number;
};

export type appType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Hamburger
    isClickHamburger: boolean;
  };
  layout: string;
  device: string;
};

export type multiType = {
  path: string;
  parentPath: string;
  name: string;
  meta: any;
  query?: object;
};

export type setType = {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
};

export type userType = {
  token: string;
  account?: string;
};

export type flowTaskType = {
  baseInfo: baseInfo;
  uploadFiles?: uploadFile[];
  formData?: formData;
  flowChart: flowChart;
};

type baseInfo = {
  title: string;
  desc?: string;
  type: string;
};
type uploadFile = {
  type: string;
  fileName: string;
  url: string;
};
type formData = {
  formJson: object;
};
type flowChart = {
  flowchartJson: object;
};

export type ResultType = {
  success: boolean;
  code: number;
  msg: string;
  data: object;
};
