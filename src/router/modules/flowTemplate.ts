import Layout from "/@/layout/index.vue";

const flowTemplateRouter = {
  path: "/flowTemplate",
  name: "flowTemplate",
  component: Layout,
  redirect: "/flowTemplate/index",
  meta: {
    icon: "set-up",
    title: "流程模板",
    rank: 7
  },
  children: [
    {
      path: "/flowTemplate/index",
      name: "flowTemplate",
      component: () => import("/@/views/flow-template/index.vue"),
      meta: {
        title: "流程模板"
      }
    }
  ]
};

export default flowTemplateRouter;
