import { toRouteType } from "./types";
import { openLink } from "/@/utils/link";
import NProgress from "/@/utils/progress";
import { constantRoutes } from "./modules";
import { split, findIndex } from "lodash-es";
import remainingRouter from "./modules/remaining";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import { Router, RouteMeta, createRouter, RouteRecordName } from "vue-router";
import {
  initRouter,
  getHistoryMode,
  getParentPaths,
  findRouteByPath,
  handleAliveRoute
} from "./utils";
import otherRouter from "./modules/other";
import { getToken } from "../utils/auth";

// 创建路由实例
export const router: Router = createRouter({
  // 用于路由实现历史记录
  history: getHistoryMode(),
  // 添加到router实例的初始路由列表
  routes: constantRoutes.concat(...remainingRouter, ...otherRouter),
  strict: true,
  // 在页面之间切换时控制滚动的位置
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});

// 路由白名单
const whiteList = ["/login", "/register"];

// 路由跳转之前执行的动作
router.beforeEach((to: toRouteType, _from, next) => {
  if (to.meta?.keepAlive) {
    const newMatched = to.matched;
    handleAliveRoute(newMatched, "add");
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "redirect") {
      handleAliveRoute(newMatched);
    }
  }
  const cookie = getToken();
  let cookieJson;
  let expired = true;
  if (cookie) {
    cookieJson = JSON.parse(cookie);
    const now = new Date().getTime();
    expired = parseInt(cookieJson.expires) - now <= 0;
  }
  // 进度条动画开始
  NProgress.start();
  const externalLink = to?.redirectedFrom?.fullPath;
  if (!externalLink) {
    to.matched.some(item => {
      document.title = item.meta.title ? (item.meta.title as string) : "";
    });
  }
  if (!expired) {
    // from路由的名称不为空
    if (_from?.name) {
      // 如果路由包含http 则是超链接 反之是普通路由
      if (externalLink && externalLink.includes("http")) {
        // 打开外链
        openLink(`http${split(externalLink, "http")[1]}`);
        // 进度条动画结束
        NProgress.done();
      } else {
        next();
      }
    } else {
      // 刷新
      if (usePermissionStoreHook().wholeMenus.length === 0)
        initRouter(cookieJson.account).then((router: Router) => {
          if (!useMultiTagsStoreHook().getMultiTagsCache) {
            const handTag = (
              path: string,
              parentPath: string,
              name: RouteRecordName,
              meta: RouteMeta
            ): void => {
              useMultiTagsStoreHook().handleTags("push", {
                path,
                parentPath,
                name,
                meta
              });
            };
            // 未开启标签页缓存，刷新页面重定向到顶级路由（参考标签页操作例子，只针对静态路由）
            if (to.meta?.refreshRedirect) {
              const routes = router.options.routes;
              const { refreshRedirect } = to.meta;
              const { name, meta } = findRouteByPath(refreshRedirect, routes);
              handTag(
                refreshRedirect,
                getParentPaths(refreshRedirect, routes)[1],
                name,
                meta
              );
              return router.push(refreshRedirect);
            } else {
              const { path } = to;
              const index = findIndex(remainingRouter, v => {
                return v.path == path;
              });
              const routes =
                index === -1
                  ? router.options.routes[0].children
                  : router.options.routes;
              const route = findRouteByPath(path, routes);
              const routePartent = getParentPaths(path, routes);
              // 未开启标签页缓存，刷新页面重定向到顶级路由（参考标签页操作例子，只针对动态路由）
              if (
                path !== routes[0].path &&
                route?.meta?.rank !== 0 &&
                routePartent.length === 0
              ) {
                if (!route?.meta?.refreshRedirect) return;
                const { name, meta } = findRouteByPath(
                  route.meta.refreshRedirect,
                  routes
                );
                handTag(
                  route.meta?.refreshRedirect,
                  getParentPaths(route.meta?.refreshRedirect, routes)[0],
                  name,
                  meta
                );
                return router.push(route.meta?.refreshRedirect);
              } else {
                handTag(
                  route.path,
                  routePartent[routePartent.length - 1],
                  route.name,
                  route.meta
                );
                return router.push(path);
              }
            }
          }
          router.push(to.fullPath);
        });
      next();
    }
  } else {
    if (to.path !== "/login") {
      // 如果访问的路由存在于白名单中，则继续跳转到目标，否则返回login页面
      // 用于判断权限
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next({ path: "/login" });
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  // 进度条动画结束
  NProgress.done();
});

export default router;
