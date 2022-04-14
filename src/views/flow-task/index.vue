<template>
  <div>
    <!-- 功能栏 -->
    <el-row :gutter="1" type="flex" justify="end">
      <el-button-group>
        <el-button :type="unstart" @click="showUnStart">未开始</el-button>
        <el-button :type="starting" @click="showStarting">进行中</el-button>
        <el-button :type="started" @click="showStarted">已完成</el-button>
      </el-button-group>
      <el-col
        :md="{ span: 3, offset: 0 }"
        :lg="{ span: 2, offset: 0 }"
        :xl="{ span: 2, offset: 0 }"
        class="hidden-sm-and-down white-background"
      >
        <el-button type="primary" @click="newFlow" size="default"
          >新建流程审批</el-button
        >
      </el-col>
    </el-row>
    <el-divider class="hidden-sm-and-down"></el-divider>
    <!-- 审批流程 -->
    <el-row>
      <div v-for="task in tasks" :key="task.id">
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
          <TaskCard :task="task" :node="node" />
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
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
const router = useRouter();
const id = storageLocal.getItem("info").userInfo.id;

// 方法定义
function newFlow() {
  router.push("/newTask");
}
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
  filterNodes("进行中");
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
    nodes.value.push(
      ...task.flowChart.nodes.filter(node => node.properties.status === status)
    );
  });
};

// 方法执行
getTasks(id).then((data: ResultType) => {
  if (data.success) {
    tasks.value = data.data;
    filterNodes("进行中");
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
