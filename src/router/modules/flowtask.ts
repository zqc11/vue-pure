import Layout from "/@/layout/index.vue";

const flowTaskRouter = {
  path: "/flowTask",
  name: "flowTask",
  component: Layout,
  redirect: "/flowTask/index",
  meta: {
    icon: "set-up",
    title: "审批流程",
    rank: 1
  },
  children: [
    {
      path: "/flowTask/index",
      name: "flowTask",
      component: () => import("/@/views/flow-task/index.vue"),
      meta: {
        title: "审批流程"
      }
    }
  ]
};

export default flowTaskRouter;
