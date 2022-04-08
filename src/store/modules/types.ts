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
  blueprints?: uploadFile[];
  formData?: formData;
  flowChart: flowChart;
  permission?: permissionType;
};

type baseInfo = {
  title: string;
  desc?: string;
  type: string;
};
type uploadFile = {
  filename: string;
  location: string;
  type: string;
};
type formData = {
  formDataJson: string;
};
type flowChart = {
  nodes: [];
  edges: [];
};
type permissionType = {
  maintain: [];
  statistics: [];
};

export type ResultType = {
  success: boolean;
  code: number;
  msg: string;
  data: any;
};

export type OperationType = {
  currentTask: Object;
  currentBlueprint: Object;
};
