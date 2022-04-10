<template>
  <div style="z-index: 2" class="mapui">
    <cmd-bar v-if="curAction == 'free'"></cmd-bar>
    <side-bar v-if="curAction == 'free'"></side-bar>
    <anno-bar v-if="curAction == 'annotataion'"></anno-bar>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref, watch } from "vue";
import { emitter } from "/@/utils/ui/ui";
import { CmdBar, SideBar, AnnoBar } from "/@/components/ReMap/index";
const curAction = ref("free"); // 当时动作

const changeUiAction = (action: string) => {
  curAction.value = action;
};
emitter.on("changeUiAction", changeUiAction);
onUnmounted(() => emitter.off("changeUiAction", changeUiAction));

watch(curAction, action => {
  let display = action == "free" ? "" : "none";
  let div = document.getElementsByClassName(
    "vjmapgis-control-container"
  )[0] as HTMLElement;
  div.style.display = display;
});
</script>
<style scoped></style>
