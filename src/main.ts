import App from "./App.vue";
import router from "./router";
import { setupStore } from "/@/store";
import { getServerConfig } from "./config";
import { createApp, Directive } from "vue";
import { usI18n } from "../src/plugins/i18n";
import { MotionPlugin } from "@vueuse/motion";
import { useTable } from "../src/plugins/vxe-table";
import { useElementPlus } from "../src/plugins/element-plus";
import { injectResponsiveStorage } from "/@/utils/storage/responsive";

import "animate.css";
import "virtual:windi.css";
// 导入公共样式
import "./style/index.scss";
// 导入字体图标
import "./assets/iconfont/iconfont.js";
import "./assets/iconfont/iconfont.css";
import "v-contextmenu/dist/themes/default.css";

// 创建vus实例
const app = createApp(App);

// 自定义指令
import * as directives from "/@/directives";
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

// 全局注册`@iconify/vue`图标库
import {
  IconifyIconOffline,
  IconifyIconOnline,
  FontIcon
} from "./components/ReIcon";
app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);
app.component("FontIcon", FontIcon);

// 对vus实例的初始化配置操作
getServerConfig(app).then(async config => {
  injectResponsiveStorage(app, config);
  //注册Pinia，用于Vue的状态管理库，类似于Vuex
  setupStore(app);
  app
    .use(router)
    .use(MotionPlugin)
    .use(useElementPlus)
    .use(useTable)
    .use(usI18n);
  // 注册路由
  await router.isReady();
  app.mount("#app");
});
