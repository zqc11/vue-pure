<template>
  <el-tabs
    v-model="editableTabsValue"
    type="border-card"
    :closable="true"
    class="box-card"
    @edit="handleTabsEdit"
    v-if="editableTabs.length"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
      <keep-alive>
        <component :is="tabCmps[item.name][1]"></component>
      </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { Component as Comp, onUnmounted, Ref, ref } from "vue";
import { emitter } from "/@/utils/ui/ui";
import { Annotation, LayerManage, Property, ViewPort } from "./panel/index";
const tabCmps: Record<string, [string, Comp]> = {
  Annotation: ["批注", Annotation],
  LayerManage: ["图层", LayerManage],
  Property: ["属性", Property],
  ViewPort: ["视口", ViewPort]
};

const editableTabsValue = ref("0");
const editableTabs: Ref<
  {
    title: string;
    name: string;
  }[]
> = ref([]);

const showTabs = (tabsName: string, noAutoAdd?: boolean) => {
  if (!tabCmps[tabsName]) return;
  const tabs = editableTabs.value;
  const idx = tabs.findIndex(tab => tab.name === tabsName);
  if (idx == -1) {
    if (noAutoAdd) return; // 不自动增加
    editableTabs.value.push({
      title: tabCmps[tabsName][0],
      name: tabsName
    });
  }
  editableTabsValue.value = tabsName;
};
const handleTabsEdit = (targetName: string, action: "remove" | "add") => {
  if (action === "remove") {
    const tabs = editableTabs.value;
    let activeName = editableTabsValue.value;
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            activeName = nextTab.name;
          }
        }
      });
    }

    editableTabsValue.value = activeName;
    editableTabs.value = tabs.filter(tab => tab.name !== targetName);
  }
};

const activeSideBarTabs = (param: any) => {
  let tabname = param.name;
  showTabs(tabname, param.noAutoAdd);
};

emitter.on("activeSideBarTabs", activeSideBarTabs);
onUnmounted(() => emitter.off("activeSideBarTabs", activeSideBarTabs));

showTabs("Property");
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 230px;
  position: absolute;
  right: 4px;
  top: 5px;
  bottom: 50px;
  background-color: white;
  opacity: 0.9;
  display: flex;
  flex-direction: column;
}

:deep(.el-tabs__header) {
  user-select: none;
}

:deep(.el-card__header) {
  padding: 2px 10px;
}

:deep(.el-tabs__content) {
  padding: 0px;
}

:deep(.el-tab-pane) {
  height: 100%;
}

.panel {
  width: 100%;
  height: 100%;
  background-color: white;
}

:deep(.el-tabs__item) {
  padding: 0px 6px;
}
</style>
