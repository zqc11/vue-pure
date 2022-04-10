<template>
  <div class="listPanel">
    <div class="header">
      <div>{{ curName }}</div>
    </div>
    <el-scrollbar class="content">
      <ul>
        <li
          v-for="(item, index) in propItems"
          :key="item.name + index"
          class="layeritem"
        >
          <div
            class="colorBlock"
            :style="'background:' + colors[index % colors.length]"
          ></div>
          <div class="propname" :title="item.name">{{ item.name }}</div>
          <el-tooltip
            class="propvalue"
            effect="dark"
            :content="item.value?.substring(0, 200)"
            placement="top-end"
          >
            <el-input class="propvalue" v-model="item.value" />
          </el-tooltip>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, Ref, ref } from "vue";
import { emitter } from "/@/utils/ui/ui";
import vjmap, { Map } from "vjmap";
const map = (inject("map") as Function)() as Map;
const propItems: Ref<
  {
    name: string;
    value: string;
  }[]
> = ref([]);
const curName = ref("当前图形");
let svc = map.getService();
// 获取所有图层
let colors: Ref<string[]> = ref([]);
colors.value = [...Array(50).keys()].map(_e => vjmap.randomColor()); // 生成随机颜色值

onMounted(async () => {
  // 实体类型ID和名称映射
  const { entTypeIdMap } = await svc.getConstData();
  map.enableLayerClickHighlight(svc, prop => {
    emitter.emit("activeSideBarTabs", {
      name: "Property",
      noAutoAdd: true
    });
    if (prop) {
      curName.value = prop.name;
      // 由实体类型名称得到类型值 https://vjmap.com/guide/svrStyleVar.html
      prop.entType = Object.keys(entTypeIdMap).find(
        k => entTypeIdMap[k] == prop.name
      ); //
      let clr = (prop.color >>> 0).toString(16); //转成无符号
      prop.colorRGB =
        "#" + clr.substring(6, 8) + clr.substring(4, 6) + clr.substring(2, 4); // 颜色由符号类型转成颜色字符串类型, 转成十六进制，去掉前面两位透明度
      setPropItems(prop, true);
    } else {
      curName.value = "当前图形";
      setPropItems(svc.currentMapParam());
    }
  });
});

onUnmounted(() => {
  map.disableLayerClickHighlight();
});

const setPropItems = (param: any, sortKey?: boolean) => {
  propItems.value = [];
  if (!param) return;
  let keys = Object.keys(param);
  if (sortKey) {
    keys = keys.sort();
  }
  for (let k of keys) {
    let value = param[k] !== undefined ? param[k] + "" : "";
    if (typeof param[k] == "object") {
      value = JSON.stringify(param[k]);
    }
    propItems.value.push({
      name: k,
      value: value
    });
  }
};
setPropItems(svc.currentMapParam());
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

  ul li .colorBlock {
    border: 1px solid #989898;
    display: inline-block;
    width: 16px;
    height: 100%;
  }

  .propname {
    width: 80px;
    text-align: left;
    margin-left: 5px;
  }

  .propvalue {
    flex: 1;
    text-align: left;
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>
