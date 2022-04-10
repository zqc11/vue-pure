<template>
  <el-button-group class="btn-bar">
    <el-tooltip effect="dark" content="全图显示" placement="top">
      <el-button
        plain
        :icon="FullScreen"
        @click="map.fitMapBounds()"
      ></el-button>
    </el-tooltip>
    <el-button @click="activeTabs('LayerManage')"
      ><SvgIcon
        name="layer-group"
        :width="16"
        :height="16"
        color="#0000ff"
      ></SvgIcon
      >图层管理</el-button
    >
    <el-button @click="activeTabs('Property')"
      ><SvgIcon
        name="property"
        :width="16"
        :height="16"
        color="#0000ff"
      ></SvgIcon
      >属性面板</el-button
    >
    <el-button @click="activeTabs('ViewPort')"
      ><SvgIcon
        name="viewport"
        :width="16"
        :height="16"
        color="#0000ff"
      ></SvgIcon
      >视图管理</el-button
    >
    <el-button @click="drawTool.showHideDrawTool()"
      ><SvgIcon
        name="drawing"
        :width="16"
        :height="16"
        color="#0000ff"
      ></SvgIcon
      >绘图工具</el-button
    >
    <el-button @click="activeTabs('Annotation')"
      ><SvgIcon
        name="annotation"
        :width="16"
        :height="16"
        color="#0000ff"
      ></SvgIcon
      >图纸批注</el-button
    >
  </el-button-group>
</template>

<script setup lang="ts">
import { FullScreen } from "@element-plus/icons-vue";
import { inject } from "vue";
import { Map } from "vjmap";
import { emitter } from "/@/utils/ui/ui";
import { useDrawTool } from "../lib/drawtool";
const map = (inject("map") as Function)() as Map;
const drawTool = useDrawTool(map);

const activeTabs = (tabname: string, param?: object) => {
  emitter.emit("activeSideBarTabs", {
    name: tabname,
    ...param
  });
};
</script>

<style lang="scss" scoped>
:deep(.el-button) {
  padding: 4px 4px;
}

.btn-bar {
  margin: 5px 5px 5px 50px;
  opacity: 0.9;
}

.themeswitch {
  padding-left: 5px;
}
</style>
