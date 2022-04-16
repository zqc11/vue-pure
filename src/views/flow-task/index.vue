<template>
  <div>
    <!-- 功能栏 -->
    <el-row :gutter="1" type="flex" justify="end">
      <el-button-group>
        <el-button :type="unstart" @click="showUnStart">未开始</el-button>
        <el-button :type="starting" @click="showStarting">进行中</el-button>
        <el-button :type="started" @click="showStarted">已完成</el-button>
      </el-button-group>
    </el-row>
    <el-divider class="hidden-sm-and-down"></el-divider>
    <!-- 审批流程 -->
    <el-row>
      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="6"
        :xl="6"
        v-for="node in nodes"
        :key="node.id"
        class="task-card"
      >
        <TaskCard :task="node.task" :node="node.node" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getTasks } from "/@/api/task";
import { storageLocal } from "/@/utils/storage";
import { ResultType } from "/@/store/modules/types";
import { TaskCard } from "/@/components/ReFlowTask";
import "element-plus/theme-chalk/display.css";
// 变量定义
let nodes = ref([]);
let tasks = ref([]);
let unstart = ref("");
let starting = ref("info");
let started = ref("");
const id = storageLocal.getItem("info").userInfo.id;

// 方法定义
const showUnStart = () => {
  unstart.value = "info";
  starting.value = "";
  started.value = "";
  filterNodes("未开始");
};
const showStarting = () => {
  unstart.value = "";
  starting.value = "info";
  started.value = "";
  filterNodes("进行中|被驳回");
};
const showStarted = () => {
  unstart.value = "";
  starting.value = "";
  started.value = "info";
  filterNodes("已完成");
};

const filterNodes = status => {
  nodes.value = [];
  tasks.value.forEach(task => {
    task.flowChart.nodes
      .filter(node => status.indexOf(node.properties.status) >= 0)
      .forEach(node => {
        nodes.value.push({
          task: task,
          node: node
        });
      });
  });
};

// 方法执行
getTasks(id).then((data: ResultType) => {
  if (data.success) {
    tasks.value = data.data;
    filterNodes("进行中|被驳回");
  }
});
</script>

<style scoped>
.white-background {
  background-color: white;
}

.task-card {
  width: fit-content;
  height: fit-content;
}
</style>
