<template>
  <div class="righttop">
    <el-tag
      effect="dark"
      size="large"
      type="success"
      v-if="message != ''"
      class="tag"
      >{{ message }}</el-tag
    >
    <el-button type="success" @click="confirmOk()" :disabled="disableButtons"
      >确定</el-button
    >
    <el-button type="info" @click="onCancel()" :disabled="disableButtons"
      >取消</el-button
    >
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted, onMounted, inject } from "vue";
import { emitter } from "/@/utils/ui/ui";
import { Map } from "vjmap";
const map = (inject("map") as Function)() as Map;
const message = ref("");
const disableButtons = ref(false);

const confirmOk = () => {
  goBack("ok");
};

const onCancel = () => {
  goBack("cancel");
};

const goBack = (sel: string) => {
  emitter.emit("ismapDoAction", { do: false, sel });
};

const changActionUiStatus = (status: any) => {
  if (status.message !== undefined) {
    message.value = status.message;
  }
  if (status.disableButtons !== undefined) {
    disableButtons.value = status.disableButtons;
  }
};
emitter.on("changActionUiStatus", changActionUiStatus);
onUnmounted(() => emitter.off("changActionUiStatus", changActionUiStatus));

onMounted(() => map.setIsInteracting(true)); // 设置正在交互
onUnmounted(() => map.setIsInteracting(false)); // 取消设置交互
</script>

<style scoped lang="scss">
.righttop {
  position: absolute;
  right: 2px;
  margin: 10px;
}

.tag {
  margin-right: 10px;
}
</style>
