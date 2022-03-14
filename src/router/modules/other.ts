import { $t } from "/@/plugins/i18n";
import Layout from "/@/layout/index.vue";

const otherRouter = [
  // 查看流程信息
  {
    path: "/taskInfo",
    name: "taskInfo",
    component: Layout,
    children: [
      {
        path: "",
        name: "taskInfo",
        component: () => import("/@/views/task-info/index.vue")
      }
    ]
  },
  // 创建新流程审批
  {
    path: "/newTask",
    name: "newTask",
    component: Layout,
    children: [
      {
        // /newTask
        path: "",
        name: "newTask",
        component: () => import("/@/views/new-task/index.vue"),
        redirect: "/newTask/baseInfo",
        children: [
          {
            // /newTask/baseInfo
            path: "baseInfo",
            name: "baseInfo",
            component: () => import("/@/views/new-task/base-info/index.vue")
          },

          {
            // /newTask/upload
            name: "upload",
            path: "upload",
            component: () => import("/@/views/new-task/upload/index.vue")
          },
          {
            // /newTask/formDesign
            path: "formDesign",
            name: "formDesign",
            component: () => import("/@/views/new-task/form-design/index.vue")
          },

          {
            // /newTask/flowChart
            path: "flowChart",
            name: "flowChart",
            component: () => import("/@/views/new-task/flow-chart/index.vue"),
            meta: {
              icon: "set-up",
              title: $t("menus.hsflowChart"),
              i18n: true,
              rank: 1
            }
          }
        ]
      }
    ]
  }
];
export default otherRouter;
