<template>
  <div class="wrapper">
    <map-view
      v-if="mapId"
      :class="'container map-container-' + (lightTheme ? 'light' : 'dark')"
      :serviceUrl="serviceUrl"
      :accessToken="accessToken"
      :openMapParam="openMapParam"
      :isVectorStyle="isVector"
      :zoom="1"
      @loaded="mapLoaded"
    >
      <vj-navigation-control
        :position="'top-left'"
        v-if="app.showNavigationControl"
      />
    </map-view>
    <UiView v-if="isMapLoaded"></UiView>
    <DoMapAction v-if="isMapDoActioning"></DoMapAction>
  </div>
</template>
<script setup lang="ts">
import MapView from "/@/lib/core/src/components/MapView/Map.vue";
import { UiView, DoMapAction } from "/@/components/ReMap/index";
import { onBeforeMount, ref, reactive, onUnmounted, provide } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "/@/store/modules/vjmap/app";
import vjmap, { Map } from "vjmap";
import VjNavigationControl from "/@/lib/core/src/components/Controls/Navigation/index.vue";
import { MapExportControl } from "/@/lib/core/src/shared/mapExport";
import { useMapAction } from "../lib/mapAction";
import { useOperationStoreHook } from "/@/store/modules/operation";
import { getBlueprintSnapData } from "/@/api/task";
import { ResultType } from "/@/store/modules/types";
const app = useAppStore();
const id = useOperationStoreHook().GET_CURRENT_BLUEPRINT().id;
getBlueprintSnapData(id)
  .then((response: ResultType) => {
    if (response.success) {
      const features = response.data;
      if (features) {
        app.myAnnotataions = JSON.parse(features);
      } else {
        app.myAnnotataions = {};
      }
    }
  })
  .catch(error => {
    console.log(error.message);
  });
const route = useRoute();
let vmap: Map; // 地图对象
const isMapLoaded = ref(false);
const { isMapDoActioning } = useMapAction(
  ["mapui", "el-overlay", "vjmapgis-control-container"],
  ["labelCanvas"]
); // ui和对话框、控件层 labelCanvas为three图层,防止不能响应键盘事件
let mapId = ref("");
let mapopenway = vjmap.MapOpenWay.GeomRender; // 地图默认打开方式
let isVector = ref(false); // 矢量瓦片打开
let lightTheme = ref(false); // 浅色主题

const serviceUrl = app.serviceUrl;
const accessToken = app.accessToken;
const openMapParam = reactive({
  mapid: app.curMapId, // 地图ID,(请确保此ID已存在，可上传新图形新建ID)
  mapopenway: mapopenway, // 以几何数据渲染方式打开
  version: "v1",
  style: {
    backcolor: lightTheme.value ? 0xffffff : 0
  }
});

provide("map", () => vmap); // 注入地图对象

onBeforeMount(() => {
  const mapid = useOperationStoreHook().GET_CURRENT_BLUEPRINT().location;
  mapId.value = mapid;
  if (route.query?.version) {
    openMapParam.version = route.query.version as string;
  }
  app.setCurMapIdVer(mapId.value, openMapParam.version);
  openMapParam.mapid = app.curMapId;
  if (route.query?.mapopenway)
    openMapParam.mapopenway = route.query.mapopenway as any;
  if (route.query?.vector) isVector.value = route.query.vector == "true";
  if (route.query?.theme) {
    lightTheme.value = (route.query.theme as string) == "light";
  } else {
    lightTheme.value = app.lightTheme;
  }
  openMapParam.style = { backcolor: lightTheme.value ? 0xffffff : 0 };
});

onUnmounted(() => {
  app.setCurMapIdVer("");
});

const mapLoaded = async (map: Map) => {
  vmap = map;
  isMapLoaded.value = true;
  mapInit(map);
};

const mapInit = (map: Map) => {
  if (app.showMousePositionControl) {
    let mousePositionControl = new vjmap.MousePositionControl({
      showZoom: true
    });
    map.addControl(mousePositionControl, "bottom-left");
  }

  if (app.showMapExportControl) {
    let mapExportControl = new MapExportControl();
    map.addControl(mapExportControl, "top-left");
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  position: relative;
  height: 100vh;
}

.container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.map-container-dark {
  background: #022b4f;
}

.map-container-light {
  background-image: "linear-gradient(rgba(255, 255, 255, 1), rgba(233,255,255, 1), rgba(233,255,255, 1))";
}
</style>
