<template>
  <div>
    <el-divider direction="horizontal"></el-divider>
    <Splitpanes class="default-theme">
      <Pane v-show="showForm()" :size="showWidth()" :min-size="20">
        <!-- 显示表单信息 -->
        <div>hello</div>
      </Pane>
      <Pane v-show="showBlueprint()" :size="showWidth()" :min-size="20">
        <!-- 显示机械图纸 -->
        <Blueprint></Blueprint>
      </Pane>
    </Splitpanes>
  </div>
</template>

<script setup lang="ts">
import { inject, Ref } from "vue";
import { Blueprint } from "/@/components/ReFlowTask";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
let show = inject<Ref>("show");
function showWidth() {
  if (show.value == 1 || show.value == 2) {
    return 100;
  }
  return 50;
}
function showForm() {
  return show.value != 2;
}
function showBlueprint() {
  return show.value != 1;
}
</script>

<style>
.splitpanes.default-theme .splitpanes__splitter {
  background-color: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}

.default-theme.splitpanes--vertical > .splitpanes__splitter,
.default-theme .splitpanes--vertical > .splitpanes__splitter {
  width: 15px;
  border-left: 2px solid #bbb;
  margin-left: -1px;
}
</style>
