<script setup lang="ts">
import { computed, nextTick, onMounted, getCurrentInstance } from "vue";
import { emitter } from "/@/utils/mitt";
import Notice from "../notice/index.vue";
import { templateRef } from "@vueuse/core";
import avatars from "/@/assets/avatars.jpg";
import screenfull from "../screenfull/index.vue";
import { useRoute, useRouter } from "vue-router";
import { storageLocal } from "/@/utils/storage";
import { deviceDetection } from "/@/utils/deviceDetection";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import { useUserStoreHook } from "/@/store/modules/user";
import sidebarItem from "./sidebarItem.vue";

const title =
  getCurrentInstance().appContext.config.globalProperties.$config?.Title;

const menuRef = templateRef<ElRef | null>("menu", null);
const route = useRoute();
const router = useRouter();
const routers = useRouter().options.routes;
let account = storageLocal.getItem("info")?.userInfo.account;

// 退出登录
const logout = (): void => {
  useUserStoreHook().logOut();
  router.push("/login");
};

function onPanel() {
  emitter.emit("openPanel");
}

const activeMenu = computed((): string => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    // @ts-ignore
    return meta.activeMenu;
  }
  return path;
});

const menuSelect = (indexPath: string): void => {
  let parentPath = "";
  let parentPathIndex = indexPath.lastIndexOf("/");
  if (parentPathIndex > 0) {
    parentPath = indexPath.slice(0, parentPathIndex);
  }
  // 找到当前路由的信息
  function findCurrentRoute(routes) {
    return routes.map(item => {
      if (item.path === indexPath) {
        // 切换左侧菜单 通知标签页
        emitter.emit("changLayoutRoute", {
          indexPath,
          parentPath
        });
      } else {
        if (item.children) findCurrentRoute(item.children);
      }
    });
  }
  findCurrentRoute(routers);
};

function backHome() {
  router.push("/welcome");
}

function handleResize() {
  // @ts-ignore
  menuRef.value.handleResize();
}

onMounted(() => {
  nextTick(() => {
    handleResize();
  });
});
</script>

<template>
  <div class="horizontal-header">
    <div class="horizontal-header-left" @click="backHome">
      <FontIcon
        icon="team-iconlogo"
        svg
        style="width: 35px; height: 35px"
      ></FontIcon>
      <h4>{{ title }}</h4>
    </div>
    <el-menu
      ref="menu"
      :default-active="activeMenu"
      unique-opened
      router
      class="horizontal-header-menu"
      mode="horizontal"
      @select="menuSelect"
    >
      <sidebar-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <div class="horizontal-header-right">
      <!-- 通知 -->
      <Notice id="header-notice" />
      <!-- 全屏 -->
      <screenfull id="header-screenfull" v-show="!deviceDetection()" />
      <!-- 退出登陆 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img :src="avatars" />
          <p>{{ account }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                icon="logout-circle-r-line"
                style="margin: 5px"
              />
              退出系统</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-icon class="el-icon-setting" title="打开项目配置" @click="onPanel">
        <IconifyIconOffline icon="setting" />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}

.logout {
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    min-width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
  }
}
</style>
