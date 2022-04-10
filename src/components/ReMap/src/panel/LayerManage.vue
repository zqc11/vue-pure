<template>
  <div class="listPanel">
    <div class="header">
      <div>全部图层</div>
      <el-switch
        v-model="allLayerOff"
        inline-prompt
        active-color="#777777"
        inactive-color="#13ce66"
        :active-icon="Close"
        :inactive-icon="Check"
        @change="doSwitchAllLayer"
      ></el-switch>
    </div>
    <el-scrollbar class="content">
      <ul>
        <li v-for="item in layers" :key="item.index" class="layeritem">
          <div
            class="layer-colorBlock"
            :style="'background:' + item.color"
          ></div>
          <div class="layer-text" :title="item.name">{{ item.name }}</div>
          <el-switch
            v-model="item.isOff"
            inline-prompt
            active-color="#777777"
            inactive-color="#13ce66"
            :active-icon="Close"
            :inactive-icon="Check"
            @change="doSwitchLayer"
          ></el-switch>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
import { Map } from "vjmap";
import { Check, Close } from "@element-plus/icons-vue";
const map = (inject("map") as Function)() as Map;
const allLayerOff = ref(false);
const layers = ref(map.getService().getMapLayers());

// 得到所有可视图层数组
const getVisibleLayer = () => {
  return layers.value.reduce((sum: string[], val) => {
    if (!val.isOff) {
      sum.push(val.name);
    }
    return sum;
  }, []);
};

const doSwitchLayer = () => {
  map.switchLayers(map.getService(), getVisibleLayer());
};

const doSwitchAllLayer = () => {
  layers.value.forEach(e => (e.isOff = allLayerOff.value));
  doSwitchLayer();
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
    justify-content: space-between;
    border-bottom: 1px solid #989898;
    align-items: center;
  }

  .layeritem {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .content {
    flex: 1;
  }

  ul li {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #989898;
    position: relative;
  }

  ul li .layer-colorBlock {
    border: 1px solid #989898;
    display: inline-block;
    width: 16px;
    height: 100%;
  }

  .layer-text {
    flex: 1;
    text-align: left;
    margin-left: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    width: 200px;
  }
}
</style>
