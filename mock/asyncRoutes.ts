// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

// http://mockjs.com/examples.html#Object
const systemRouter = {
  path: "/system",
  name: "system",
  redirect: "/system/user/index",
  meta: {
    icon: "setting",
    title: "menus.hssysManagement",
    i18n: true,
    rank: 6
  },
  children: [
    {
      path: "/system/user/index",
      name: "user",
      meta: {
        title: "menus.hsBaseinfo",
        i18n: true
      }
    },
    {
      path: "/system/dict/index",
      name: "dict",
      meta: {
        title: "menus.hsDict",
        i18n: true,
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
    title: "menus.permission",
    icon: "lollipop",
    i18n: true,
    rank: 3
  },
  children: [
    {
      path: "/permission/page/index",
      name: "permissionPage",
      meta: {
        title: "menus.permissionPage",
        i18n: true
      }
    },
    {
      path: "/permission/button/index",
      name: "permissionButton",
      meta: {
        title: "menus.permissionButton",
        i18n: true,
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
      if (query.name === "admin") {
        return {
          code: 0,
          info: [systemRouter, setDifAuthority("v-admin", permissionRouter)]
        };
      } else {
        return {
          code: 0,
          info: [null, setDifAuthority("v-test", permissionRouter)]
        };
      }
    }
  }
] as MockMethod[];
