<template>
  <div id="map-container"></div>
</template>

<script setup lang="ts">
import vjmap from "vjmap";
import "vjmap/dist/vjmap.min.css";
import { onMounted } from "vue";
import { useOperationStoreHook } from "/@/store/modules/operation";
let map = null;
const initmap = async function initMap() {
  const mapId = useOperationStoreHook().GET_CURRENT_BLUEPRINT().location;
  console.log(useOperationStoreHook().GET_CURRENT_BLUEPRINT());
  console.log(mapId);
  const env = {
    serviceUrl: "https://vjmap.com/server/api/v1",
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6MSwiVXNlcm5hbWUiOiJyb290MSIsIk5pY2tOYW1lIjoicm9vdDEiLCJBdXRob3JpdHlJZCI6InJvb3QiLCJCdWZmZXJUaW1lIjo4NjQwMCwiZXhwIjoxOTQyMzA1MjQxLCJpc3MiOiJ2am1hcCIsIm5iZiI6MTYyNjk0NDI0MX0.29OAA4Cnjtw780VxIxWqduLtszp1EtpSNHAmWjiL_OM",
    exampleMapId: "sys_zp"
  };
  // 地图服务对象
  let svc = new vjmap.Service(env.serviceUrl, env.accessToken);
  // 打开地图
  let res = await svc.openMap({
    mapid: mapId, // 地图ID
    mapopenway: vjmap.MapOpenWay.GeomRender, // 以几何数据渲染方式打开
    style: vjmap.openMapDarkStyle() // div为深色背景颜色时，这里也传深色背景样式
  });
  if (res.error) {
    // 如果打开出错
    console.error(res.error);
    return;
  }
  // 获取地图范围
  let mapExtent = vjmap.GeoBounds.fromString(res.bounds);
  // 根据地图范围建立几何投影坐标系
  let prj = new vjmap.GeoProjection(mapExtent);

  // 地图对象
  map = new vjmap.Map({
    container: "map-container", // DIV容器ID
    style: svc.vectorStyle(), // 样式，这里是栅格样式
    center: prj.toLngLat(mapExtent.center()), // 设置地图中心点
    zoom: 1, // 设置地图缩放级别,
    pitch: 0, // 倾斜角度
    renderWorldCopies: false // 不显示多屏地图
  });
  // 关联服务对象和投影对象
  map.attach(svc, prj);
  // 根据地图本身范围缩放地图至全图显示
  map.fitMapBounds();
  await map.onLoad(); // 等待地图加载完成
};
onMounted(initmap);
</script>

<style>
#map-container {
  width: 100%;
  height: 80vh;
  background: #022b4f;
}
</style>
