<template>
  <div>
    <el-row :gutter="0" justify="end">
      <el-col
        :xs="6"
        :sm="4"
        :md="2"
        :lg="2"
        :xl="2"
        class="hidden-sm-and-down"
      >
        <el-button class="top-menu-button" @click="showMarkMenu"
          >图纸标注</el-button
        >
      </el-col>
      <el-col :xs="6" :sm="4" :md="2" :lg="2" :xl="2">
        <el-button class="top-menu-button" @click="showForm"
          >仅显示表单</el-button
        >
      </el-col>
      <el-col :xs="6" :sm="4" :md="2" :lg="2" :xl="2">
        <el-button class="top-menu-button" @click="showBlueprint"
          >仅显示图纸</el-button
        >
      </el-col>
      <el-col
        :xs="6"
        :sm="4"
        :md="2"
        :lg="2"
        :xl="2"
        class="hidden-sm-and-down"
      >
        <el-button class="top-menu-button" @click="showAll">双列显示</el-button>
      </el-col>
    </el-row>
    <TaskInfo />
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from "vue";
import { TaskInfo } from "/@/components/ReFlowTask";
import "element-plus/theme-chalk/display.css";
let show = ref(2);
// 显示图纸标注工具栏
function showMarkMenu() {
  console.log();
}
// 显示表单信息
function showForm() {
  show.value = 1;
}
// 显示机械图纸
function showBlueprint() {
  show.value = 2;
}
// 两者都显示
function showAll() {
  show.value = 3;
}

// 向TaskInfo传递props
provide("show", show);
</script>

<style scoped>
.top-menu-button {
  width: 100%;
}
</style>
