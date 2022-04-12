<template>
  <div class="listPanel">
    <div class="header">
      <el-button
        type="primary"
        size="small"
        :icon="DocumentAdd"
        @click="addAnnotataion"
        >新增批注</el-button
      >
    </div>
    <el-scrollbar class="content">
      <el-space direction="vertical">
        <el-empty
          description="空空如也"
          v-if="getMapAnnotataions.length == 0"
        ></el-empty>
        <el-card
          v-for="item in getMapAnnotataions"
          :key="item.id"
          class="box-card"
        >
          <template #header>
            <div class="card-header">
              <div :title="item.name" @click="() => gotoView(item)">
                {{ item.name }}
              </div>
              <el-button-group class="ml-4">
                <el-tooltip effect="dark" content="编辑标注" placement="top">
                  <el-button
                    class="button"
                    size="small"
                    :icon="Edit"
                    @click="() => editItem(item)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="显示或隐藏标注"
                  placement="top"
                >
                  <el-button
                    class="button"
                    size="small"
                    :icon="Switch"
                    @click="() => switchItem(item)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除标注" placement="top">
                  <el-button
                    class="button"
                    size="small"
                    :icon="Remove"
                    @click="() => removeItem(item)"
                  ></el-button>
                </el-tooltip>
              </el-button-group>
            </div>
          </template>
          <!-- <el-image
            :class="[item.darkTheme ? 'drakBackground' : '', 'img']"
            lazy
            :src="item.imgSrc"
            fit="fill"
            @click="() => gotoView(item)"
          ></el-image> -->
        </el-card>
      </el-space>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick } from "vue";
import { Map, DivOverlay } from "vjmap";
import { DocumentAdd, Remove, Edit, Switch } from "@element-plus/icons-vue";
import { useAppStore, AnnotataionInfo } from "/@/store/modules/vjmap/app";
import { emitter, showConfirm } from "/@/utils/ui/ui";
import { createDivSvg } from "/@/utils/ui/map";
const app = useAppStore();
const map = (inject("map") as Function)() as Map;

const getMapAnnotataions = computed(() => {
  let key = `${app.curMapId}_${app.curVersion}`;
  let Annotataions = app.myAnnotataions as any;
  if (!Annotataions || !(key in Annotataions)) return [];
  return [...(Annotataions[key] as AnnotataionInfo[])].reverse();
});

const addAnnotataion = async () => {
  emitter.emit("changeUiAction", "annotataion");
};

const removeItem = async (item: AnnotataionInfo) => {
  try {
    await showConfirm(`是否真的要删除批注 ${item.name}`);
    app.removeAnnotataion(app.curMapId, app.curVersion, item.id);
    let annoIdDivOverlay = app.annoIdDivOverlay as any;
    let divOverlay = annoIdDivOverlay[item.id] as DivOverlay;
    if (divOverlay) {
      divOverlay.remove();
      delete annoIdDivOverlay[item.id];
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editItem = async (item: AnnotataionInfo) => {
  map.setCenter([item.centerX, item.centerY]);
  map.setZoom(item.zoom);
  map.setBearing(item.bearing);
  map.setPitch(item.pitch);
  emitter.emit("changeUiAction", "annotataion");
  await nextTick();
  emitter.emit("loadAnnotataion", item);
};

const switchItem = (item: AnnotataionInfo) => {
  let div = document.getElementById(item.id);
  if (div) {
    div.style.display = div.style.display == "none" ? "" : "none";
  }
};

const gotoView = (item: AnnotataionInfo) => {
  let div = document.getElementById(item.id);
  if (!div) {
    // 没有
    let divOverlay = createDivSvg(
      map,
      item.id,
      item.pt1,
      item.pt2,
      item.width,
      item.height,
      item.svg
    );
    (app.annoIdDivOverlay as any)[item.id] = divOverlay;
  }
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
