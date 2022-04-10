<template>
  <div class="listPanel">
    <div class="header">
      <el-button
        type="success"
        size="small"
        :icon="DocumentAdd"
        @click="addViewPort"
        >新增视图</el-button
      >
    </div>
    <el-scrollbar class="content">
      <el-space direction="vertical">
        <el-empty
          description="空空如也"
          v-if="getMapViewPorts.length == 0"
        ></el-empty>
        <el-card
          v-for="item in getMapViewPorts"
          :key="item.id"
          class="box-card"
        >
          <template #header>
            <div class="card-header">
              <span>{{ item.name }}</span>
              <el-button
                class="button"
                size="small"
                :icon="Remove"
                @click="() => removeItem(item)"
              ></el-button>
            </div>
          </template>
          <el-image
            :class="[item.darkTheme ? 'drakBackground' : '', 'img']"
            lazy
            :src="item.imgSrc"
            fit="fill"
            @click="() => gotoView(item)"
          ></el-image>
        </el-card>
      </el-space>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import vjmap, { Map } from "vjmap";
import { DocumentAdd, Remove } from "@element-plus/icons-vue";
import { useAppStore, ViewPortInfo } from "/@/store/modules/vjmap/app";
import { getInput, showConfirm } from "/@/utils/ui/ui";
import { takeScreenshot } from "/@/lib/core/src/shared/func";
const app = useAppStore();

const map = (inject("map") as Function)() as Map;
let svc = map.getService();

const getMapViewPorts = computed(() => {
  let key = `${app.curMapId}_${app.curVersion}`;
  let viewPorts = app.myViewPorts as any;
  if (!viewPorts || !(key in viewPorts)) return [];
  return [...(viewPorts[key] as ViewPortInfo[])].reverse();
});

const addViewPort = async () => {
  try {
    let name = await getInput("新增视图", "请输入视图名称");
    let img = await takeScreenshot(map, 300);
    let center = map.getCenter();
    let viewInfo: ViewPortInfo = {
      mapId: app.curMapId,
      version: app.curVersion,
      name: name as string,
      darkTheme: svc.currentMapParam()?.darkMode === true ? true : false,
      imgSrc: img as string,
      zoom: map.getZoom(),
      centerX: center.lng,
      centerY: center.lat,
      bearing: map.getBearing(),
      pitch: map.getPitch(),
      id: vjmap.RandomID()
    };
    app.saveViewPort(viewInfo);
  } catch (error) {
    console.log(error.message);
  }
};

const removeItem = async (item: ViewPortInfo) => {
  try {
    await showConfirm(`是否真的要删除视口 ${item.name}`);
    app.removeViewPort(app.curMapId, app.curVersion, item.id);
  } catch (error) {
    console.log(error.message);
  }
};

const gotoView = (item: ViewPortInfo) => {
  map.flyTo({
    center: [item.centerX, item.centerY],
    zoom: item.zoom,
    pitch: item.pitch,
    bearing: item.bearing
  });
};
</script>

<style scoped lang="scss">
.listPanel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: end;
    border-bottom: 1px solid #989898;
    align-items: center;
    padding: 5px;
  }

  .card-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
  }

  .content {
    flex: 1;
  }

  :deep(.el-space) {
    display: block;
  }

  :deep(.el-card__body) {
    padding: 0px;
  }

  :deep(.el-card__header) {
    padding: 2px 2px;
  }

  .img {
    width: 100%;
    height: 200px;
    cursor: pointer;
  }
}

.drakBackground {
  background-color: #022b4f;
}
</style>
