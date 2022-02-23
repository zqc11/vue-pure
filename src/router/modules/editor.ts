import { $t } from "/@/plugins/i18n";
import Layout from "/@/layout/index.vue";

const editorRouter = {
  path: "/editor",
  name: "reEditor",
  component: Layout,
  redirect: "/editor/index",
  meta: {
    icon: "edit",
    title: $t("menus.hseditor"),
    i18n: true,
    rank: 2
  },
  children: [
    {
      path: "/editor/index",
      name: "reEditor",
      component: () => import("/@/views/editor/index.vue"),
      meta: {
        title: $t("menus.hseditor"),
        i18n: true,
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
