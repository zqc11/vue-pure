import { $t } from "/@/plugins/i18n";
import Layout from "/@/layout/index.vue";

const otherRouter = [
  {
    path: "/flowChart",
    name: "flowChart",
    component: Layout,
    redirect: "/flowChart/index",
    meta: {
      icon: "set-up",
      title: $t("menus.hsflowChart"),
      i18n: true,
      rank: 1
    },
    children: [
      {
        path: "/flowChart/index",
        name: "flowChart",
        component: () => import("/@/views/flow-chart/index.vue"),
        meta: {
          title: $t("menus.hsflowChart"),
          i18n: true
        }
      }
    ]
  },

  {
    path: "/taskInfo",
    name: "taskInfo",
    redirect: "/taskInfo/index",
    component: Layout,
    children: [
      {
        name: "taskInfo",
        path: "/taskInfo/index",
        component: () => import("/@/views/task-info/index.vue")
      }
    ]
  },
  // 创建新流程审批
  {
    path: "/newTask",
    name: "newTask",
    redirect: "/newTask/index",
    component: Layout,
    children: [
      {
        name: "newTask",
        path: "/newTask/index",
        component: () => import("/@/views/new-task/index.vue")
      }
    ]
  }
];
export default otherRouter;
