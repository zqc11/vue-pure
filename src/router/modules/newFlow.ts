import Layout from "/@/layout/index.vue";

const newFlowRouter = {
  path: "/newTask",
  name: "newTask",
  component: Layout,
  meta: {
    icon: "set-up",
    title: "新建审批",
    rank: 7
  }
};

export default newFlowRouter;
