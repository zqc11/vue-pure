import Layout from "/@/layout/index.vue";

const editorRouter = {
  path: "/editor",
  name: "reEditor",
  component: Layout,
  redirect: "/editor/index",
  meta: {
    icon: "edit",
    title: "编辑器",
    rank: 2
  },
  children: [
    {
      path: "/editor/index",
      name: "reEditor",
      component: () => import("/@/views/editor/index.vue"),
      meta: {
        title: "编辑器",
        keepAlive: true
        // 新内容icon
        // extraIcon: {
        //   svg: true,
        //   name: "team-iconxinpin"
        // }
      }
    }
  ]
};

export default editorRouter;
