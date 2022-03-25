// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

// http://mockjs.com/examples.html#Object
const systemRouter = {
  path: "/system",
  name: "system",
  redirect: "/system/user/index",
  meta: {
    icon: "setting",
    title: "系统设置",
    rank: 6
  },
  children: [
    {
      path: "/system/user/index",
      name: "user",
      meta: {
        title: "基础信息"
      }
    },
    {
      path: "/system/dict/index",
      name: "dict",
      meta: {
        title: "字典管理",
        keepAlive: true
      }
    }
  ]
};

const permissionRouter = {
  path: "/permission",
  name: "permission",
  redirect: "/permission/page/index",
  meta: {
    title: "权限设置",
    icon: "lollipop",
    rank: 3
  },
  children: [
    {
      path: "/permission/page/index",
      name: "permissionPage",
      meta: {
        title: "权限页面"
      }
    },
    {
      path: "/permission/button/index",
      name: "permissionButton",
      meta: {
        title: "权限按钮",
        authority: []
      }
    }
  ]
};

// 添加不同按钮权限到/permission/button页面中
function setDifAuthority(authority, routes) {
  routes.children[1].meta.authority = [authority];
  return routes;
}

export default [
  {
    url: "/getAsyncRoutes",
    method: "get",
    response: ({ query }) => {
      return {
        code: 0,
        data: [systemRouter, setDifAuthority("v-admin", permissionRouter)]
      };
    }
  }
] as MockMethod[];
